import { useEffect, useState } from "react";
import { ProfileSheet } from "./components/ProfileSheet";
import { TabBar } from "./components/TabBar";
import { RECIPE_BY_ID } from "./data/recipes";
import { parseDateKey, today, toDateKey, weekDates } from "./lib/date";
import { navigate, parseHash, type Route } from "./lib/hash";
import { DEMO_PROFILE, profileKey, type Profile } from "./lib/profile";
import { nextFitSwap } from "./lib/generate";
import {
  bumpReroll,
  loadEaten,
  loadFavorites,
  loadOrDemoProfile,
  loadProfile,
  loadWeights,
  loadWeekSelectedKey,
  markProfileSkipped,
  needsOnboarding,
  saveDaySwap,
  saveEaten,
  saveFavorites,
  saveProfile,
  saveWeights,
  saveWeekSelectedKey,
} from "./lib/storage";
import { GroceryScreen } from "./screens/Grocery";
import { LibraryScreen } from "./screens/Library";
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
  const [favorites, setFavorites] = useState(loadFavorites);

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

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    saveFavorites(next);
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

  function openSettings() {
    setSheetMode("settings");
    setSheet(true);
  }

  function swapSlot(slot: MealSlot, date: Date, currentId: string) {
    const next = nextFitSwap(profile, date, slot, currentId);
    saveDaySwap(toDateKey(date), slot, next.id);
    setRevision((n) => n + 1);
    return next;
  }

  function rerollToday() {
    bumpReroll(toDateKey(now));
    setRevision((n) => n + 1);
  }

  return (
    <div className="app-shell">
      <div className="phone">
        <main className={showRecipe ? "main recipe-open" : "main"}>
          {showRecipe && route.recipeId ? (
            <RecipeScreen
              recipeId={route.recipeId}
              date={recipeDate}
              today={now}
              profile={profile}
              favorite={favorites.includes(route.recipeId)}
              onBack={() => goTab(lastTab)}
              onToggleFavorite={() => {
                if (route.recipeId) toggleFavorite(route.recipeId);
              }}
              onAssigned={() => setRevision((n) => n + 1)}
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
              favorites={favorites}
              onSelect={selectWeekDay}
              onOpen={openRecipe}
              onToggleFavorite={toggleFavorite}
              onOpenSettings={openSettings}
            />
          ) : route.tab === "library" ? (
            <LibraryScreen
              favorites={favorites}
              onOpen={(recipe) => openRecipe(recipe, now)}
              onToggleFavorite={toggleFavorite}
              onOpenSettings={openSettings}
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
              favorites={favorites}
              onOpen={(recipe) => openRecipe(recipe, now)}
              onToggleEaten={toggleEaten}
              onToggleFavorite={toggleFavorite}
              onOpenSettings={openSettings}
              onReroll={rerollToday}
              onSwap={(slot, recipe) => swapSlot(slot, now, recipe.id)}
              onSaveWeight={saveWeight}
            />
          )}
        </main>
        {showRecipe ? null : <TabBar active={route.tab} onChange={goTab} />}
        {sheet ? (
          <ProfileSheet
            key={`${sheetMode}-${profileKey(profile)}`}
            initial={sheetMode === "settings" ? profile : null}
            allowSkip={onboard}
            saveLabel={sheetMode === "settings" ? "保存并重排今日菜单" : undefined}
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
