const LIQUIDS = new Set(["milk", "soymilk"]);

export function formatAmount(name: string, food: string, grams: number): string {
  const g = Math.round(grams);
  if (LIQUIDS.has(food) || name.includes("豆浆") || (name.includes("牛奶") && !name.includes("酸奶"))) {
    return `${g}ml`;
  }
  if (name.includes("鸡蛋") || name === "茶叶蛋") {
    const count = Math.max(1, Math.round(g / 50));
    return `${count}个 · ${g}g`;
  }
  return `${g}g`;
}

export function displayGroceryAmount(name: string, food: string, grams: number): string {
  return formatAmount(name, food, grams);
}

export function recipeWeight(grams: number[]): number {
  return grams.reduce((sum, n) => sum + n, 0);
}
