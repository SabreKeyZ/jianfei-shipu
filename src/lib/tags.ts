import { recipeMacros } from "../data/nutrition";
import type { Recipe } from "../types";

export type MenuFilter = "all" | "quick" | "highProtein" | "lowCal";

export function recipeTags(recipe: Recipe): Set<string> {
  const macros = recipeMacros(recipe);
  const tags = new Set<string>();
  const text = recipe.name + recipe.steps.join("");
  if (recipe.minutes <= 15) tags.add("quick");
  if (macros.protein >= 28 || macros.protein / Math.max(macros.kcal, 1) >= 0.075) {
    tags.add("highProtein");
  }
  if (macros.kcal <= 360 || (recipe.slot === "snack" && macros.kcal <= 130)) {
    tags.add("lowCal");
  }
  if (
    recipe.art === "congee" ||
    recipe.art === "soup" ||
    text.includes("蒸") ||
    text.includes("粥") ||
    text.includes("汤") ||
    text.includes("焯") ||
    text.includes("水煮")
  ) {
    tags.add("soft");
  }
  if (text.includes("炒") || text.includes("煎")) tags.add("stirFry");
  if (recipe.slot === "lunch" && macros.kcal >= 500) tags.add("hearty");
  if (recipe.slot === "dinner" && macros.kcal <= 380) tags.add("light");
  if (recipe.ingredients.some((item) => item.food === "rice" && item.grams >= 140)) {
    tags.add("rice");
  }
  return tags;
}

export function matchesFilter(recipe: Recipe, filter: MenuFilter): boolean {
  if (filter === "all") return true;
  const tags = recipeTags(recipe);
  if (filter === "quick") return tags.has("quick");
  if (filter === "highProtein") return tags.has("highProtein");
  return tags.has("lowCal");
}

export const FILTER_LABEL: Record<MenuFilter, string> = {
  all: "全部",
  quick: "快手",
  highProtein: "高蛋白",
  lowCal: "低卡",
};
