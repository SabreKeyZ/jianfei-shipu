import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL, SLOTS } from "../data/plan";
import type { MealSlot, Recipe } from "../types";
import { mainIngredientLine } from "./dish";

export function todayShareText(
  recipes: Record<MealSlot, Recipe>,
  kcal: number,
): string {
  const lines = SLOTS.map((slot) => {
    const recipe = recipes[slot];
    const macros = recipeMacros(recipe);
    const short = SLOT_LABEL[slot].slice(0, 1);
    return `${short} ${recipe.name}（${recipe.minutes}分钟 · ${macros.kcal}kcal）\n  ${mainIngredientLine(recipe)}`;
  });
  return [`今日减脂菜单（${kcal} kcal）`, ...lines, "", "按身材排的家常菜 · 今日减脂"].join("\n");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
