import { useState } from "react";
import { FilterChips } from "../components/FilterChips";
import { MacroRow } from "../components/MacroRow";
import { MealCard } from "../components/MealCard";
import { RingProgress } from "../components/RingProgress";
import { Sparkline } from "../components/Sparkline";
import { SLOTS } from "../data/plan";
import { formatChineseDate, toDateKey, weekdayName } from "../lib/date";
import { generateDay } from "../lib/generate";
import { dayMacros, recipesForDate, streakDays } from "../lib/meals";
import { kgToJin, type Profile } from "../lib/profile";
import type { EatenMap } from "../lib/storage";
import { matchesFilter, type MenuFilter } from "../lib/tags";
import type { MealSlot, Recipe } from "../types";

export function TodayScreen({
  date,
  profile,
  eaten,
  weights,
  onOpen,
  onToggleEaten,
  onOpenSettings,
  onSaveWeight,
}: {
  date: Date;
  profile: Profile;
  eaten: EatenMap;
  weights: Record<string, number>;
  onOpen: (recipe: Recipe) => void;
  onToggleEaten: (slot: MealSlot) => void;
  onOpenSettings: () => void;
  onSaveWeight: (jin: number) => void;
}) {
  const [filter, setFilter] = useState<MenuFilter>("all");
  const recipes = recipesForDate(profile, date);
  const macros = dayMacros(profile, date);
  const generated = generateDay(profile, date);
  const key = toDateKey(date);
  const dayEaten = eaten[key] ?? {};
  const streak = streakDays(eaten, date);
  const [jin, setJin] = useState(String(weights[key] ?? kgToJin(profile.weightKg)));
  const spark = lastSevenWeights(weights, date);
  const visible = SLOTS.map((slot) => recipes[slot]).filter((recipe) =>
    matchesFilter(recipe, filter),
  );

  return (
    <section className="page">
      <header className="page-head row-head">
        <div>
          <p className="date-line">
            {formatChineseDate(date)} {weekdayName(date)}
            {streak > 0 ? ` · 连续${streak}天` : ""}
          </p>
          <h1>今天轻松吃</h1>
        </div>
        <button type="button" className="gear" onClick={onOpenSettings}>
          身体数据
        </button>
      </header>

      <div className="hero-card">
        <RingProgress value={macros.kcal} max={generated.target.kcal}>
          <strong>{macros.kcal}</strong>
          <em>千卡</em>
        </RingProgress>
        <p className="hero-caption">
          按你的身体数据 · 今日 {generated.target.kcal} kcal
        </p>
        <p className="hero-sub">
          {profile.sex === "female" ? "女" : "男"} · {profile.age}岁 · {profile.heightCm}cm ·{" "}
          {profile.weightKg}kg · {profile.goal === "cut" ? "减脂" : "维持"}
          {profile.source === "demo" ? " · 示例" : ""}
        </p>
        <MacroRow macros={macros} />
        <div className="weight-row">
          <span>体重</span>
          <input
            type="number"
            inputMode="decimal"
            value={jin}
            onChange={(e) => setJin(e.target.value)}
          />
          <em>斤</em>
          <button type="button" className="mini-btn" onClick={() => onSaveWeight(Number(jin))}>
            记下
          </button>
        </div>
        <Sparkline values={spark} />
      </div>

      <h2 className="section-title">今日安排</h2>
      <FilterChips value={filter} onChange={setFilter} />

      <div className="meal-list">
        {visible.length === 0 ? (
          <div className="empty-state">
            <p>这个筛选下今天没有菜</p>
            <span>换「全部」看看，或去本周换一天</span>
          </div>
        ) : (
          visible.map((recipe) => (
            <MealCard
              key={recipe.slot}
              recipe={recipe}
              eaten={Boolean(dayEaten[recipe.slot])}
              onOpen={() => onOpen(recipe)}
              onToggleEaten={() => onToggleEaten(recipe.slot)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function lastSevenWeights(weights: Record<string, number>, today: Date): number[] {
  const out: number[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const value = weights[toDateKey(day)];
    if (value) out.push(value);
  }
  return out;
}
