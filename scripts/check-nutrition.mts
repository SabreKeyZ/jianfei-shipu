import { recipeMacros } from "../src/data/nutrition.ts";
import { WEEK_PLAN } from "../src/data/plan.ts";
import { getRecipe, RECIPES, recipesBySlot } from "../src/data/recipes.ts";
import type { MealSlot } from "../src/types.ts";

const slots: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];
const names = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

console.log(`食谱总数 ${RECIPES.length}`);
for (const slot of slots) {
  console.log(`${slot} ${recipesBySlot(slot).length} 道`);
}

const unique = new Set(RECIPES.map((r) => r.name));
if (unique.size !== RECIPES.length) {
  throw new Error("食谱名称有重复");
}

for (const [i, day] of WEEK_PLAN.entries()) {
  let kcal = 0;
  let protein = 0;
  for (const slot of slots) {
    const recipe = getRecipe(day[slot]);
    const m = recipeMacros(recipe);
    kcal += m.kcal;
    protein += m.protein;
  }
  console.log(`${names[i]} ${kcal} 千卡 / 蛋白 ${protein} 克`);
  if (kcal < 1400 || kcal > 1600) {
    throw new Error(`${names[i]} 热量 ${kcal} 不在 1400-1600`);
  }
  if (protein < 90 || protein > 110) {
    throw new Error(`${names[i]} 蛋白质 ${protein} 不在 90-110`);
  }
}

console.log("营养校验通过");
