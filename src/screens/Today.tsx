import { MealCard } from "../components/MealCard";
import { RingProgress } from "../components/RingProgress";
import { KCAL_TARGET, PROTEIN_TARGET, SLOTS } from "../data/plan";
import { formatChineseDate, weekdayName } from "../lib/date";
import { dayMacros, recipesForDate } from "../lib/meals";
import type { Recipe } from "../types";

export function TodayScreen({
  date,
  onOpen,
}: {
  date: Date;
  onOpen: (recipe: Recipe) => void;
}) {
  const recipes = recipesForDate(date);
  const macros = dayMacros(date);

  return (
    <section className="page">
      <header className="page-head">
        <p className="date-line">
          {formatChineseDate(date)} {weekdayName(date)}
        </p>
        <h1>今天轻松吃</h1>
      </header>

      <div className="hero-card">
        <RingProgress value={macros.kcal} max={KCAL_TARGET}>
          <strong>{macros.kcal}</strong>
          <em>千卡</em>
        </RingProgress>
        <p className="hero-caption">
          目标 {KCAL_TARGET} 千卡 · 蛋白约 {PROTEIN_TARGET} 克
        </p>
        <ul className="macro-strip">
          <li>
            <b>{macros.protein}</b>
            <span>蛋白质</span>
          </li>
          <li>
            <b>{macros.carbs}</b>
            <span>碳水</span>
          </li>
          <li>
            <b>{macros.fat}</b>
            <span>脂肪</span>
          </li>
        </ul>
      </div>

      <h2 className="section-title">今日安排</h2>
      <div className="meal-list">
        {SLOTS.map((slot) => (
          <MealCard
            key={slot}
            recipe={recipes[slot]}
            onOpen={() => onOpen(recipes[slot])}
          />
        ))}
      </div>
    </section>
  );
}
