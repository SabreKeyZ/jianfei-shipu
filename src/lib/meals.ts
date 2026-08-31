import { recipeMacros, roundMacros, sumMacros } from "../data/nutrition";
import { defaultMealsForDate, SLOTS } from "../data/plan";
import { getRecipe } from "../data/recipes";
import type { DayMeals, GroceryGroup, Ingredient, Macros, MealSlot, Recipe, SlotSwaps } from "../types";
import { toDateKey, weekDates } from "./date";
import { loadSwaps } from "./storage";

export function mealsForDate(date: Date, swaps?: Record<string, SlotSwaps>): DayMeals {
  const base = defaultMealsForDate(date);
  const daySwaps = (swaps ?? loadSwaps())[toDateKey(date)] ?? {};
  return {
    breakfast: daySwaps.breakfast ?? base.breakfast,
    lunch: daySwaps.lunch ?? base.lunch,
    dinner: daySwaps.dinner ?? base.dinner,
    snack: daySwaps.snack ?? base.snack,
  };
}

export function recipesForDate(date: Date, swaps?: Record<string, SlotSwaps>): Record<MealSlot, Recipe> {
  const meals = mealsForDate(date, swaps);
  return {
    breakfast: getRecipe(meals.breakfast),
    lunch: getRecipe(meals.lunch),
    dinner: getRecipe(meals.dinner),
    snack: getRecipe(meals.snack),
  };
}

export function dayMacros(date: Date, swaps?: Record<string, SlotSwaps>): Macros {
  const recipes = recipesForDate(date, swaps);
  return roundMacros(sumMacros(SLOTS.map((slot) => recipeMacros(recipes[slot]))));
}

export interface GroceryItem {
  name: string;
  amount: string;
  grams: number;
  group: GroceryGroup;
}

const GROUP_ORDER: GroceryGroup[] = ["veg", "protein", "staple", "seasoning"];

export const GROUP_LABEL: Record<GroceryGroup, string> = {
  veg: "蔬菜水果",
  protein: "肉蛋豆坚果",
  staple: "主食奶豆制品",
  seasoning: "调味",
};

function mergeIngredients(list: Ingredient[]): GroceryItem[] {
  const map = new Map<string, Ingredient[]>();
  for (const item of list) {
    const bucket = map.get(item.name) ?? [];
    bucket.push(item);
    map.set(item.name, bucket);
  }

  return [...map.entries()].map(([name, items]) => {
    const grams = items.reduce((sum, item) => sum + item.grams, 0);
    const amount =
      items.length === 1 ? items[0].amount : mergeAmount(name, items, grams);
    return { name, amount, grams, group: items[0].group };
  });
}

function mergeAmount(name: string, items: Ingredient[], grams: number): string {
  if (items.every((item) => item.amount.includes("克"))) {
    return `${Math.round(grams)} 克`;
  }
  if (items.every((item) => item.amount.includes("毫升"))) {
    return `${Math.round(grams)} 毫升`;
  }
  if (name.includes("鸡蛋") || name === "茶叶蛋") {
    const count = items.reduce((sum, item) => {
      const matched = item.amount.match(/(\d+)/);
      return sum + (matched ? Number(matched[1]) : 1);
    }, 0);
    return `${count} 个`;
  }
  return items.map((item) => item.amount).join(" + ");
}

export function groceryForDates(dates: Date[]): { group: GroceryGroup; items: GroceryItem[] }[] {
  const swaps = loadSwaps();
  const ingredients = dates.flatMap((date) =>
    SLOTS.flatMap((slot) => recipesForDate(date, swaps)[slot].ingredients),
  );
  const merged = mergeIngredients(ingredients).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return GROUP_ORDER.map((group) => ({
    group,
    items: merged.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);
}

export function groceryForToday(date: Date) {
  return groceryForDates([date]);
}

export function groceryForWeek(date: Date) {
  return groceryForDates(weekDates(date));
}
