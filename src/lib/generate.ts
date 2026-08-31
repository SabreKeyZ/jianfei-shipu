import { recipeMacros } from "../data/nutrition";
import { SLOTS } from "../data/plan";
import { getRecipe, recipesBySlot } from "../data/recipes";
import type { MealSlot, Recipe, SlotSwaps } from "../types";
import { formatAmount } from "./amounts";
import { hashString, mulberry32 } from "./rng";
import { personaOf, profileKey, targetsOf, type Persona, type Profile, type Targets } from "./profile";
import { recipeTags } from "./tags";
import { toDateKey } from "./date";
import { loadSwaps } from "./storage";

const FLEX = new Set([
  "rice",
  "porridge",
  "noodle_dry",
  "bread",
  "oats",
  "milk",
  "corn",
  "sweet_potato",
  "potato",
  "mantou",
  "banana",
  "apple",
  "mixed_rice",
]);

const SHARES: Record<Persona, Record<MealSlot, number>> = {
  light: { breakfast: 0.3, lunch: 0.4, dinner: 0.22, snack: 0.08 },
  standard: { breakfast: 0.28, lunch: 0.38, dinner: 0.24, snack: 0.1 },
  hearty: { breakfast: 0.26, lunch: 0.4, dinner: 0.22, snack: 0.12 },
  elder: { breakfast: 0.3, lunch: 0.36, dinner: 0.24, snack: 0.1 },
};

export interface GeneratedDay {
  dateKey: string;
  recipes: Record<MealSlot, Recipe>;
  target: Targets;
  persona: Persona;
}

export function generateDay(profile: Profile, date: Date): GeneratedDay {
  const dateKey = toDateKey(date);
  const target = targetsOf(profile);
  const persona = personaOf(profile);
  const rng = mulberry32(hashString(`${profileKey(profile)}|${dateKey}`));
  const shares = SHARES[persona];
  const picked = {} as Record<MealSlot, Recipe>;

  for (const slot of SLOTS) {
    const want = target.kcal * shares[slot];
    const used = new Set(Object.values(picked).map((recipe) => recipe.id));
    picked[slot] = scaleToward(pickSlot(slot, persona, rng, want, used), want);
  }

  let recipes = picked;
  for (let step = 0; step < 8; step += 1) {
    const total = dayKcal(recipes);
    const diff = total - target.kcal;
    if (Math.abs(diff) <= 80) break;
    if (diff > 80) {
      recipes = tighten(recipes, persona, rng, target.kcal);
    } else {
      recipes = {
        ...recipes,
        lunch: scaleToward(recipes.lunch, recipeMacros(recipes.lunch).kcal + Math.abs(diff) * 0.55),
        breakfast: scaleToward(
          recipes.breakfast,
          recipeMacros(recipes.breakfast).kcal + Math.abs(diff) * 0.3,
        ),
        snack: scaleToward(recipes.snack, recipeMacros(recipes.snack).kcal + Math.abs(diff) * 0.15),
      };
    }
  }

  return { dateKey, recipes, target, persona };
}

export function dayFromProfile(
  profile: Profile,
  date: Date,
  swaps: Record<string, SlotSwaps> = {},
): GeneratedDay {
  const generated = generateDay(profile, date);
  let next = generated;
  const daySwaps = swaps[generated.dateKey] ?? {};
  for (const slot of SLOTS) {
    const swapped = daySwaps[slot];
    if (swapped && swapped !== generated.recipes[slot].id) {
      next = applySwap(next, slot, swapped);
    }
  }
  return next;
}

export function swapCandidates(
  profile: Profile,
  date: Date,
  slot: MealSlot,
  currentId: string,
): Recipe[] {
  const day = dayFromProfile(profile, date, loadSwaps());
  const used = dayKcal(day.recipes) - recipeMacros(day.recipes[slot]).kcal;
  const budget = day.target.kcal - used;
  const list = recipesBySlot(slot)
    .filter((recipe) => recipe.id !== currentId)
    .map((recipe) => {
      const scaled = scaleToward(recipe, budget);
      return { recipe: scaled, gap: Math.abs(recipeMacros(scaled).kcal - budget) };
    })
    .sort((a, b) => a.gap - b.gap);
  return list.filter((item) => item.gap <= 160).map((item) => item.recipe).slice(0, 8);
}

