import type { DayMeals, MealSlot } from "../types";
import { getRecipe, recipesBySlot } from "./recipes";

/** 周一到周日的固定循环，下标 0 = 周一 */
export const WEEK_PLAN: DayMeals[] = [
  {
    breakfast: "b-oat-egg-banana",
    lunch: "l-chicken-broccoli-rice",
    dinner: "d-tomato-tofu-cuke",
    snack: "s-apple",
  },
  {
    breakfast: "b-toast-egg-soy",
    lunch: "l-steam-thigh-greens",
    dinner: "d-shrimp-zucchini-porridge",
    snack: "s-yogurt",
  },
  {
    breakfast: "b-yogurt-oat-berry",
    lunch: "l-beef-pepper-rice",
    dinner: "d-eggplant-egg-woodear",
    snack: "s-cucumber",
  },
  {
    breakfast: "b-veg-pork-congee",
    lunch: "l-pan-thigh-lettuce",
    dinner: "d-melon-shrimp-tofu",
    snack: "s-peanut",
  },
  {
    breakfast: "b-soy-egg-nut",
    lunch: "l-tomato-enoki-noodle",
    dinner: "d-garlic-broccoli-egg",
    snack: "s-apple",
  },
  {
    breakfast: "b-corn-egg-cuke",
    lunch: "l-potato-chicken-stew",
    dinner: "d-mushroom-kelp",
    snack: "s-yogurt",
  },
  {
    breakfast: "b-sweetpotato-milk-egg",
    lunch: "l-pepper-pork-rice",
    dinner: "d-silken-tofu-choysum",
    snack: "s-cucumber",
  },
];

export const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export const SLOT_LABEL: Record<MealSlot, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "加餐",
};

export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function defaultMealsForDate(date: Date): DayMeals {
  return WEEK_PLAN[weekdayIndex(date)];
}

export function nextSwapId(slot: MealSlot, currentId: string): string {
  const list = recipesBySlot(slot);
  const index = list.findIndex((recipe) => recipe.id === currentId);
  const next = list[(index + 1 + list.length) % list.length];
  return next.id;
}

export function assertPlanRecipes(): void {
  for (const day of WEEK_PLAN) {
    for (const slot of SLOTS) {
      getRecipe(day[slot]);
    }
  }
}
