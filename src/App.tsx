import { useEffect, useState } from "react";
import { TabBar } from "./components/TabBar";
import { RECIPE_BY_ID } from "./data/recipes";
import { parseDateKey, today, toDateKey, weekDates } from "./lib/date";
import { navigate, parseHash, type Route } from "./lib/hash";
import { loadWeekSelectedKey, saveWeekSelectedKey } from "./lib/storage";
import { GroceryScreen } from "./screens/Grocery";
import { RecipeScreen } from "./screens/Recipe";
import { TodayScreen } from "./screens/Today";
import { WeekScreen } from "./screens/Week";
import type { Recipe, TabId } from "./types";

function initialWeekDate(now: Date): Date {
  const saved = loadWeekSelectedKey();
  if (!saved) return now;
  const date = parseDateKey(saved);
  return weekDates(now).some((day) => toDateKey(day) === saved) ? date : now;
}

export function App() {
  const now = today();
  const [route, setRoute] = useState<Route>(parseHash);
  const [lastTab, setLastTab] = useState<TabId>(parseHash().tab);
  const [weekDate, setWeekDate] = useState(() => initialWeekDate(now));
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => {
      const next = parseHash();
      setRoute(next);
      if (!next.recipeId) setLastTab(next.tab);
    };
    window.addEventListener("hashchange", sync);
    if (!window.location.hash) {
      navigate({ tab: "today", recipeId: null, dateKey: null });
    }
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function goTab(tab: TabId) {
    setLastTab(tab);
    navigate({ tab, recipeId: null, dateKey: null });
  }

  function openRecipe(recipe: Recipe, date: Date) {
    navigate({ tab: lastTab, recipeId: recipe.id, dateKey: toDateKey(date) });
  }

  function selectWeekDay(date: Date) {
    setWeekDate(date);
    saveWeekSelectedKey(toDateKey(date));
  }

  const recipeDate = route.dateKey ? parseDateKey(route.dateKey) : now;
  const showRecipe = Boolean(route.recipeId && RECIPE_BY_ID[route.recipeId]);

  return (
    <div className="app-shell">
      <div className="phone">
        <div className="status-bar" aria-hidden>
          <span>今日减脂</span>
          <span>微信</span>
        </div>
        <main className={showRecipe ? "main recipe-open" : "main"}>
          {showRecipe && route.recipeId ? (
            <RecipeScreen
              recipeId={route.recipeId}
              date={recipeDate}
              onBack={() => goTab(lastTab)}
              onSwapped={(recipe) => {
                setRevision((n) => n + 1);
                navigate({
                  tab: lastTab,
                  recipeId: recipe.id,
                  dateKey: toDateKey(recipeDate),
                });
              }}
            />
          ) : route.tab === "week" ? (
            <WeekScreen
              key={revision}
              today={now}
              selected={weekDate}
              onSelect={selectWeekDay}
              onOpen={openRecipe}
            />
          ) : route.tab === "grocery" ? (
            <GroceryScreen today={now} revision={revision} />
          ) : (
            <TodayScreen key={revision} date={now} onOpen={(recipe) => openRecipe(recipe, now)} />
          )}
        </main>
        {showRecipe ? null : <TabBar active={route.tab} onChange={goTab} />}
      </div>
    </div>
  );
}