export function nextFitSwap(
  profile: Profile,
  date: Date,
  slot: MealSlot,
  currentId: string,
): Recipe {
  const cands = swapCandidates(profile, date, slot, currentId);
  if (cands.length === 0) {
    const list = recipesBySlot(slot);
    const index = list.findIndex((recipe) => recipe.id === currentId);
    return list[(index + 1 + list.length) % list.length];
  }
  const rng = mulberry32(hashString(`${profileKey(profile)}|${toDateKey(date)}|swap|${currentId}`));
  return cands[Math.floor(rng() * Math.min(3, cands.length))];
}

function dayKcal(recipes: Record<MealSlot, Recipe>): number {
  return SLOTS.reduce((sum, slot) => sum + recipeMacros(recipes[slot]).kcal, 0);
}

function pickSlot(
  slot: MealSlot,
  persona: Persona,
  rng: () => number,
  want: number,
  used: Set<string>,
): Recipe {
  const scored = recipesBySlot(slot)
    .filter((recipe) => !used.has(recipe.id))
    .map((recipe) => {
      const kcal = recipeMacros(recipe).kcal;
      const fit = 1 - Math.min(Math.abs(kcal - want) / Math.max(want, 1), 1);
      return {
        recipe,
        score: personaScore(recipe, persona) + fit * 1.4 + rng() * 1.1,
      };
    })
    .sort((a, b) => b.score - a.score);
  return (scored[0] ?? { recipe: recipesBySlot(slot)[0] }).recipe;
}

function personaScore(recipe: Recipe, persona: Persona): number {
  const tags = recipeTags(recipe);
  let score = 0;
  if (persona === "light") {
    if (tags.has("light") || tags.has("lowCal")) score += 2.2;
    if (tags.has("highProtein")) score += 1.6;
    if (recipe.name.includes("鸡胸") || recipe.name.includes("豆腐") || recipe.name.includes("蛋")) {
      score += 0.9;
    }
    if (recipe.slot === "dinner" && tags.has("rice")) score -= 1.6;
    if (recipe.slot === "dinner" && tags.has("hearty")) score -= 2;
  }
  if (persona === "hearty") {
    if (tags.has("hearty") || tags.has("rice")) score += 2.2;
    if (recipe.name.includes("鸡腿") || recipe.name.includes("饭") || recipe.name.includes("面")) {
      score += 1;
    }
    if (recipe.slot === "lunch" && tags.has("lowCal")) score -= 1.2;
    if (recipe.slot === "snack" && recipeMacros(recipe).kcal >= 80) score += 0.8;
  }
  if (persona === "elder") {
    if (tags.has("soft")) score += 2.6;
    if (tags.has("stirFry")) score -= 2.2;
    if (recipe.minutes <= 18) score += 0.5;
    if (recipe.name.includes("粥") || recipe.name.includes("蒸") || recipe.name.includes("汤")) {
      score += 1.2;
    }
  }
  return score;
}

function scaleToward(recipe: Recipe, wantKcal: number): Recipe {
  const current = recipeMacros(recipe).kcal;
  if (current <= 0) return recipe;
  return scaleFlex(recipe, wantKcal / current);
}

function scaleFlex(recipe: Recipe, factor: number): Recipe {
  const clamped = Math.min(1.85, Math.max(0.52, factor));
  if (Math.abs(clamped - 1) < 0.04) return recipe;
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((item) => {
      if (!FLEX.has(item.food)) return item;
      const grams = Math.max(8, Math.round(item.grams * clamped));
      return { ...item, grams, amount: formatAmount(item.name, item.food, grams) };
    }),
  };
}

function tighten(
  recipes: Record<MealSlot, Recipe>,
  persona: Persona,
  rng: () => number,
  target: number,
): Record<MealSlot, Recipe> {
  const dinnerWant = target * SHARES[persona].dinner;
  const snackWant = target * SHARES[persona].snack;
  return {
    ...recipes,
    dinner: scaleToward(
      pickSlot("dinner", persona, rng, dinnerWant, new Set([recipes.breakfast.id, recipes.lunch.id])),
      dinnerWant,
    ),
    snack: scaleToward(pickSlot("snack", persona, rng, snackWant, new Set()), snackWant),
    lunch: scaleToward(recipes.lunch, recipeMacros(recipes.lunch).kcal * 0.9),
  };
}

export function applySwap(
  day: GeneratedDay,
  slot: MealSlot,
  recipeId: string,
): GeneratedDay {
  const base = getRecipe(recipeId);
  const used = dayKcal(day.recipes) - recipeMacros(day.recipes[slot]).kcal;
  const budget = day.target.kcal - used;
  return {
    ...day,
    recipes: { ...day.recipes, [slot]: scaleToward(base, budget) },
  };
}
