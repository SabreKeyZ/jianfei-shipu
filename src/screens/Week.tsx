import { useState } from "react";
import { BackupBar } from "../components/BackupBar";
import { FilterChips } from "../components/FilterChips";
import { MacroRow } from "../components/MacroRow";
import { MealCard } from "../components/MealCard";
import { SLOTS } from "../data/plan";
import {
  formatChineseDate,
  isSameDay,
  toDateKey,
  weekDates,
  weekdayName,
  weekdayShort,
} from "../lib/date";
import { dayMacros, recipesForDate } from "../lib/meals";
import type { Profile } from "../lib/profile";
import { matchesFilter, type MenuFilter } from "../lib/tags";
import type { Recipe } from "../types";

export function WeekScreen({
  today,
  selected,
  profile,
  favorites,
  onSelect,
  onOpen,
  onToggleFavorite,
  onOpenSettings,
  onRestored,
}: {
  today: Date;
  selected: Date;
  profile: Profile;
  favorites: string[];
  onSelect: (date: Date) => void;
  onOpen: (recipe: Recipe, date: Date) => void;
  onToggleFavorite: (id: string) => void;
  onOpenSettings: () => void;
  onRestored: () => void;
}) {
  const [filter, setFilter] = useState<MenuFilter>("all");
  const days = weekDates(today);
  const recipes = recipesForDate(profile, selected);
  const macros = dayMacros(profile, selected);
  const visible = SLOTS.map((slot) => recipes[slot]).filter((recipe) =>
    matchesFilter(recipe, filter),
  );

  return (
    <section className="page">
      <header className="page-head row-head">
        <div>
          <p className="date-line">按你的身体数据，每天单独排</p>
          <h1>一周都安排好了</h1>
        </div>
        <button type="button" className="gear" onClick={onOpenSettings}>
          改身体数据
        </button>
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
        <p>
          {formatChineseDate(selected)} {weekdayName(selected)}
        </p>
        <MacroRow macros={macros} compact />
      </div>

      <FilterChips value={filter} onChange={setFilter} />

      <div className="meal-list">
        {visible.length === 0 ? (
          <div className="empty-state">
            <p>这一天没有符合筛选的菜</p>
            <span>换个筛选，或点另一天</span>
          </div>
        ) : (
          visible.map((recipe) => (
            <MealCard
              key={`${recipe.slot}-${recipe.id}`}
              recipe={recipe}
              favorite={favorites.includes(recipe.id)}
              onOpen={() => onOpen(recipe, selected)}
              onToggleFavorite={() => onToggleFavorite(recipe.id)}
            />
          ))
        )}
      </div>

      <BackupBar onRestored={onRestored} />
    </section>
  );
}
