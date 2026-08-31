import type { Recipe } from "../types";
import { formatAmount } from "./amounts";

const PHOTO_SET = new Set([
  "apple.jpg",
  "bass.jpg",
  "beef.jpg",
  "chicken-cabbage.jpg",
  "chicken.jpg",
  "congee-egg.jpg",
  "congee.jpg",
  "corn.jpg",
  "cucumber.jpg",
  "egg.jpg",
  "fish.jpg",
  "fruit.jpg",
  "greens.jpg",
  "mixed-rice.jpg",
  "noodle.jpg",
  "nut.jpg",
  "oats.jpg",
  "pepper-pork.jpg",
  "pork.jpg",
  "potato.jpg",
  "ribs.jpg",
  "salad.jpg",
  "shrimp-tofu.jpg",
  "shrimp.jpg",
  "soup.jpg",
  "soy.jpg",
  "steamed-egg.jpg",
  "tea-egg.jpg",
  "toast.jpg",
  "tofu-soup.jpg",
  "tofu.jpg",
  "tomato-egg.jpg",
  "veg.jpg",
  "yogurt.jpg",
]);

export type DishRecipe = Pick<Recipe, "name" | "art" | "image" | "ingredients">;

function normalizeImage(image: string | undefined): string | null {
  if (!image) return null;
  const file = image.replace(/^\/?(dishes\/)?/, "");
  return PHOTO_SET.has(file) ? file : file;
}

function haystack(recipe: DishRecipe): { name: string; hay: string } {
  const name = recipe.name;
  const extras = (recipe.ingredients ?? [])
    .filter((item) => item.group !== "seasoning")
    .map((item) => item.name)
    .join("");
  return { name, hay: `${name}${extras}` };
}

/** Pick a photo from the dish name and main ingredients, not only `art`. */
export function matchDishPhoto(recipe: DishRecipe): string {
  const { name, hay } = haystack(recipe);

  if (/番茄炒蛋/.test(hay) || (/番茄/.test(hay) && /炒蛋|蛋花/.test(name) && !/汤|蒸|面/.test(name))) {
    return "tomato-egg.jpg";
  }
  if (/蒸蛋|蛋羹/.test(name)) return "steamed-egg.jpg";
  if (
    /青椒/.test(name) &&
    /肉丝|瘦肉|肉片/.test(hay) &&
    !/牛肉|鸡胸|鸡腿|鸡肉|鸡丝|鸡丁/.test(hay)
  ) {
    return "pepper-pork.jpg";
  }
  if (/鲈鱼/.test(hay)) return "bass.jpg";
  if (/鱼/.test(hay) && !/鱼香/.test(hay)) return "fish.jpg";
  if (/排骨/.test(hay)) return "ribs.jpg";
  if (/虾仁|鲜虾|白灼虾/.test(hay) && /豆腐/.test(hay) && !/粥/.test(name)) {
    return "shrimp-tofu.jpg";
  }
  if (/豆腐/.test(hay) && /汤|羹/.test(name)) return "tofu-soup.jpg";
  {
    const head = name.split("配")[0] ?? name;
    if (/粥/.test(head) && /蛋/.test(hay)) return "congee-egg.jpg";
    if (/粥/.test(head)) return "congee.jpg";
  }
  if (/面/.test(name) && !/面包/.test(name)) return "noodle.jpg";
  if (/鸡胸|鸡腿|鸡肉|手撕鸡/.test(hay) && /白菜/.test(name)) return "chicken-cabbage.jpg";
  if (/鸡胸|鸡腿|鸡丝|鸡丁|鸡块|鸡肉|手撕鸡/.test(hay)) return "chicken.jpg";
  if (/牛肉/.test(hay)) return "beef.jpg";
  if (/肉丝|瘦肉|猪肉|肉片/.test(hay) && !/牛肉/.test(hay)) return "pork.jpg";
  if (/虾仁|鲜虾|白灼虾/.test(hay) || (/虾/.test(name) && !/虾皮/.test(name))) {
    return "shrimp.jpg";
  }
  {
    const head = name.split("配")[0] ?? name;
    if (/青菜|生菜|空心菜|菜心/.test(head) && !/鸡|肉|虾|鱼|豆腐|蛋/.test(head)) {
      return "greens.jpg";
    }
  }
  if (/豆腐|香干/.test(hay)) return "tofu.jpg";
  if (/酸奶/.test(hay)) return "yogurt.jpg";
  if (/燕麦/.test(name)) return "oats.jpg";
  if (/面包|吐司/.test(name)) return "toast.jpg";
  if (/豆浆/.test(name)) return "soy.jpg";
  if (/玉米/.test(name)) return "corn.jpg";
  if (/土豆|红薯|紫薯|山药|南瓜/.test(name)) return "potato.jpg";
  if (/花生|坚果/.test(name)) return "nut.jpg";
  if (/杂粮饭/.test(name)) return "mixed-rice.jpg";
  if (/沙拉/.test(name)) return "salad.jpg";
  if ((/一个苹果/.test(name) || name === "一个苹果") && /苹果/.test(name)) return "apple.jpg";
  if (/苹果/.test(name) && name.length <= 6) return "apple.jpg";
  if (/一根黄瓜/.test(name) || name === "一根黄瓜") return "cucumber.jpg";
  if (/黄瓜/.test(name) && name.length <= 6 && !/炒|汤|粥/.test(name)) return "cucumber.jpg";
  if (/香蕉|草莓|猕猴桃|水果|圣女果/.test(hay) && !/鸡|肉|虾|鱼|豆腐/.test(name)) {
    return "fruit.jpg";
  }
  if ((/一个番茄/.test(name) || name === "一个番茄") && /番茄/.test(name)) return "fruit.jpg";
  if (/青菜|生菜|空心菜|菜心/.test(name)) return "greens.jpg";
  if (/汤|羹/.test(name)) return "soup.jpg";
  if (/茶叶蛋/.test(name) || (/水煮蛋|荷包蛋/.test(name) && name.length <= 10)) {
    return "tea-egg.jpg";
  }
  if (/蛋/.test(name)) return "egg.jpg";

  return `${recipe.art}.jpg`;
}

export function dishFile(recipe: DishRecipe): string {
  const explicit = normalizeImage(recipe.image);
  if (explicit && PHOTO_SET.has(explicit)) return explicit;
  const matched = matchDishPhoto(recipe);
  if (PHOTO_SET.has(matched)) return matched;
  const fallback = `${recipe.art}.jpg`;
  return PHOTO_SET.has(fallback) ? fallback : "veg.jpg";
}

export function dishSrc(recipe: DishRecipe): string {
  return `${import.meta.env.BASE_URL}dishes/${dishFile(recipe)}`;
}

export function mainIngredientLine(recipe: Recipe, max = 3): string {
  return recipe.ingredients
    .filter((item) => item.group !== "seasoning")
    .slice(0, max)
    .map((item) => `${item.name} ${formatAmount(item.name, item.food, item.grams)}`)
    .join(" · ");
}
