import type { FoodArtKind, GroceryGroup, Ingredient, MealSlot, Recipe } from "../types";

function i(
  name: string,
  amount: string,
  food: string,
  grams: number,
  group: GroceryGroup,
): Ingredient {
  return { name, amount, food, grams, group };
}

type PKey =
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
  | "rib";

type VKey =
  | "broccoli"
  | "greens"
  | "tomato"
  | "cuke"
  | "lettuce"
  | "spinach"
  | "pepper"
  | "cabbage"
  | "carrot"
  | "mushroom"
  | "enoki"
  | "zucchini"
  | "eggplant"
  | "winter"
  | "kelp"
  | "sprout"
  | "celery"
  | "chive"
  | "loofah"
  | "lotus"
  | "onion"
  | "choysum"
  | "water"
  | "pumpkin"
  | "yam"
  | "bitter"
  | "okra"
  | "bean"
  | "pea"
  | "wood";

type SKey =
  | "rice"
  | "porridge"
  | "none"
  | "milk"
  | "oats"
  | "mantou"
  | "soy"
  | "corn"
  | "mixed"
  | "noodle"
  | "potato"
  | "yamStaple"
  | "purple"
  | "bread";

type Method = "stir" | "steam" | "soup" | "boil" | "cold" | "congee";

const PROTEIN: Record<PKey, { name: string; food: string; grams: number }> = {
  chicken: { name: "鸡胸肉", food: "chicken_breast", grams: 150 },
  thigh: { name: "鸡腿肉（去皮）", food: "chicken_thigh", grams: 150 },
  shrimp: { name: "虾仁", food: "shrimp", grams: 120 },
  fish: { name: "鲈鱼", food: "sea_bass", grams: 200 },
  beef: { name: "瘦牛肉", food: "beef_lean", grams: 140 },
  pork: { name: "瘦猪肉", food: "pork_lean", grams: 120 },
  egg: { name: "鸡蛋", food: "egg", grams: 100 },
  tofu: { name: "北豆腐", food: "tofu", grams: 200 },
  gan: { name: "香干", food: "tofu_gan", grams: 90 },
  edamame: { name: "毛豆", food: "edamame", grams: 80 },
  rib: { name: "猪肋排", food: "pork_rib", grams: 130 },
};

const VEG: Record<VKey, { name: string; food: string; grams: number }> = {
  broccoli: { name: "西兰花", food: "broccoli", grams: 160 },
  greens: { name: "小白菜", food: "greens", grams: 160 },
  tomato: { name: "番茄", food: "tomato", grams: 180 },
  cuke: { name: "黄瓜", food: "cucumber", grams: 150 },
  lettuce: { name: "生菜", food: "lettuce", grams: 160 },
  spinach: { name: "菠菜", food: "spinach", grams: 150 },
  pepper: { name: "青椒", food: "pepper", grams: 150 },
  cabbage: { name: "白菜", food: "cabbage", grams: 180 },
  carrot: { name: "胡萝卜", food: "carrot", grams: 140 },
  mushroom: { name: "鲜香菇", food: "mushroom", grams: 120 },
  enoki: { name: "金针菇", food: "enoki", grams: 120 },
  zucchini: { name: "西葫芦", food: "zucchini", grams: 180 },
  eggplant: { name: "茄子", food: "eggplant", grams: 180 },
  winter: { name: "冬瓜", food: "winter_melon", grams: 220 },
  kelp: { name: "海带丝", food: "kelp", grams: 80 },
  sprout: { name: "绿豆芽", food: "bean_sprout", grams: 160 },
  celery: { name: "芹菜", food: "celery", grams: 150 },
  chive: { name: "韭菜", food: "chive", grams: 140 },
  loofah: { name: "丝瓜", food: "loofah", grams: 180 },
  lotus: { name: "莲藕", food: "lotus_root", grams: 160 },
  onion: { name: "洋葱", food: "onion", grams: 140 },
  choysum: { name: "菜心", food: "choysum", grams: 160 },
  water: { name: "空心菜", food: "water_spinach", grams: 170 },
  pumpkin: { name: "南瓜", food: "pumpkin", grams: 180 },
  yam: { name: "山药", food: "yam", grams: 160 },
  bitter: { name: "苦瓜", food: "bitter_melon", grams: 150 },
  okra: { name: "秋葵", food: "okra", grams: 140 },
  bean: { name: "四季豆", food: "green_bean", grams: 150 },
  pea: { name: "豌豆", food: "pea", grams: 80 },
  wood: { name: "水发木耳", food: "wood_ear", grams: 80 },
};

const STAPLE: Record<SKey, { name: string; food: string; grams: number } | null> = {
  rice: { name: "米饭", food: "rice", grams: 160 },
  porridge: { name: "杂粮粥", food: "porridge", grams: 200 },
  none: null,
  milk: { name: "低脂牛奶", food: "milk", grams: 220 },
  oats: { name: "燕麦片", food: "oats", grams: 45 },
  mantou: { name: "全麦馒头", food: "mantou", grams: 80 },
  soy: { name: "无糖豆浆", food: "soymilk", grams: 300 },
  corn: { name: "玉米", food: "corn", grams: 180 },
  mixed: { name: "杂粮饭", food: "mixed_rice", grams: 170 },
  noodle: { name: "挂面", food: "noodle_dry", grams: 80 },
  potato: { name: "土豆", food: "potato", grams: 160 },
  yamStaple: { name: "山药", food: "yam", grams: 180 },
  purple: { name: "紫薯", food: "purple_potato", grams: 180 },
  bread: { name: "全麦面包", food: "bread", grams: 70 },
};

