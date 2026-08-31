import { recipeMacros } from "../src/data/nutrition.ts";
import { mainProtein } from "../src/lib/protein.ts";
import { SLOTS } from "../src/data/plan.ts";
import { RECIPES, recipesBySlot } from "../src/data/recipes.ts";
import { generateDay } from "../src/lib/generate.ts";
import { DEMO_PROFILE, targetsOf, type Profile } from "../src/lib/profile.ts";

const date = new Date(2026, 7, 31);

const light: Profile = { ...DEMO_PROFILE, source: "user" };
const heavy: Profile = {
  heightCm: 180,
  weightKg: 82,
  age: 32,
  sex: "male",
  goal: "cut",
  source: "user",
};
const elder: Profile = {
  heightCm: 168,
  weightKg: 66,
  age: 62,
  sex: "male",
  goal: "maintain",
  source: "user",
};

console.log(`食谱总数 ${RECIPES.length}`);
if (RECIPES.length < 180) {
  throw new Error(`菜谱池太小：${RECIPES.length}，至少要 180 道`);
}
for (const slot of SLOTS) {
  console.log(`${slot} ${recipesBySlot(slot).length} 道`);
}

const names = new Set(RECIPES.map((r) => r.name));
if (names.size !== RECIPES.length) throw new Error("食谱名称有重复");

function menuLine(label: string, profile: Profile) {
  const day = generateDay(profile, date);
  const target = targetsOf(profile);
  let kcal = 0;
  let protein = 0;
  const dishes: string[] = [];
  const proteins: string[] = [];
  for (const slot of SLOTS) {
    const recipe = day.recipes[slot];
    const m = recipeMacros(recipe);
    kcal += m.kcal;
    protein += m.protein;
    dishes.push(recipe.name);
    proteins.push(mainProtein(recipe));
    if (m.kcal <= 0 || m.protein < 0 || m.carbs < 0 || m.fat < 0) {
      throw new Error(`${recipe.name} 缺宏量营养`);
    }
  }
  const gap = Math.abs(kcal - target.kcal);
  console.log(
    `${label} 目标${target.kcal} 实际${kcal} 差${gap} 蛋白${protein}/${target.protein} | ${dishes.join(" / ")}`,
  );
  if (gap > 120) {
    throw new Error(`${label} 偏离目标 ${gap}`);
  }
  const mains = proteins.filter((item) => item !== "other" && item !== "egg");
  const counted = mains.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  if (Object.values(counted).some((n) => n >= 3)) {
    throw new Error(`${label} 同一主蛋白一天出现三次：${mains.join(",")}`);
  }
  return dishes.join("|");
}

const a = menuLine("轻女减脂", light);
const b = menuLine("高个男减脂", heavy);
const c = menuLine("年长男维持", elder);
if (a === b || a === c || b === c) {
  throw new Error("不同身材排出了同一套菜");
}

const again = menuLine("轻女减脂复算", light);
if (again !== a) throw new Error("同一人同一天菜单不稳定");

console.log("个性化菜单校验通过");
