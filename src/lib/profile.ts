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

export function isProfileComplete(p: Partial<Profile> | null | undefined): p is Profile {
  if (!p) return false;
  return (
    Number(p.heightCm) >= 130 &&
    Number(p.heightCm) <= 210 &&
    Number(p.weightKg) >= 35 &&
    Number(p.weightKg) <= 160 &&
    Number(p.age) >= 14 &&
    Number(p.age) <= 90 &&
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