interface Spec {
  id: string;
  name: string;
  slot: MealSlot;
  minutes: number;
  art: FoodArtKind;
  image?: string;
  protein: PKey;
  veg: VKey;
  staple: SKey;
  method: Method;
  extraEgg?: boolean;
  tip?: string;
}

function stepsFor(spec: Spec, proteinName: string, vegName: string): string[] {
  if (spec.method === "stir") {
    return [
      `${proteinName}切好，加一滴生抽抓匀。${vegName}洗净切好。`,
      "锅烧热放少许油，下主料大火滑散，变色就盛出。",
      `爆香蒜，下${vegName}大火翻炒至断生，倒回主料，加一小撮盐。`,
      spec.staple === "none" ? "趁热吃，不用再配饭。" : "配主食趁热吃，少油快炒即可。",
    ];
  }
  if (spec.method === "steam") {
    return [
      `${proteinName}处理好，表面划两刀，铺上姜片。`,
      `水开后上锅，中火蒸 ${Math.max(8, spec.minutes - 8)} 分钟，筷子扎进最厚处没有血水就熟了。`,
      `${vegName}开水焯 40 秒，沥干，淋两滴生抽。`,
      "一起装盘。蒸出来的浑汤倒掉，不用再浇油。",
    ];
  }
  if (spec.method === "soup") {
    return [
      `${proteinName}切块，${vegName}洗净。`,
      "锅里放清水烧开，下主料先煮几分钟，撇一点浮沫。",
      `下${vegName}再煮 3 到 5 分钟，加一小撮盐和葱花。`,
      spec.staple === "none" ? "晚饭喝汤就够，清淡好消化。" : "配一点主食，汤不要太咸。",
    ];
  }
  if (spec.method === "boil") {
    return [
      `${proteinName}冷水下锅或开水焯熟，捞出沥干。`,
      `${vegName}开水焯断生，过凉。`,
      "蒜末、生抽调一小碟汁，或者直接撒一撮盐。",
      "白灼少油，适合减脂日。",
    ];
  }
  if (spec.method === "cold") {
    return [
      `${proteinName}焯水或蒸熟，过凉切块。${vegName}洗净切好。`,
      "蒜末、香醋、生抽调成汁。",
      "拌匀装盘，放两分钟入味。",
      "夏天晚饭或配粥都很合适。",
    ];
  }
  return [
    `${proteinName}切小，${vegName}洗净切段。`,
    "米或剩饭加水大火烧开，转小火煮软。",
    "下主料煮熟，再下青菜，加一小撮盐。",
    "趁热喝，软、好消化。",
  ];
}

function build(spec: Spec): Recipe {
  const p = PROTEIN[spec.protein];
  const v = VEG[spec.veg];
  const s = STAPLE[spec.staple];
  const ingredients: Ingredient[] = [
    i(p.name, `${p.grams} 克`, p.food, p.grams, "protein"),
    i(v.name, `${v.grams} 克`, v.food, v.grams, "veg"),
  ];
  if (s) {
    const group: GroceryGroup = s.food === "milk" || s.food === "soymilk" || s.food === "yogurt" ? "staple" : "staple";
    ingredients.push(i(s.name, `${s.grams} 克`, s.food, s.grams, group));
  }
  if (spec.extraEgg) {
    ingredients.push(i("鸡蛋", "1 个", "egg", 50, "protein"));
  }
  ingredients.push(
    i("蒜", "6 克", "garlic", 6, "seasoning"),
    i("生抽", "6 克", "soy_sauce", 6, "seasoning"),
  );
  if (spec.method === "stir" || spec.method === "boil") {
    ingredients.push(i("食用油", "5 克", "oil", 5, "seasoning"));
  }
  if (spec.method === "cold") {
    ingredients.push(i("香醋", "6 克", "vinegar", 6, "seasoning"));
  }
  if (spec.method === "steam" || spec.method === "soup" || spec.method === "congee") {
    ingredients.push(i("姜", "6 克", "ginger", 6, "seasoning"));
  }

  return {
    id: spec.id,
    name: spec.name,
    slot: spec.slot,
    minutes: spec.minutes,
    art: spec.art,
    image: spec.image,
    ingredients,
    steps: stepsFor(spec, p.name, v.name),
    tip: spec.tip ?? "少油、少盐，火大一点、时间短一点。",
  };
}

