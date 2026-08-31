import type { MealSlot, SlotSwaps } from "../types";
import { DEMO_PROFILE, isProfileComplete, type Profile } from "./profile";

const SWAP_KEY = "jianfei:swaps";
const CHECK_KEY = "jianfei:grocery-checked";
const WEEK_DAY_KEY = "jianfei:week-selected";
const GROCERY_SCOPE_KEY = "jianfei:grocery-scope";
const PROFILE_KEY = "jianfei:profile";
const EATEN_KEY = "jianfei:eaten";
const WEIGHT_KEY = "jianfei:weight-jin";
const SKIP_KEY = "jianfei:profile-skipped";

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
  return localStorage.getItem(GROCERY_SCOPE_KEY) === "week" ? "week" : "today";
}

export function saveGroceryScope(scope: "today" | "week"): void {
  localStorage.setItem(GROCERY_SCOPE_KEY, scope);
}

export function loadProfile(): Profile | null {
  const data = readJson<Partial<Profile> | null>(PROFILE_KEY, null);
  return isProfileComplete(data) ? { ...data, source: data.source ?? "user" } : null;
}

export function saveProfile(profile: Profile): void {
  writeJson(PROFILE_KEY, profile);
}

export function loadOrDemoProfile(): Profile {
  return loadProfile() ?? (hasSkippedProfile() ? DEMO_PROFILE : DEMO_PROFILE);
}

export function hasSkippedProfile(): boolean {
  return localStorage.getItem(SKIP_KEY) === "1";
}

export function markProfileSkipped(): void {
  localStorage.setItem(SKIP_KEY, "1");
  if (!loadProfile()) saveProfile({ ...DEMO_PROFILE, source: "demo" });
}

export function needsOnboarding(): boolean {
  return !loadProfile() && !hasSkippedProfile();
}

export type EatenMap = Record<string, Partial<Record<MealSlot, boolean>>>;

export function loadEaten(): EatenMap {
  return readJson<EatenMap>(EATEN_KEY, {});
}

export function saveEaten(map: EatenMap): void {
  writeJson(EATEN_KEY, map);
}

export function loadWeights(): Record<string, number> {
  return readJson<Record<string, number>>(WEIGHT_KEY, {});
}

export function saveWeights(map: Record<string, number>): void {
  writeJson(WEIGHT_KEY, map);
}
