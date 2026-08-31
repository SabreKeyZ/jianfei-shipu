export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export type GroceryGroup = "veg" | "protein" | "staple" | "seasoning";

export type FoodArtKind =
  | "oats"
  | "toast"
  | "yogurt"
  | "congee"
  | "soy"
  | "corn"
  | "potato"
  | "chicken"
  | "beef"
  | "pork"
  | "shrimp"
  | "noodle"
  | "soup"
  | "tofu"
  | "egg"
  | "veg"
  | "salad"
  | "fruit"
  | "nut";

export interface Ingredient {
  name: string;
  amount: string;
  food: string;
  grams: number;
  group: GroceryGroup;
}

export interface Recipe {
  id: string;
  name: string;
  slot: MealSlot;
  minutes: number;
  art: FoodArtKind;
  /** Optional file under public/dishes/; otherwise matched from name + ingredients. */
  image?: string;
  ingredients: Ingredient[];
  steps: string[];
  tip: string;
}

export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayMeals {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export type SlotSwaps = Partial<Record<MealSlot, string>>;

export type TabId = "today" | "week" | "library" | "grocery";
