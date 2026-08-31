import { recipeMacros, roundMacros, sumMacros } from "../data/nutrition";
import { SLOTS } from "../data/plan";
import type { GroceryGroup, Ingredient, Macros, MealSlot, Recipe } from "../types";
import { displayGroceryAmount } from "./amounts";
import { toDateKey, weekDates } from "./date";
import { dayFromProfile, type GeneratedDay } from "./generate";
import type { Profile } from "./profile";
import { loadSwaps } from "./storage";

export function dayPlan(profile: Profile, date: Date): GeneratedDay {
  return dayFromProfile(profile, date, loadSwaps());
}

export function recipesForDate(profile: Profile, date: Date): Record<MealSlot, Recipe> {
  return dayPlan(profile, date).recipes;
}

export function dayMacros(profile: Profile, date: Date): Macros {
  const recipes = recipesForDate(profile, date);
  return roundMacros(sumMacros(SLOTS.map((slot) => recipeMacros(recipes[slot]))));
}

export interface GroceryItem {
  name: string;
  amount: string;
  grams: number;
  group: GroceryGroup;
}

const GROUP_ORDER: GroceryGroup[] = ["protein", "veg", "staple", "seasoning"];

export const GROUP_LABEL: Record<GroceryGroup, string> = {
  protein: "肉",
  veg: "菜",
  staple: "主食",
  seasoning: "调料",
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
    return {
      name,
      amount: displayGroceryAmount(name, items[0].food, grams),
      grams,
      group: items[0].group,
    };
  });
}

export function groceryForDates(
  profile: Profile,
  dates: Date[],
): { group: GroceryGroup; items: GroceryItem[] }[] {
  const ingredients = dates.flatMap((date) =>
    SLOTS.flatMap((slot) => recipesForDate(profile, date)[slot].ingredients),
  );
  const merged = mergeIngredients(ingredients).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return GROUP_ORDER.map((group) => ({
    group,
    items: merged.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);
}

export function groceryForToday(profile: Profile, date: Date) {
  return groceryForDates(profile, [date]);
}

export function groceryForWeek(profile: Profile, date: Date) {
  return groceryForDates(profile, weekDates(date));
}

export function streakDays(eaten: Record<string, Partial<Record<MealSlot, boolean>>>, today: Date): number {
  let count = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 60; i += 1) {
    const key = toDateKey(cursor);
    const day = eaten[key];
    const done = Boolean(day?.breakfast && day.lunch && day.dinner);
    if (!done) {
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
