import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECIPES } from "../src/data/recipes.ts";
import { dishFile, matchDishPhoto } from "../src/lib/dish.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = new Set(readdirSync(join(root, "public/dishes")));

const expectFile: Array<[string, string]> = [
  ["番茄炒蛋配清炒青菜", "tomato-egg.jpg"],
  ["番茄炒蛋配杂粮饭", "tomato-egg.jpg"],
  ["全麦馒头配番茄炒蛋", "tomato-egg.jpg"],
  ["番茄蛋花配全麦馒头", "tomato-egg.jpg"],
  ["蒸蛋羹配白粥", "steamed-egg.jpg"],
  ["番茄蒸蛋", "steamed-egg.jpg"],
  ["蒜蓉西兰花配蒸蛋", "steamed-egg.jpg"],
  ["青椒炒瘦肉丝配饭和汤", "pepper-pork.jpg"],
  ["青椒肉丝配拍黄瓜", "pepper-pork.jpg"],
  ["番茄豆腐汤配拍黄瓜", "tofu-soup.jpg"],
  ["白菜豆腐汤", "tofu-soup.jpg"],
  ["清蒸鲈鱼配小碗饭", "bass.jpg"],
  ["清蒸鲈鱼配菜心饭", "bass.jpg"],
  ["鲈鱼豆腐汤配饭", "bass.jpg"],
  ["虾仁烧豆腐配时蔬", "shrimp-tofu.jpg"],
  ["青菜瘦肉粥配茶叶蛋", "congee-egg.jpg"],
  ["小米粥配茶叶蛋和黄瓜", "congee-egg.jpg"],
  ["一根黄瓜", "cucumber.jpg"],
  ["一个苹果", "apple.jpg"],
  ["手撕鸡胸配白菜和饭", "chicken-cabbage.jpg"],
  ["鸡胸炒西兰花配小碗饭", "chicken.jpg"],
  ["冬瓜排骨汤", "ribs.jpg"],
  ["瘦牛肉炒青椒配饭", "beef.jpg"],
  ["番茄金针菇鸡丝面", "noodle.jpg"],
  ["一枚茶叶蛋", "tea-egg.jpg"],
  ["无糖原味酸奶", "yogurt.jpg"],
  ["蒜蓉生菜配豆浆茶叶蛋", "greens.jpg"],
  ["清炒空心菜配白灼豆腐", "greens.jpg"],
  ["蚝油生菜配水煮蛋", "greens.jpg"],
];

const byName = new Map(RECIPES.map((recipe) => [recipe.name, recipe]));
const failures: string[] = [];

for (const [name, file] of expectFile) {
  const recipe = byName.get(name);
  if (!recipe) {
    failures.push(`找不到食谱「${name}」`);
    continue;
  }
  const got = dishFile(recipe);
  if (got !== file) {
    failures.push(`${name}: 期望 ${file}，实际 ${got}（matcher ${matchDishPhoto(recipe)}）`);
  }
}

const broccoli = byName.get("鸡胸炒西兰花配小碗饭");
const cabbage = byName.get("手撕鸡胸配白菜和饭");
if (broccoli && cabbage && dishFile(broccoli) === dishFile(cabbage)) {
  failures.push("鸡胸炒西兰花 和 手撕鸡胸配白菜 不该共用同一张图");
}

for (const recipe of RECIPES) {
  const file = dishFile(recipe);
  if (!files.has(file)) {
    failures.push(`${recipe.name} → ${file} 文件不存在`);
  }
}

const required = [
  "tomato-egg.jpg",
  "steamed-egg.jpg",
  "greens.jpg",
  "pepper-pork.jpg",
  "tofu-soup.jpg",
  "fish.jpg",
  "shrimp-tofu.jpg",
  "congee-egg.jpg",
  "cucumber.jpg",
  "apple.jpg",
  "chicken-cabbage.jpg",
  "tea-egg.jpg",
];
for (const file of required) {
  if (!files.has(file)) failures.push(`缺少新图 ${file}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  throw new Error(`菜图校验失败 ${failures.length} 项`);
}

console.log(`菜图校验通过：${RECIPES.length} 道都有对应照片`);
