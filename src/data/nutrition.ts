import type { Ingredient, Macros, Recipe } from "../types";

/** 每 100 克可食部的估算值，内部自洽，不追求实验室精度 */
export const FOOD_PER_100G: Record<string, Macros> = {
  oats: { kcal: 379, protein: 13.2, carbs: 67.7, fat: 6.5 },
  milk: { kcal: 46, protein: 3.3, carbs: 5.0, fat: 1.5 },
  egg: { kcal: 144, protein: 13.1, carbs: 1.1, fat: 9.8 },
  banana: { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  bread: { kcal: 247, protein: 13.0, carbs: 41.3, fat: 4.2 },
  soymilk: { kcal: 31, protein: 3.0, carbs: 1.2, fat: 1.6 },
  yogurt: { kcal: 62, protein: 5.0, carbs: 6.4, fat: 1.8 },
  strawberry: { kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  rice: { kcal: 116, protein: 2.6, carbs: 25.6, fat: 0.3 },
  millet_dry: { kcal: 358, protein: 9.0, carbs: 75.1, fat: 3.1 },
  porridge: { kcal: 48, protein: 1.6, carbs: 9.8, fat: 0.4 },
  noodle_dry: { kcal: 348, protein: 11.0, carbs: 73.0, fat: 1.1 },
  corn: { kcal: 106, protein: 3.4, carbs: 22.8, fat: 1.2 },
  sweet_potato: { kcal: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
  potato: { kcal: 77, protein: 2.0, carbs: 17.2, fat: 0.1 },
  pumpkin: { kcal: 22, protein: 0.7, carbs: 4.9, fat: 0.1 },
  mantou: { kcal: 223, protein: 7.0, carbs: 47.0, fat: 1.1 },
  chicken_breast: { kcal: 110, protein: 23.1, carbs: 0, fat: 1.2 },
  chicken_thigh: { kcal: 125, protein: 19.7, carbs: 0, fat: 4.7 },
  pork_lean: { kcal: 143, protein: 20.3, carbs: 0, fat: 6.2 },
  beef_lean: { kcal: 106, protein: 20.2, carbs: 0, fat: 2.3 },
  shrimp: { kcal: 87, protein: 18.3, carbs: 0, fat: 0.8 },
  dried_shrimp: { kcal: 198, protein: 39.3, carbs: 2.5, fat: 2.8 },
  tofu: { kcal: 76, protein: 8.1, carbs: 1.9, fat: 4.2 },
  silken_tofu: { kcal: 18, protein: 1.9, carbs: 0.8, fat: 0.8 },
  tofu_shred: { kcal: 148, protein: 16.2, carbs: 4.2, fat: 7.1 },
  peanut: { kcal: 567, protein: 24.8, carbs: 16.1, fat: 49.2 },
  broccoli: { kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  tomato: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  cucumber: { kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },
  lettuce: { kcal: 14, protein: 1.4, carbs: 2.2, fat: 0.2 },
  spinach: { kcal: 24, protein: 2.6, carbs: 3.6, fat: 0.4 },
  greens: { kcal: 23, protein: 2.6, carbs: 3.2, fat: 0.3 },
  choysum: { kcal: 20, protein: 2.0, carbs: 3.0, fat: 0.2 },
  zucchini: { kcal: 16, protein: 1.2, carbs: 3.1, fat: 0.2 },
  eggplant: { kcal: 21, protein: 1.0, carbs: 4.9, fat: 0.1 },
  wood_ear: { kcal: 21, protein: 1.5, carbs: 5.4, fat: 0.2 },
  enoki: { kcal: 26, protein: 2.4, carbs: 5.3, fat: 0.2 },
  mushroom: { kcal: 22, protein: 2.7, carbs: 3.3, fat: 0.3 },
  winter_melon: { kcal: 11, protein: 0.4, carbs: 2.6, fat: 0.1 },
  kelp: { kcal: 13, protein: 1.0, carbs: 2.1, fat: 0.1 },
  pepper: { kcal: 22, protein: 0.9, carbs: 4.6, fat: 0.2 },
  loofah: { kcal: 20, protein: 1.0, carbs: 4.2, fat: 0.1 },
  lettuce_stem: { kcal: 15, protein: 1.0, carbs: 2.5, fat: 0.1 },
  cabbage: { kcal: 16, protein: 1.5, carbs: 2.2, fat: 0.1 },
  apple: { kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
  oil: { kcal: 884, protein: 0, carbs: 0, fat: 100 },
  garlic: { kcal: 149, protein: 6.4, carbs: 33.1, fat: 0.5 },
  ginger: { kcal: 80, protein: 1.8, carbs: 17.8, fat: 0.8 },
  scallion: { kcal: 32, protein: 1.8, carbs: 6.5, fat: 0.2 },
  soy_sauce: { kcal: 63, protein: 5.6, carbs: 8.6, fat: 0.1 },
  vinegar: { kcal: 18, protein: 0.3, carbs: 0.9, fat: 0 },
  sesame: { kcal: 565, protein: 18.2, carbs: 24.0, fat: 49.7 },
  nori: { kcal: 207, protein: 26.3, carbs: 44.3, fat: 1.1 },
  sea_bass: { kcal: 105, protein: 18.6, carbs: 0, fat: 3.4 },
  pork_rib: { kcal: 178, protein: 18.3, carbs: 0, fat: 11.4 },
  mixed_rice: { kcal: 118, protein: 3.2, carbs: 24.5, fat: 0.8 },
  tofu_gan: { kcal: 142, protein: 16.2, carbs: 4.1, fat: 6.8 },
  bean_sprout: { kcal: 18, protein: 2.1, carbs: 2.4, fat: 0.1 },
  celery: { kcal: 16, protein: 0.8, carbs: 3.0, fat: 0.2 },
  chive: { kcal: 27, protein: 2.4, carbs: 3.2, fat: 0.6 },
  water_spinach: { kcal: 23, protein: 2.2, carbs: 3.1, fat: 0.3 },
  carrot: { kcal: 37, protein: 0.9, carbs: 8.1, fat: 0.2 },
  onion: { kcal: 39, protein: 1.1, carbs: 9.0, fat: 0.1 },
  oyster_sauce: { kcal: 51, protein: 1.4, carbs: 10.8, fat: 0.2 },
  edamame: { kcal: 121, protein: 11.5, carbs: 8.5, fat: 5.2 },
  lotus_root: { kcal: 54, protein: 1.9, carbs: 12.4, fat: 0.1 },
};

export function ingredientMacros(item: Ingredient): Macros {
  const per = FOOD_PER_100G[item.food];
  if (!per) {
    throw new Error(`缺少食材营养：${item.food}`);
  }
  const k = item.grams / 100;
  return {
    kcal: per.kcal * k,
    protein: per.protein * k,
    carbs: per.carbs * k,
    fat: per.fat * k,
  };
}

export function sumMacros(list: Macros[]): Macros {
  return list.reduce(
    (acc, cur) => ({
      kcal: acc.kcal + cur.kcal,
      protein: acc.protein + cur.protein,
      carbs: acc.carbs + cur.carbs,
      fat: acc.fat + cur.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function recipeMacros(recipe: Recipe): Macros {
  return roundMacros(sumMacros(recipe.ingredients.map(ingredientMacros)));
}

export function roundMacros(m: Macros): Macros {
  return {
    kcal: Math.round(m.kcal),
    protein: Math.round(m.protein),
    carbs: Math.round(m.carbs),
    fat: Math.round(m.fat),
  };
}
