import type { SlotSwaps } from "../types";
import { isProfileComplete, type Profile } from "./profile";
import {
  loadChecked,
  loadEaten,
  loadFavorites,
  loadProfile,
  loadRerolls,
  loadSwaps,
  loadWater,
  loadWeights,
  clearProfile,
  saveChecked,
  saveEaten,
  saveFavorites,
  saveProfile,
  saveRerolls,
  saveSwaps,
  saveWater,
  saveWeights,
  type EatenMap,
} from "./storage";
import { toDateKey } from "./date";

const BACKUP_VERSION = 1;

export interface AppBackup {
  version: number;
  exportedAt: string;
  profile: Profile | null;
  eaten: EatenMap;
  weights: Record<string, number>;
  favorites: string[];
  groceryChecked: Record<string, boolean>;
  water: Record<string, number>;
  swaps: Record<string, SlotSwaps>;
  rerolls: Record<string, number>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asRecord<T>(value: unknown, fallback: T): T {
  return isRecord(value) ? (value as T) : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function collectBackup(): AppBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: loadProfile(),
    eaten: loadEaten(),
    weights: loadWeights(),
    favorites: loadFavorites(),
    groceryChecked: loadChecked(),
    water: loadWater(),
    swaps: loadSwaps(),
    rerolls: loadRerolls(),
  };
}

export function isBackupPayload(value: unknown): value is AppBackup {
  if (!isRecord(value)) return false;
  if (value.profile != null && !isProfileComplete(value.profile as Partial<Profile>)) return false;
  if (value.eaten != null && !isRecord(value.eaten)) return false;
  if (value.weights != null && !isRecord(value.weights)) return false;
  if (value.favorites != null && !Array.isArray(value.favorites)) return false;
  if (value.groceryChecked != null && !isRecord(value.groceryChecked)) return false;
  if (value.water != null && !isRecord(value.water)) return false;
  if (value.swaps != null && !isRecord(value.swaps)) return false;
  if (value.rerolls != null && !isRecord(value.rerolls)) return false;
  return true;
}

export function applyBackup(data: AppBackup): void {
  if (data.profile && isProfileComplete(data.profile)) {
    saveProfile(data.profile);
  } else {
    clearProfile();
  }
  saveEaten(asRecord<EatenMap>(data.eaten, {}));
  saveWeights(asRecord<Record<string, number>>(data.weights, {}));
  saveFavorites(asStringArray(data.favorites));
  saveChecked(asRecord<Record<string, boolean>>(data.groceryChecked, {}));
  saveWater(asRecord<Record<string, number>>(data.water, {}));
  saveSwaps(asRecord<Record<string, SlotSwaps>>(data.swaps, {}));
  saveRerolls(asRecord<Record<string, number>>(data.rerolls, {}));
}

export function backupFileName(date = new Date()): string {
  return `减脂食谱备份-${toDateKey(date)}.json`;
}

export function downloadBackup(): void {
  const blob = new Blob([JSON.stringify(collectBackup(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = backupFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file: File): Promise<AppBackup> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!isBackupPayload(parsed)) {
    throw new Error("invalid-backup");
  }
  return parsed;
}
