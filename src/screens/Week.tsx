import { MealCard } from "../components/MealCard";
import { SLOTS } from "../data/plan";
import {
  formatChineseDate,
  isSameDay,
  toDateKey,
  weekDates,
  weekdayShort,
} from "../lib/date";
import { dayMacros, recipesForDate } from "../lib/meals";
import type { Recipe } from "../types";

export function WeekScreen({
  today,
  selected,
  onSelect,
  onOpen,
}: {
  today: Date;
  selected: Date;
  onSelect: (date: Date) => void;
  onOpen: (recipe: Recipe, date: Date) => void;
}) {
  const days = weekDates(today);
  const recipes = recipesForDate(selected);
  const macros = dayMacros(selected);

  return (
    <section className="page">
      <header className="page-head">
        <p className="eyebrow">固定一周循环</p>
        <h1>本周食谱</h1>
      </header>

      <div className="week-strip" role="tablist" aria-label="选择星期">
        {days.map((day) => {
          const active = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={toDateKey(day)}
              type="button"
              role="tab"
              aria-selected={active}
              className={`week-day${active ? " active" : ""}${isToday ? " is-today" : ""}`}
              onClick={() => onSelect(day)}
            >
              <span>周{weekdayShort(day)}</span>
              <b>{day.getDate()}</b>
              {isToday ? <em>今</em> : null}
            </button>
          );
        })}
      </div>

      <div className="week-summary">
        <div>
          <p>
            {formatChineseDate(selected)} · 星期{weekdayShort(selected)}
          </p>
          <strong>
            {macros.kcal} 千卡 · 蛋白 {macros.protein} 克
          </strong>
        </div>
      </div>

      <div className="meal-list">
        {SLOTS.map((slot) => (
          <MealCard
            key={slot}
            recipe={recipes[slot]}
            onOpen={() => onOpen(recipes[slot], selected)}
          />
        ))}
      </div>
    </section>
  );
}
