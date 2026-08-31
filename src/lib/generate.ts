import { recipeMacros } from "../data/nutrition";
import { SLOTS } from "../data/plan";
import { getRecipe, recipesBySlot } from "../data/recipes";
import type { MealSlot, Recipe, SlotSwaps } from "../types";
import { formatAmount } from "./amounts";
import { toDateKey, weekDates } from "./date";
import { proteinOverlapPenalty } from "./protein";
import { personaOf, profileKey, targetsOf, type Persona, type Profile, type Targets } from "./profile";
import { hashString, mulberry32 } from "./rng";
import { loadRerolls, loadSwaps } from "./storage";
import { recipeTags } from "./tags";

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
  "yam",
  "purple_potato",
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
  const rolls = loadRerolls();
  const usedCounts = new Map<string, number>();
  let result: GeneratedDay | null = null;
  for (const day of weekDates(date)) {
    const key = toDateKey(day);
    const generated = generateOne(profile, day, rolls[key] ?? 0, usedCounts);
    if (key === dateKey) result = generated;
    bump(usedCounts, generated.recipes.lunch.id);
    bump(usedCounts, generated.recipes.dinner.id);
  }
  return result ?? generateOne(profile, date, rolls[dateKey] ?? 0, new Map());
}

function generateOne(
  profile: Profile,
  date: Date,
  roll: number,
  usedCounts: Map<string, number>,
): GeneratedDay {
  const dateKey = toDateKey(date);
  const target = targetsOf(profile);
  const persona = personaOf(profile);
  const rng = mulberry32(hashString(`${profileKey(profile)}|${dateKey}|r${roll}`));
  const shares = SHARES[persona];
  const picked = {} as Record<MealSlot, Recipe>;

  for (const slot of SLOTS) {
    const want = target.kcal * shares[slot];
    const usedRecipes = Object.values(picked);
    const usedIds = new Set(usedRecipes.map((recipe) => recipe.id));
    picked[slot] = scaleToward(
      pickSlot(slot, persona, rng, want, usedIds, usedRecipes, usedCounts),
      want,
    );
  }

  let recipes = picked;
  for (let step = 0; step < 8; step += 1) {
    const total = dayKcal(recipes);
    const diff = total - target.kcal;
    if (Math.abs(diff) <= 80) break;
    if (diff > 80) {
      recipes = tighten(recipes, persona, rng, target.kcal, usedCounts);
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
  const current = day.recipes[slot];
  const used = dayKcal(day.recipes) - recipeMacros(current).kcal;
  const budget = day.target.kcal - used;
  const others = Object.values(day.recipes).filter((recipe) => recipe.id !== currentId);
  const list = recipesBySlot(slot)
    .filter((recipe) => recipe.id !== currentId)
    .map((recipe) => {
      const scaled = scaleToward(recipe, budget);
      const gap = Math.abs(recipeMacros(scaled).kcal - budget);
      const penalty = proteinOverlapPenalty(recipe, others);
      return { recipe: scaled, gap, penalty };
    })
    .sort((a, b) => a.penalty - b.penalty || a.gap - b.gap);
  const fit = list.filter((item) => item.gap <= 160);
  return (fit.length > 0 ? fit : list).map((item) => item.recipe).slice(0, 8);
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
  const roll = loadRerolls()[toDateKey(date)] ?? 0;
  const rng = mulberry32(
    hashString(`${profileKey(profile)}|${toDateKey(date)}|swap|${currentId}|r${roll}`),
  );
  return cands[Math.floor(rng() * Math.min(4, cands.length))];
}

function dayKcal(recipes: Record<MealSlot, Recipe>): number {
  return SLOTS.reduce((sum, slot) => sum + recipeMacros(recipes[slot]).kcal, 0);
}

function pickSlot(
  slot: MealSlot,
  persona: Persona,
  rng: () => number,
  want: number,
  usedIds: Set<string>,
  usedRecipes: Recipe[],
  usedCounts: Map<string, number>,
): Recipe {
  const scored = recipesBySlot(slot)
    .filter((recipe) => !usedIds.has(recipe.id))
    .map((recipe) => {
      const kcal = recipeMacros(recipe).kcal;
      const fit = 1 - Math.min(Math.abs(kcal - want) / Math.max(want, 1), 1);
      const weekOveruse =
        (slot === "lunch" || slot === "dinner") && (usedCounts.get(recipe.id) ?? 0) >= 2
          ? 12
          : 0;
      return {
        recipe,
        score:
          personaScore(recipe, persona) +
          fit * 1.4 +
          rng() * 1.4 -
          proteinOverlapPenalty(recipe, usedRecipes) -
          weekOveruse,
      };
    })
    .sort((a, b) => b.score - a.score);
  return (scored[0] ?? { recipe: recipesBySlot(slot)[0] }).recipe;
}

function personaScore(recipe: Recipe, persona: Persona): number {
  const tags = recipeTags(recipe);
  let score = 0;
  if (persona === "light") {
    if (tags.has("light") || tags.has("lowCal")) score += 1.8;
    if (tags.has("highProtein")) score += 1.1;
    if (recipe.slot === "dinner" && tags.has("rice")) score -= 1.6;
    if (recipe.slot === "dinner" && tags.has("hearty")) score -= 2;
  }
  if (persona === "hearty") {
    if (tags.has("hearty") || tags.has("rice")) score += 2.2;
    if (recipe.name.includes("饭") || recipe.name.includes("面")) score += 0.6;
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
  usedCounts: Map<string, number>,
): Record<MealSlot, Recipe> {
  const dinnerWant = target * SHARES[persona].dinner;
  const snackWant = target * SHARES[persona].snack;
  return {
    ...recipes,
    dinner: scaleToward(
      pickSlot(
        "dinner",
        persona,
        rng,
        dinnerWant,
        new Set([recipes.breakfast.id, recipes.lunch.id]),
        [recipes.breakfast, recipes.lunch],
        usedCounts,
      ),
      dinnerWant,
    ),
    snack: scaleToward(
      pickSlot("snack", persona, rng, snackWant, new Set(), [recipes.breakfast, recipes.lunch], usedCounts),
      snackWant,
    ),
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

function bump(map: Map<string, number>, id: string): void {
  map.set(id, (map.get(id) ?? 0) + 1);
}
