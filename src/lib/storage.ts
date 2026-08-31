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
const FAVORITE_KEY = "jianfei:favorites";
const WATER_KEY = "jianfei:water";
const PWA_HINT_KEY = "jianfei:pwa-hint-dismissed";
const REROLL_KEY = "jianfei:reroll";

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

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function saveSwaps(map: Record<string, SlotSwaps>): void {
  writeJson(SWAP_KEY, map);
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

export function loadFavorites(): string[] {
  const raw = readJson<string[]>(FAVORITE_KEY, []);
  return Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : [];
}

export function saveFavorites(ids: string[]): void {
  writeJson(FAVORITE_KEY, ids);
}

export function loadWater(): Record<string, number> {
  return readJson<Record<string, number>>(WATER_KEY, {});
}

export function saveWater(map: Record<string, number>): void {
  writeJson(WATER_KEY, map);
}

export function loadPwaHintDismissed(): boolean {
  return localStorage.getItem(PWA_HINT_KEY) === "1";
}

export function savePwaHintDismissed(): void {
  localStorage.setItem(PWA_HINT_KEY, "1");
}

export function loadRerolls(): Record<string, number> {
  return readJson<Record<string, number>>(REROLL_KEY, {});
}

export function saveRerolls(map: Record<string, number>): void {
  writeJson(REROLL_KEY, map);
}

export function bumpReroll(dateKey: string): number {
  const all = loadRerolls();
  const next = (all[dateKey] ?? 0) + 1;
  saveRerolls({ ...all, [dateKey]: next });
  const swaps = loadSwaps();
  if (swaps[dateKey]) {
    delete swaps[dateKey];
    writeJson(SWAP_KEY, swaps);
  }
  return next;
}
