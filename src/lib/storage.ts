import type { MealSlot, SlotSwaps } from "../types";

const SWAP_KEY = "jianfei:swaps";
const CHECK_KEY = "jianfei:grocery-checked";
const WEEK_DAY_KEY = "jianfei:week-selected";
const GROCERY_SCOPE_KEY = "jianfei:grocery-scope";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSwaps(): Record<string, SlotSwaps> {
  return readJson<Record<string, SlotSwaps>>(SWAP_KEY, {});
}

export function saveDaySwap(dateKey: string, slot: MealSlot, recipeId: string): void {
  const all = loadSwaps();
  all[dateKey] = { ...all[dateKey], [slot]: recipeId };
  writeJson(SWAP_KEY, all);
}

export function loadChecked(): Record<string, boolean> {
  return readJson<Record<string, boolean>>(CHECK_KEY, {});
}

export function saveChecked(map: Record<string, boolean>): void {
  writeJson(CHECK_KEY, map);
}

export function loadWeekSelectedKey(): string | null {
  return localStorage.getItem(WEEK_DAY_KEY);
}

export function saveWeekSelectedKey(dateKey: string): void {
  localStorage.setItem(WEEK_DAY_KEY, dateKey);
}

export function loadGroceryScope(): "today" | "week" {
  const value = localStorage.getItem(GROCERY_SCOPE_KEY);
  return value === "week" ? "week" : "today";
}

export function saveGroceryScope(scope: "today" | "week"): void {
  localStorage.setItem(GROCERY_SCOPE_KEY, scope);
}
