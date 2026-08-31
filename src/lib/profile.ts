export type Sex = "female" | "male";
export type Goal = "cut" | "maintain";
export type Persona = "light" | "standard" | "hearty" | "elder";

export interface Profile {
  heightCm: number;
  weightKg: number;
  age: number;
  sex: Sex;
  goal: Goal;
  source: "user" | "demo";
}

export interface Targets {
  bmr: number;
  tdee: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const DEMO_PROFILE: Profile = {
  heightCm: 160,
  weightKg: 55,
  age: 28,
  sex: "female",
  goal: "cut",
  source: "demo",
};

export const PROFILE_BOUNDS = {
  heightCm: { min: 130, max: 210 },
  weightKg: { min: 35, max: 160 },
  age: { min: 14, max: 90 },
} as const;

/** Keep empty / unfinished inputs as strings so clearing a field is not coerced to 0. */
export function parseProfileNumber(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function seedProfileField(value: number | undefined, fallback: number): string {
  if (value == null) return String(fallback);
  if (!Number.isFinite(value) || value <= 0) return "";
  return String(value);
}

export function profileFieldError(
  field: "heightCm" | "weightKg" | "age",
  text: string,
): string | null {
  const n = parseProfileNumber(text);
  const { min, max } = PROFILE_BOUNDS[field];
  if (field === "age") {
    if (n == null) return "请填写年龄";
    if (n < min || n > max) return `年龄请填 ${min}–${max} 岁`;
    return null;
  }
  if (field === "heightCm") {
    if (n == null) return "请填写身高";
    if (n < min || n > max) return `身高请填 ${min}–${max} cm`;
    return null;
  }
  if (n == null) return "请填写体重";
  if (n < min || n > max) return `体重请填 ${min}–${max} kg`;
  return null;
}

export function isProfileComplete(p: Partial<Profile> | null | undefined): p is Profile {
  if (!p) return false;
  return (
    Number(p.heightCm) >= PROFILE_BOUNDS.heightCm.min &&
    Number(p.heightCm) <= PROFILE_BOUNDS.heightCm.max &&
    Number(p.weightKg) >= PROFILE_BOUNDS.weightKg.min &&
    Number(p.weightKg) <= PROFILE_BOUNDS.weightKg.max &&
    Number(p.age) >= PROFILE_BOUNDS.age.min &&
    Number(p.age) <= PROFILE_BOUNDS.age.max &&
    (p.sex === "female" || p.sex === "male") &&
    (p.goal === "cut" || p.goal === "maintain")
  );
}

/** Mifflin-St Jeor */
export function bmr(p: Profile): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  return p.sex === "male" ? base + 5 : base - 161;
}

export function tdee(p: Profile): number {
  return bmr(p) * 1.4;
}

export function kcalTarget(p: Profile): number {
  const raw = p.goal === "cut" ? tdee(p) - 450 : tdee(p);
  const floor = p.sex === "female" ? 1200 : 1500;
  return Math.round(Math.max(raw, floor));
}

export function proteinTarget(p: Profile): number {
  return Math.min(120, Math.round(p.weightKg * 1.6));
}

export function targetsOf(p: Profile): Targets {
  const kcal = kcalTarget(p);
  const protein = proteinTarget(p);
  const fat = Math.round((kcal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return {
    bmr: Math.round(bmr(p)),
    tdee: Math.round(tdee(p)),
    kcal,
    protein,
    carbs,
    fat,
  };
}

export function personaOf(p: Profile): Persona {
  if (p.age >= 55) return "elder";
  const kcal = kcalTarget(p);
  if (kcal >= 1850) return "hearty";
  if (p.sex === "female" && kcal <= 1450) return "light";
  return "standard";
}

export function profileKey(p: Profile): string {
  return [p.sex, p.age, Math.round(p.heightCm), Math.round(p.weightKg * 10) / 10, p.goal].join("|");
}

export function kgToJin(kg: number): number {
  return Math.round(kg * 2 * 10) / 10;
}

export function jinToKg(jin: number): number {
  return Math.round(jin * 0.5 * 10) / 10;
}
