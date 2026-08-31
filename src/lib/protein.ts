import type { Recipe } from "../types";

export type ProteinKind =
  | "chicken"
  | "thigh"
  | "shrimp"
  | "fish"
  | "beef"
  | "pork"
  | "egg"
  | "tofu"
  | "gan"
  | "edamame"
  | "other";

const FOOD_PROTEIN: Record<string, ProteinKind> = {
  chicken_breast: "chicken",
  chicken_thigh: "thigh",
  shrimp: "shrimp",
  dried_shrimp: "shrimp",
  sea_bass: "fish",
  beef_lean: "beef",
  pork_lean: "pork",
  pork_rib: "pork",
  tofu_gan: "gan",
  tofu: "tofu",
  silken_tofu: "tofu",
  tofu_shred: "tofu",
  edamame: "edamame",
  egg: "egg",
};

const NAME_TOKENS = [
  "鸡胸",
  "鸡腿",
  "虾",
  "鲈鱼",
  "鱼",
  "牛肉",
  "猪肉",
  "肉丝",
  "排骨",
  "香干",
  "豆腐",
  "毛豆",
  "鸡蛋",
  "茶叶蛋",
];

export function mainProtein(recipe: Recipe): ProteinKind {
  let best: ProteinKind = "other";
  let grams = 0;
  for (const item of recipe.ingredients) {
    if (item.group !== "protein") continue;
    const kind = FOOD_PROTEIN[item.food];
    if (!kind) continue;
    if (item.grams > grams) {
      grams = item.grams;
      best = kind;
    }
  }
  return best;
}

export function nameTokens(recipe: Recipe): string[] {
  return NAME_TOKENS.filter((token) => recipe.name.includes(token));
}

export function proteinOverlapPenalty(recipe: Recipe, used: Recipe[]): number {
  if (used.length === 0) return 0;
  let penalty = 0;
  const kind = mainProtein(recipe);
  if (kind !== "other" && used.some((item) => mainProtein(item) === kind)) {
    penalty += 4.8;
  }
  const tokens = new Set(used.flatMap(nameTokens));
  if (nameTokens(recipe).some((token) => tokens.has(token))) {
    penalty += 2.6;
  }
  return penalty;
}
