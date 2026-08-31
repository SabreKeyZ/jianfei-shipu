import { useEffect, useState } from "react";
import { ProfileSheet } from "./components/ProfileSheet";
import { TabBar } from "./components/TabBar";
import { RECIPE_BY_ID } from "./data/recipes";
import { parseDateKey, today, toDateKey, weekDates } from "./lib/date";
import { navigate, parseHash, type Route } from "./lib/hash";
import { DEMO_PROFILE, type Profile } from "./lib/profile";
import {
  loadEaten,
  loadOrDemoProfile,
  loadProfile,
  loadWeights,
  loadWeekSelectedKey,
  markProfileSkipped,
  needsOnboarding,
  saveEaten,
  saveProfile,
  saveWeights,
  saveWeekSelectedKey,
} from "./lib/storage";
import { GroceryScreen } from "./screens/Grocery";
import { RecipeScreen } from "./screens/Recipe";
import { TodayScreen } from "./screens/Today";
import { WeekScreen } from "./screens/Week";
import type { MealSlot, Recipe, TabId } from "./types";

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
  const [profile, setProfile] = useState<Profile>(() => loadOrDemoProfile());
  const [sheet, setSheet] = useState(() => needsOnboarding());
  const [sheetMode, setSheetMode] = useState<"onboard" | "settings">("onboard");
  const [eaten, setEaten] = useState(loadEaten);
  const [weights, setWeights] = useState(loadWeights);

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

  function applyProfile(next: Profile) {
    saveProfile(next);
    setProfile(next);
    setSheet(false);
    setRevision((n) => n + 1);
  }

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

  function toggleEaten(slot: MealSlot) {
    const key = toDateKey(now);
    const next = {
      ...eaten,
      [key]: { ...eaten[key], [slot]: !eaten[key]?.[slot] },
    };
    setEaten(next);
    saveEaten(next);
  }

  function saveWeight(jin: number) {
    if (!Number.isFinite(jin) || jin <= 0) return;
    const next = { ...weights, [toDateKey(now)]: Math.round(jin * 10) / 10 };
    setWeights(next);
    saveWeights(next);
  }

  const recipeDate = route.dateKey ? parseDateKey(route.dateKey) : now;
  const showRecipe = Boolean(route.recipeId && RECIPE_BY_ID[route.recipeId]);
  const onboard = sheet && sheetMode === "onboard" && !loadProfile();

  return (
    <div className="app-shell">
      <div className="phone">
        <main className={showRecipe ? "main recipe-open" : "main"}>
          {showRecipe && route.recipeId ? (
            <RecipeScreen
              recipeId={route.recipeId}
              date={recipeDate}
              profile={profile}
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
              key={`${revision}-week`}
              today={now}
              selected={weekDate}
              profile={profile}
              onSelect={selectWeekDay}
              onOpen={openRecipe}
            />
          ) : route.tab === "grocery" ? (
            <GroceryScreen today={now} profile={profile} revision={revision} />
          ) : (
            <TodayScreen
              key={`${revision}-today`}
              date={now}
              profile={profile}
              eaten={eaten}
              weights={weights}
              onOpen={(recipe) => openRecipe(recipe, now)}
              onToggleEaten={toggleEaten}
              onOpenSettings={() => {
                setSheetMode("settings");
                setSheet(true);
              }}
              onSaveWeight={saveWeight}
            />
          )}
        </main>
        {showRecipe ? null : <TabBar active={route.tab} onChange={goTab} />}
        {sheet ? (
          <ProfileSheet
            initial={sheetMode === "settings" ? profile : null}
            allowSkip={onboard}
            onSave={applyProfile}
            onSkip={
              onboard
                ? () => {
                    markProfileSkipped();
                    applyProfile({ ...DEMO_PROFILE, source: "demo" });
                  }
                : undefined
            }
            onClose={sheetMode === "settings" ? () => setSheet(false) : undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
