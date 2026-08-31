import type { Recipe } from "../types";
import { formatAmount } from "./amounts";

export function dishSrc(recipe: Pick<Recipe, "art" | "image">): string {
  const file = (recipe.image ?? `${recipe.art}.jpg`).replace(/^\/?(dishes\/)?/, "");
  return `${import.meta.env.BASE_URL}dishes/${file}`;
}

export function mainIngredientLine(recipe: Recipe, max = 3): string {
  return recipe.ingredients
    .filter((item) => item.group !== "seasoning")
    .slice(0, max)
    .map((item) => `${item.name} ${formatAmount(item.name, item.food, item.grams)}`)
    .join(" · ");
}