const SPECS: Spec[] = [
  { id: "x-b-yam-egg-soy", name: "山药粥配水煮蛋", slot: "breakfast", minutes: 22, art: "congee", protein: "egg", veg: "yam", staple: "porridge", method: "congee" },
  { id: "x-b-pumpkin-soy-egg", name: "蒸南瓜配豆浆和蛋", slot: "breakfast", minutes: 18, art: "potato", protein: "egg", veg: "pumpkin", staple: "soy", method: "steam" },
  { id: "x-b-purple-milk-egg", name: "蒸紫薯配牛奶水煮蛋", slot: "breakfast", minutes: 20, art: "potato", protein: "egg", veg: "cuke", staple: "purple", method: "steam" },
  { id: "x-b-oat-apple-egg", name: "燕麦牛奶配苹果和蛋", slot: "breakfast", minutes: 10, art: "oats", protein: "egg", veg: "cuke", staple: "oats", method: "boil", extraEgg: true },
  { id: "x-b-egg-pancake-cuke", name: "葱花鸡蛋饼配黄瓜", slot: "breakfast", minutes: 12, art: "egg", protein: "egg", veg: "cuke", staple: "none", method: "stir" },
  { id: "x-b-carrot-egg-cake", name: "胡萝卜鸡蛋饼", slot: "breakfast", minutes: 12, art: "egg", protein: "egg", veg: "carrot", staple: "none", method: "stir" },
  { id: "x-b-spinach-congee-egg", name: "菠菜瘦肉粥配蛋", slot: "breakfast", minutes: 20, art: "congee", protein: "pork", veg: "spinach", staple: "porridge", method: "congee" },
  { id: "x-b-chicken-congee", name: "鸡丝青菜粥", slot: "breakfast", minutes: 20, art: "congee", protein: "chicken", veg: "greens", staple: "porridge", method: "congee" },
  { id: "x-b-shrimp-congee", name: "虾仁青菜粥", slot: "breakfast", minutes: 18, art: "congee", protein: "shrimp", veg: "greens", staple: "porridge", method: "congee" },
  { id: "x-b-tofu-spinach-congee", name: "菠菜豆腐粥", slot: "breakfast", minutes: 16, art: "congee", protein: "tofu", veg: "spinach", staple: "porridge", method: "congee" },
  { id: "x-b-tomato-noodle-egg", name: "番茄鸡蛋面", slot: "breakfast", minutes: 14, art: "noodle", protein: "egg", veg: "tomato", staple: "noodle", method: "soup" },
  { id: "x-b-greens-noodle-egg", name: "青菜鸡蛋面", slot: "breakfast", minutes: 14, art: "noodle", protein: "egg", veg: "greens", staple: "noodle", method: "soup" },
  { id: "x-b-mantou-tomato-egg", name: "全麦馒头配番茄炒蛋", slot: "breakfast", minutes: 12, art: "egg", protein: "egg", veg: "tomato", staple: "mantou", method: "stir" },
  { id: "x-b-soy-edamame-egg", name: "豆浆配毛豆和茶叶蛋", slot: "breakfast", minutes: 12, art: "soy", protein: "edamame", veg: "cuke", staple: "soy", method: "boil", extraEgg: true },
  { id: "x-b-corn-tofu-egg", name: "玉米豆腐配水煮蛋", slot: "breakfast", minutes: 16, art: "corn", protein: "tofu", veg: "cuke", staple: "corn", method: "boil", extraEgg: true },
  { id: "x-b-bread-cuke-egg", name: "全麦面包夹黄瓜鸡蛋", slot: "breakfast", minutes: 8, art: "toast", protein: "egg", veg: "cuke", staple: "bread", method: "stir" },
  { id: "x-b-kelp-egg-congee", name: "海带豆腐粥配蛋", slot: "breakfast", minutes: 18, art: "soup", protein: "tofu", veg: "kelp", staple: "porridge", method: "congee", extraEgg: true },
  { id: "x-b-mushroom-egg-congee", name: "香菇鸡蛋粥", slot: "breakfast", minutes: 18, art: "congee", protein: "egg", veg: "mushroom", staple: "porridge", method: "congee" },
  { id: "x-b-loofah-egg-soup", name: "丝瓜蛋花汤配馒头", slot: "breakfast", minutes: 14, art: "soup", protein: "egg", veg: "loofah", staple: "mantou", method: "soup" },
  { id: "x-b-winter-egg-congee", name: "冬瓜粥配茶叶蛋", slot: "breakfast", minutes: 20, art: "congee", protein: "egg", veg: "winter", staple: "porridge", method: "congee" },
  { id: "x-b-pea-egg-congee", name: "豌豆鸡蛋粥", slot: "breakfast", minutes: 18, art: "congee", protein: "egg", veg: "pea", staple: "porridge", method: "congee" },
  { id: "x-b-gan-cuke-soy", name: "香干拌黄瓜配豆浆", slot: "breakfast", minutes: 8, art: "tofu", protein: "gan", veg: "cuke", staple: "soy", method: "cold" },
  { id: "x-b-yogurt-oat-cuke", name: "无糖酸奶燕麦配黄瓜", slot: "breakfast", minutes: 6, art: "yogurt", protein: "egg", veg: "cuke", staple: "oats", method: "cold" },
  { id: "x-b-milk-oat-tomato", name: "牛奶燕麦配小番茄", slot: "breakfast", minutes: 8, art: "oats", protein: "egg", veg: "tomato", staple: "oats", method: "boil" },
  { id: "x-b-choysum-mantou-egg", name: "焯菜心配馒头和蛋", slot: "breakfast", minutes: 12, art: "veg", protein: "egg", veg: "choysum", staple: "mantou", method: "boil" },
  { id: "x-b-enoki-egg-soup", name: "金针菇蛋花汤配玉米", slot: "breakfast", minutes: 14, art: "soup", protein: "egg", veg: "enoki", staple: "corn", method: "soup" },
  { id: "x-b-bitter-egg-congee", name: "苦瓜蛋花配小米粥", slot: "breakfast", minutes: 16, art: "congee", protein: "egg", veg: "bitter", staple: "porridge", method: "soup" },
  { id: "x-b-okra-egg-soy", name: "白灼秋葵配豆浆蛋", slot: "breakfast", minutes: 12, art: "veg", protein: "egg", veg: "okra", staple: "soy", method: "boil" },
  { id: "x-b-wood-egg-congee", name: "木耳鸡蛋粥", slot: "breakfast", minutes: 16, art: "congee", protein: "egg", veg: "wood", staple: "porridge", method: "congee" },
  { id: "x-b-lettuce-egg-soy", name: "蒜蓉生菜配豆浆茶叶蛋", slot: "breakfast", minutes: 10, art: "veg", protein: "egg", veg: "lettuce", staple: "soy", method: "stir" },

  { id: "x-l-chicken-yam-rice", name: "鸡胸炒山药配饭", slot: "lunch", minutes: 16, art: "chicken", protein: "chicken", veg: "yam", staple: "rice", method: "stir" },
  { id: "x-l-chicken-okra-rice", name: "鸡胸炒秋葵配饭", slot: "lunch", minutes: 14, art: "chicken", protein: "chicken", veg: "okra", staple: "rice", method: "stir" },
  { id: "x-l-chicken-bean-rice", name: "鸡胸炒四季豆配饭", slot: "lunch", minutes: 16, art: "chicken", protein: "chicken", veg: "bean", staple: "rice", method: "stir" },
  { id: "x-l-chicken-bitter-rice", name: "苦瓜炒鸡胸配饭", slot: "lunch", minutes: 15, art: "chicken", protein: "chicken", veg: "bitter", staple: "rice", method: "stir" },
  { id: "x-l-chicken-pea-rice", name: "豌豆炒鸡丁配饭", slot: "lunch", minutes: 14, art: "chicken", protein: "chicken", veg: "pea", staple: "rice", method: "stir" },
  { id: "x-l-thigh-mushroom-rice", name: "香菇烧鸡腿配饭", slot: "lunch", minutes: 22, art: "chicken", protein: "thigh", veg: "mushroom", staple: "rice", method: "stir" },
  { id: "x-l-thigh-potato-rice", name: "土豆烧鸡腿配青菜", slot: "lunch", minutes: 24, art: "chicken", protein: "thigh", veg: "greens", staple: "potato", method: "soup" },
  { id: "x-l-thigh-cabbage-rice", name: "白菜炖鸡腿配饭", slot: "lunch", minutes: 22, art: "chicken", protein: "thigh", veg: "cabbage", staple: "rice", method: "soup" },
  { id: "x-l-thigh-lotus-rice", name: "藕片炒鸡腿配饭", slot: "lunch", minutes: 16, art: "chicken", protein: "thigh", veg: "lotus", staple: "rice", method: "stir" },
  { id: "x-l-shrimp-broccoli-rice", name: "虾仁西兰花配饭", slot: "lunch", minutes: 14, art: "shrimp", protein: "shrimp", veg: "broccoli", staple: "rice", method: "stir" },
  { id: "x-l-shrimp-celery-rice", name: "芹菜炒虾仁配饭", slot: "lunch", minutes: 12, art: "shrimp", protein: "shrimp", veg: "celery", staple: "rice", method: "stir" },
  { id: "x-l-shrimp-loofah-rice", name: "丝瓜虾仁配饭", slot: "lunch", minutes: 14, art: "shrimp", protein: "shrimp", veg: "loofah", staple: "rice", method: "stir" },
  { id: "x-l-shrimp-pea-rice", name: "豌豆炒虾仁配饭", slot: "lunch", minutes: 12, art: "shrimp", protein: "shrimp", veg: "pea", staple: "rice", method: "stir" },
  { id: "x-l-shrimp-enoki-noodle", name: "金针菇虾仁面", slot: "lunch", minutes: 16, art: "noodle", protein: "shrimp", veg: "enoki", staple: "noodle", method: "soup" },
  { id: "x-l-fish-greens-rice", name: "清蒸鲈鱼配菜心饭", slot: "lunch", minutes: 20, art: "shrimp", image: "bass.jpg", protein: "fish", veg: "choysum", staple: "rice", method: "steam" },
  { id: "x-l-fish-bitter-rice", name: "清蒸鲈鱼配苦瓜", slot: "lunch", minutes: 20, art: "shrimp", image: "bass.jpg", protein: "fish", veg: "bitter", staple: "rice", method: "steam" },
  { id: "x-l-fish-tofu-soup", name: "鲈鱼豆腐汤配饭", slot: "lunch", minutes: 22, art: "soup", protein: "fish", veg: "tomato", staple: "rice", method: "soup" },
  { id: "x-l-beef-onion-rice", name: "洋葱炒牛肉配饭", slot: "lunch", minutes: 14, art: "beef", protein: "beef", veg: "onion", staple: "rice", method: "stir" },
  { id: "x-l-beef-broccoli-rice", name: "西兰花炒牛肉配饭", slot: "lunch", minutes: 14, art: "beef", protein: "beef", veg: "broccoli", staple: "rice", method: "stir" },
  { id: "x-l-beef-celery-rice", name: "芹菜炒牛肉配饭", slot: "lunch", minutes: 14, art: "beef", protein: "beef", veg: "celery", staple: "rice", method: "stir" },
  { id: "x-l-beef-lotus-rice", name: "藕片炒牛肉配饭", slot: "lunch", minutes: 15, art: "beef", protein: "beef", veg: "lotus", staple: "rice", method: "stir" },
  { id: "x-l-beef-bean-rice", name: "四季豆炒牛肉配饭", slot: "lunch", minutes: 16, art: "beef", protein: "beef", veg: "bean", staple: "rice", method: "stir" },
  { id: "x-l-pork-cabbage-rice", name: "白菜炒肉片配饭", slot: "lunch", minutes: 14, art: "pork", protein: "pork", veg: "cabbage", staple: "rice", method: "stir" },
  { id: "x-l-pork-wood-rice", name: "木耳肉片配饭", slot: "lunch", minutes: 14, art: "pork", protein: "pork", veg: "wood", staple: "rice", method: "stir" },
  { id: "x-l-pork-yam-rice", name: "山药炒肉片配饭", slot: "lunch", minutes: 15, art: "pork", protein: "pork", veg: "yam", staple: "rice", method: "stir" },
  { id: "x-l-pork-bean-rice", name: "四季豆炒肉配饭", slot: "lunch", minutes: 16, art: "pork", protein: "pork", veg: "bean", staple: "rice", method: "stir" },
  { id: "x-l-pork-chive-rice", name: "韭菜炒肉丝配饭", slot: "lunch", minutes: 12, art: "pork", protein: "pork", veg: "chive", staple: "rice", method: "stir" },
  { id: "x-l-egg-bitter-rice", name: "苦瓜炒蛋配饭", slot: "lunch", minutes: 12, art: "egg", protein: "egg", veg: "bitter", staple: "rice", method: "stir" },
  { id: "x-l-egg-chive-rice", name: "韭菜炒蛋配米饭", slot: "lunch", minutes: 10, art: "egg", protein: "egg", veg: "chive", staple: "rice", method: "stir" },
  { id: "x-l-egg-tomato-mixed", name: "番茄炒蛋配杂粮饭", slot: "lunch", minutes: 12, art: "egg", protein: "egg", veg: "tomato", staple: "mixed", method: "stir" },
  { id: "x-l-egg-pepper-rice", name: "青椒炒蛋配饭", slot: "lunch", minutes: 10, art: "egg", protein: "egg", veg: "pepper", staple: "rice", method: "stir" },
  { id: "x-l-tofu-mushroom-rice", name: "香菇烧豆腐配饭", slot: "lunch", minutes: 16, art: "tofu", protein: "tofu", veg: "mushroom", staple: "rice", method: "stir" },
  { id: "x-l-tofu-cabbage-rice", name: "白菜炖豆腐配饭", slot: "lunch", minutes: 16, art: "tofu", protein: "tofu", veg: "cabbage", staple: "rice", method: "soup" },
  { id: "x-l-tofu-bitter-rice", name: "苦瓜烧豆腐配饭", slot: "lunch", minutes: 14, art: "tofu", protein: "tofu", veg: "bitter", staple: "rice", method: "stir" },
  { id: "x-l-gan-pepper-rice", name: "青椒香干配饭", slot: "lunch", minutes: 12, art: "tofu", protein: "gan", veg: "pepper", staple: "rice", method: "stir" },
  { id: "x-l-gan-celery-mixed", name: "芹菜香干配杂粮饭", slot: "lunch", minutes: 12, art: "tofu", protein: "gan", veg: "celery", staple: "mixed", method: "stir" },
  { id: "x-l-gan-sprout-rice", name: "豆芽炒香干配饭", slot: "lunch", minutes: 12, art: "tofu", protein: "gan", veg: "sprout", staple: "rice", method: "stir" },
  { id: "x-l-edamame-carrot-rice", name: "胡萝卜炒毛豆配饭", slot: "lunch", minutes: 14, art: "veg", protein: "edamame", veg: "carrot", staple: "rice", method: "stir", extraEgg: true },
  { id: "x-l-rib-winter-rice", name: "冬瓜排骨汤配小碗饭", slot: "lunch", minutes: 32, art: "soup", image: "ribs.jpg", protein: "rib", veg: "winter", staple: "rice", method: "soup" },
  { id: "x-l-rib-lotus-rice", name: "藕段排骨汤配饭", slot: "lunch", minutes: 32, art: "soup", protein: "rib", veg: "lotus", staple: "rice", method: "soup" },
  { id: "x-l-rib-corn-greens", name: "玉米排骨汤配青菜", slot: "lunch", minutes: 30, art: "soup", protein: "rib", veg: "greens", staple: "corn", method: "soup" },
  { id: "x-l-chicken-enoki-noodle", name: "金针菇鸡丝面", slot: "lunch", minutes: 16, art: "noodle", protein: "chicken", veg: "enoki", staple: "noodle", method: "soup" },
  { id: "x-l-beef-tomato-noodle", name: "番茄瘦牛面", slot: "lunch", minutes: 16, art: "noodle", protein: "beef", veg: "tomato", staple: "noodle", method: "soup" },
  { id: "x-l-pork-spinach-noodle", name: "菠菜肉丝面", slot: "lunch", minutes: 15, art: "noodle", protein: "pork", veg: "spinach", staple: "noodle", method: "soup" },
  { id: "x-l-tofu-tomato-noodle", name: "番茄豆腐面", slot: "lunch", minutes: 14, art: "noodle", protein: "tofu", veg: "tomato", staple: "noodle", method: "soup" },
  { id: "x-l-shrimp-zucchini-mixed", name: "虾仁西葫芦配杂粮饭", slot: "lunch", minutes: 14, art: "shrimp", protein: "shrimp", veg: "zucchini", staple: "mixed", method: "stir" },
  { id: "x-l-chicken-water-rice", name: "空心菜炒鸡胸配饭", slot: "lunch", minutes: 14, art: "chicken", protein: "chicken", veg: "water", staple: "rice", method: "stir" },

  { id: "x-d-shrimp-okra", name: "白灼虾仁配秋葵", slot: "dinner", minutes: 12, art: "shrimp", protein: "shrimp", veg: "okra", staple: "none", method: "boil" },
  { id: "x-d-shrimp-loofah-soup", name: "丝瓜虾仁汤", slot: "dinner", minutes: 14, art: "soup", protein: "shrimp", veg: "loofah", staple: "none", method: "soup" },
  { id: "x-d-shrimp-winter-soup", name: "冬瓜虾仁汤", slot: "dinner", minutes: 16, art: "soup", protein: "shrimp", veg: "winter", staple: "none", method: "soup" },
  { id: "x-d-shrimp-kelp", name: "海带虾皮汤配拍黄瓜", slot: "dinner", minutes: 14, art: "soup", protein: "shrimp", veg: "kelp", staple: "none", method: "soup" },
  { id: "x-d-fish-winter-soup", name: "鲈鱼冬瓜汤", slot: "dinner", minutes: 20, art: "soup", protein: "fish", veg: "winter", staple: "none", method: "soup" },
  { id: "x-d-fish-tofu-dinner", name: "清蒸鲈鱼配豆腐", slot: "dinner", minutes: 20, art: "shrimp", image: "bass.jpg", protein: "fish", veg: "greens", staple: "none", method: "steam" },
  { id: "x-d-fish-cuke", name: "清蒸鲈鱼配拍黄瓜", slot: "dinner", minutes: 18, art: "shrimp", image: "bass.jpg", protein: "fish", veg: "cuke", staple: "none", method: "steam" },
  { id: "x-d-beef-cuke", name: "牛肉炒青椒配拍黄瓜", slot: "dinner", minutes: 14, art: "beef", protein: "beef", veg: "pepper", staple: "none", method: "stir" },
  { id: "x-d-beef-tomato-soup", name: "番茄瘦牛汤", slot: "dinner", minutes: 16, art: "soup", protein: "beef", veg: "tomato", staple: "porridge", method: "soup" },
  { id: "x-d-pork-bitter", name: "苦瓜炒瘦肉", slot: "dinner", minutes: 14, art: "pork", protein: "pork", veg: "bitter", staple: "none", method: "stir" },
  { id: "x-d-pork-wood-cold", name: "凉拌木耳肉丝", slot: "dinner", minutes: 12, art: "pork", protein: "pork", veg: "wood", staple: "none", method: "cold" },
  { id: "x-d-pork-kelp-soup", name: "海带肉丝汤", slot: "dinner", minutes: 14, art: "soup", protein: "pork", veg: "kelp", staple: "none", method: "soup" },
  { id: "x-d-egg-bitter-dinner", name: "苦瓜炒蛋配拍黄瓜", slot: "dinner", minutes: 12, art: "egg", protein: "egg", veg: "bitter", staple: "none", method: "stir" },
  { id: "x-d-egg-chive-dinner", name: "韭菜炒蛋配番茄", slot: "dinner", minutes: 10, art: "egg", protein: "egg", veg: "chive", staple: "none", method: "stir" },
  { id: "x-d-egg-loofah-soup", name: "丝瓜蛋汤", slot: "dinner", minutes: 12, art: "soup", protein: "egg", veg: "loofah", staple: "none", method: "soup" },
  { id: "x-d-egg-enoki-soup", name: "金针菇蛋花汤", slot: "dinner", minutes: 10, art: "soup", protein: "egg", veg: "enoki", staple: "none", method: "soup" },
  { id: "x-d-egg-tomato-steam", name: "番茄蒸蛋配生菜", slot: "dinner", minutes: 14, art: "egg", protein: "egg", veg: "lettuce", staple: "none", method: "steam" },
  { id: "x-d-tofu-winter-soup", name: "冬瓜豆腐汤", slot: "dinner", minutes: 14, art: "soup", protein: "tofu", veg: "winter", staple: "none", method: "soup" },
  { id: "x-d-tofu-kelp-soup", name: "海带豆腐汤", slot: "dinner", minutes: 14, art: "soup", protein: "tofu", veg: "kelp", staple: "porridge", method: "soup" },
  { id: "x-d-tofu-spinach-dinner", name: "菠菜豆腐羹", slot: "dinner", minutes: 12, art: "tofu", protein: "tofu", veg: "spinach", staple: "none", method: "soup" },
  { id: "x-d-tofu-okra", name: "白灼秋葵配豆腐", slot: "dinner", minutes: 10, art: "tofu", protein: "tofu", veg: "okra", staple: "none", method: "boil" },
  { id: "x-d-tofu-bitter-cold", name: "苦瓜拌豆腐", slot: "dinner", minutes: 10, art: "tofu", protein: "tofu", veg: "bitter", staple: "none", method: "cold" },
  { id: "x-d-gan-cuke-cold", name: "香干拌黄瓜", slot: "dinner", minutes: 8, art: "tofu", protein: "gan", veg: "cuke", staple: "none", method: "cold" },
  { id: "x-d-gan-celery-dinner", name: "芹菜香干小炒", slot: "dinner", minutes: 12, art: "tofu", protein: "gan", veg: "celery", staple: "none", method: "stir" },
  { id: "x-d-gan-sprout-dinner", name: "豆芽拌香干", slot: "dinner", minutes: 10, art: "tofu", protein: "gan", veg: "sprout", staple: "none", method: "cold" },
  { id: "x-d-edamame-cuke", name: "毛豆拌黄瓜", slot: "dinner", minutes: 12, art: "veg", protein: "edamame", veg: "cuke", staple: "none", method: "cold" },
  { id: "x-d-edamame-tomato", name: "水煮毛豆配小番茄", slot: "dinner", minutes: 12, art: "veg", protein: "edamame", veg: "tomato", staple: "none", method: "boil" },
  { id: "x-d-chicken-lettuce", name: "白灼鸡胸配生菜", slot: "dinner", minutes: 12, art: "chicken", protein: "chicken", veg: "lettuce", staple: "none", method: "boil" },
  { id: "x-d-chicken-cuke-cold", name: "手撕鸡胸拌黄瓜", slot: "dinner", minutes: 14, art: "chicken", protein: "chicken", veg: "cuke", staple: "none", method: "cold" },
  { id: "x-d-chicken-winter-soup", name: "冬瓜鸡汤", slot: "dinner", minutes: 20, art: "soup", protein: "chicken", veg: "winter", staple: "porridge", method: "soup" },
  { id: "x-d-thigh-greens-steam", name: "清蒸鸡腿配焯青菜", slot: "dinner", minutes: 20, art: "chicken", protein: "thigh", veg: "greens", staple: "none", method: "steam" },
  { id: "x-d-thigh-mushroom-soup", name: "香菇鸡腿汤", slot: "dinner", minutes: 22, art: "soup", protein: "thigh", veg: "mushroom", staple: "porridge", method: "soup" },
  { id: "x-d-rib-winter-dinner", name: "冬瓜排骨汤配青菜", slot: "dinner", minutes: 32, art: "soup", image: "ribs.jpg", protein: "rib", veg: "winter", staple: "none", method: "soup" },
  { id: "x-d-rib-yam-soup", name: "山药排骨汤", slot: "dinner", minutes: 32, art: "soup", protein: "rib", veg: "yam", staple: "none", method: "soup" },
  { id: "x-d-egg-cuke-stir", name: "黄瓜炒蛋配紫菜汤", slot: "dinner", minutes: 12, art: "egg", protein: "egg", veg: "cuke", staple: "none", method: "stir" },
  { id: "x-d-tofu-eggplant", name: "茄子烧豆腐", slot: "dinner", minutes: 16, art: "tofu", protein: "tofu", veg: "eggplant", staple: "none", method: "stir" },
  { id: "x-d-shrimp-cuke-cold", name: "凉拌虾仁黄瓜", slot: "dinner", minutes: 10, art: "shrimp", protein: "shrimp", veg: "cuke", staple: "none", method: "cold" },
  { id: "x-d-beef-sprout", name: "豆芽炒牛肉丝", slot: "dinner", minutes: 12, art: "beef", protein: "beef", veg: "sprout", staple: "none", method: "stir" },
  { id: "x-d-pork-lettuce", name: "蒜蓉生菜配蒸肉片", slot: "dinner", minutes: 14, art: "pork", protein: "pork", veg: "lettuce", staple: "none", method: "steam" },
  { id: "x-d-gan-tomato-soup", name: "番茄香干汤", slot: "dinner", minutes: 12, art: "soup", protein: "gan", veg: "tomato", staple: "none", method: "soup" },
  { id: "x-d-edamame-spinach", name: "清炒菠菜配毛豆", slot: "dinner", minutes: 10, art: "veg", protein: "edamame", veg: "spinach", staple: "none", method: "stir" },
  { id: "x-d-fish-enoki-soup", name: "金针菇鲈鱼汤", slot: "dinner", minutes: 18, art: "soup", protein: "fish", veg: "enoki", staple: "none", method: "soup" },
  { id: "x-d-egg-wood-cold", name: "木耳拌鸡蛋", slot: "dinner", minutes: 10, art: "egg", protein: "egg", veg: "wood", staple: "none", method: "cold" },
  { id: "x-d-tofu-choysum", name: "白灼菜心配内酯豆腐", slot: "dinner", minutes: 10, art: "tofu", protein: "tofu", veg: "choysum", staple: "none", method: "boil" },

];

