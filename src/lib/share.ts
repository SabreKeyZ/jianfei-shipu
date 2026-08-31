import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL, SLOTS } from "../data/plan";
import type { GroceryGroup, MealSlot, Recipe } from "../types";
import { mainIngredientLine } from "./dish";
import type { GroceryItem } from "./meals";

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

const COPY_HEADERS: { group: GroceryGroup; title: string }[] = [
  { group: "protein", title: "肉" },
  { group: "veg", title: "菜" },
  { group: "staple", title: "主食" },
];

function copyQty(item: GroceryItem): string {
  if (item.amount.endsWith("ml")) return item.amount;
  return `${Math.round(item.grams)}g`;
}

export function groceryShareText(
  scope: "today" | "week",
  sections: { group: GroceryGroup; items: GroceryItem[] }[],
): string {
  const lines = [scope === "week" ? "🛒 本周采购" : "🛒 今日采购"];
  for (const { group, title } of COPY_HEADERS) {
    const items = sections.find((section) => section.group === group)?.items ?? [];
    if (items.length === 0) continue;
    lines.push(`—— ${title} ——`);
    for (const item of items) {
      lines.push(`${item.name} ${copyQty(item)}`);
    }
  }
  const seasoning = sections.find((section) => section.group === "seasoning")?.items ?? [];
  if (seasoning.length > 0) {
    lines.push(`调味: ${seasoning.map((item) => item.name).join("、")}`);
  }
  return lines.join("\n");
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
