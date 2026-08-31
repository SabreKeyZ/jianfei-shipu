import { MealCard } from "../components/MealCard";
import { SLOTS } from "../data/plan";
import { formatChineseDate, weekdayShort } from "../lib/date";
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
        <p className="eyebrow">今天吃这些就够</p>
        <h1>
          {formatChineseDate(date)}
          <span>星期{weekdayShort(date)}</span>
        </h1>
      </header>

      <div className="summary-card">
        <div>
          <p>全天大约</p>
          <strong>{macros.kcal}</strong>
          <em>千卡</em>
        </div>
        <ul>
          <li>
            <b>{macros.protein}</b>
            <span>蛋白质 · 克</span>
          </li>
          <li>
            <b>{macros.carbs}</b>
            <span>碳水 · 克</span>
          </li>
          <li>
            <b>{macros.fat}</b>
            <span>脂肪 · 克</span>
          </li>
        </ul>
      </div>

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