const HAND: Recipe[] = [
  {
    id: "x-s-kiwi-real",
    name: "一只猕猴桃",
    slot: "snack",
    minutes: 1,
    art: "fruit",
    ingredients: [i("猕猴桃", "1 个", "kiwi", 100, "veg")],
    steps: ["猕猴桃洗净，剖开用勺挖着吃。", "饭后半小时再吃，当加餐刚刚好。"],
    tip: "酸一点的更有饱腹感，不必加糖。",
  },
  {
    id: "x-s-cherry-real",
    name: "一把圣女果",
    slot: "snack",
    minutes: 1,
    art: "fruit",
    ingredients: [i("圣女果", "150 克", "cherry_tomato", 150, "veg")],
    steps: ["圣女果洗净，当水果吃。", "下午嘴馋时先吃它。"],
    tip: "比零食扛饿，也有水分。",
  },
  {
    id: "x-s-warm-milk-real",
    name: "一杯温牛奶",
    slot: "snack",
    minutes: 2,
    art: "soy",
    ingredients: [i("低脂牛奶", "250 毫升", "milk", 250, "staple")],
    steps: ["牛奶温热倒杯，不要加糖。", "晚上加餐或下午口渴时喝。"],
    tip: "选低脂即可，蛋白质差不多。",
  },
  {
    id: "x-s-corn-half-real",
    name: "半根熟玉米",
    slot: "snack",
    minutes: 15,
    art: "corn",
    ingredients: [i("玉米", "半根", "corn", 120, "staple")],
    steps: ["玉米冷水下锅，水开后再煮 12 分钟。", "只吃半根，当加餐。"],
    tip: "玉米当加餐就不要再配面包。",
  },
  {
    id: "x-s-purple-real",
    name: "一小块蒸紫薯",
    slot: "snack",
    minutes: 18,
    art: "potato",
    ingredients: [i("紫薯", "120 克", "purple_potato", 120, "staple")],
    steps: ["紫薯刷洗切块，水开后蒸 15 分钟。", "放凉一点再吃。"],
    tip: "一小块就够，不要当正餐主食再叠一次。",
  },
  {
    id: "x-s-yogurt-kiwi-real",
    name: "无糖酸奶配猕猴桃",
    slot: "snack",
    minutes: 2,
    art: "yogurt",
    ingredients: [
      i("无糖原味酸奶", "180 克", "yogurt", 180, "staple"),
      i("猕猴桃", "1 个", "kiwi", 80, "veg"),
    ],
    steps: ["猕猴桃切片铺在酸奶上。", "不放蜂蜜。"],
    tip: "比单吃水果多一点蛋白质。",
  },
  {
    id: "x-s-edamame-real",
    name: "一小碗水煮毛豆",
    slot: "snack",
    minutes: 12,
    art: "veg",
    ingredients: [i("毛豆", "70 克", "edamame", 70, "protein")],
    steps: ["毛豆冷水下锅加盐，水开后再煮 8 分钟。", "先盛一小碗再吃。"],
    tip: "毛豆有脂肪，一小碗即可。",
  },
  {
    id: "x-s-gan-cuke-real",
    name: "几片香干配黄瓜",
    slot: "snack",
    minutes: 5,
    art: "tofu",
    ingredients: [
      i("香干", "40 克", "tofu_gan", 40, "protein"),
      i("黄瓜", "80 克", "cucumber", 80, "veg"),
    ],
    steps: ["香干切片，黄瓜拍段。", "可滴几滴生抽。"],
    tip: "咸香干少吃几片，够味就行。",
  },
  {
    id: "x-s-tofu-cherry-real",
    name: "凉拌豆腐配小番茄",
    slot: "snack",
    minutes: 6,
    art: "tofu",
    ingredients: [
      i("北豆腐", "120 克", "tofu", 120, "protein"),
      i("圣女果", "80 克", "cherry_tomato", 80, "veg"),
    ],
    steps: ["豆腐焯一下切块，圣女果对半。", "蒜末生抽拌匀。"],
    tip: "加餐里豆腐能顶住饿。",
  },
  {
    id: "x-s-teaegg-real",
    name: "一枚茶叶蛋",
    slot: "snack",
    minutes: 10,
    art: "egg",
    ingredients: [i("茶叶蛋", "1 个", "egg", 50, "protein")],
    steps: ["现成茶叶蛋剖开，或用水煮蛋代替。", "只吃一枚，不要就着盐粒猛吃。"],
    tip: "加餐一枚蛋刚刚好。",
  },
  {
    id: "x-s-oat-milk-real",
    name: "一小碗燕麦牛奶",
    slot: "snack",
    minutes: 6,
    art: "oats",
    ingredients: [
      i("燕麦片", "25 克", "oats", 25, "staple"),
      i("低脂牛奶", "180 毫升", "milk", 180, "staple"),
    ],
    steps: ["牛奶加热，下燕麦煮 3 分钟。", "不要加糖。"],
    tip: "比饼干扛饿。",
  },
  {
    id: "x-s-yam-real",
    name: "几块蒸山药",
    slot: "snack",
    minutes: 16,
    art: "potato",
    ingredients: [i("山药", "120 克", "yam", 120, "veg")],
    steps: ["山药去皮切段，水开蒸 12 分钟。", "放凉再吃，口感面而香。"],
    tip: "山药当加餐，正餐就少盛饭。",
  },
  {
    id: "x-s-lettuce-gan-real",
    name: "生菜包香干",
    slot: "snack",
    minutes: 5,
    art: "veg",
    ingredients: [
      i("生菜", "80 克", "lettuce", 80, "veg"),
      i("香干", "40 克", "tofu_gan", 40, "protein"),
    ],
    steps: ["生菜洗好，香干切条，包着吃。", "可蘸一点点生抽。"],
    tip: "用手吃，比开零食袋强。",
  },
  {
    id: "x-s-shrimp-few-real",
    name: "几只白灼虾",
    slot: "snack",
    minutes: 8,
    art: "shrimp",
    ingredients: [i("虾仁", "60 克", "shrimp", 60, "protein")],
    steps: ["虾仁开水煮到变红弯起，大约 2 分钟。", "蘸一丁点生抽。"],
    tip: "蛋白质干净，适合加餐。",
  },
  {
    id: "x-s-pea-real",
    name: "一碟水煮豌豆",
    slot: "snack",
    minutes: 10,
    art: "veg",
    ingredients: [i("豌豆", "80 克", "pea", 80, "veg")],
    steps: ["豌豆冷水下锅，水开后再煮 6 分钟。", "撒一丁点盐。"],
    tip: "先盛出来再吃。",
  },
];

export const MORE_RECIPES: Recipe[] = [...SPECS.filter((spec) => spec.slot !== "snack").map(build), ...HAND];
