import { useEffect, useRef, useState } from "react";
import { DishPhoto } from "../components/DishPhoto";
import { HeartButton } from "../components/HeartButton";
import { MacroRow } from "../components/MacroRow";
import { recipeMacros, roundMacros } from "../data/nutrition";
import { SLOT_LABEL, SLOTS } from "../data/plan";
import { getRecipe } from "../data/recipes";
import { formatAmount } from "../lib/amounts";
import { toDateKey } from "../lib/date";
import { nextFitSwap } from "../lib/generate";
import { dayPlan } from "../lib/meals";
import type { Profile } from "../lib/profile";
import { saveDaySwap } from "../lib/storage";
import type { MealSlot, Recipe as RecipeType } from "../types";

const SERVINGS = [0.5, 1, 1.5, 2] as const;
type Serving = (typeof SERVINGS)[number];

export function RecipeScreen({
  recipeId,
  date,
  today,
  profile,
  favorite,
  onBack,
  onSwapped,
  onAssigned,
  onToggleFavorite,
}: {
  recipeId: string;
  date: Date;
  today: Date;
  profile: Profile;
  favorite: boolean;
  onBack: () => void;
  onSwapped: (recipe: RecipeType) => void;
  onAssigned: () => void;
  onToggleFavorite: () => void;
}) {
  const [toast, setToast] = useState("");
  const [started, setStarted] = useState(false);
  const [servings, setServings] = useState<Serving>(1);
  const stepsRef = useRef<HTMLDivElement>(null);
  const planned = Object.values(dayPlan(profile, date).recipes).find((item) => item.id === recipeId);
  const recipe = planned ?? getRecipe(recipeId);
  const scaled = {
    ...recipe,
    ingredients: recipe.ingredients.map((item) => ({ ...item, grams: item.grams * servings })),
  };
  const macros = recipeMacros(scaled);
  const grams = scaled.ingredients.reduce((sum, item) => sum + item.grams, 0);

  useEffect(() => {
    setServings(1);
    setStarted(false);
  }, [recipe.id]);

  function bumpServings(dir: -1 | 1) {
    const index = SERVINGS.indexOf(servings);
    const next = SERVINGS[index + dir];
    if (next != null) setServings(next);
  }
  const per100 = roundMacros({
    kcal: (macros.kcal / Math.max(grams, 1)) * 100,
    protein: (macros.protein / Math.max(grams, 1)) * 100,
    carbs: (macros.carbs / Math.max(grams, 1)) * 100,
    fat: (macros.fat / Math.max(grams, 1)) * 100,
  });

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  function swap() {
    const next = nextFitSwap(profile, date, recipe.slot, recipe.id);
    saveDaySwap(toDateKey(date), recipe.slot, next.id);
    setStarted(false);
    onSwapped(next);
    showToast(`已换成「${next.name}」`);
  }

  function assignToToday(slot: MealSlot) {
    saveDaySwap(toDateKey(today), slot, recipe.id);
    onAssigned();
    showToast(`已换到今日${SLOT_LABEL[slot]}`);
  }

  function startCook() {
    setStarted(true);
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("按步骤做就行，一人份");
  }

  return (
    <section className="recipe-page">
      <div className="recipe-scroll">
        <div className="recipe-hero">
          <DishPhoto recipe={recipe} className="recipe-hero-img" eager />
          <button type="button" className="back-float" onClick={onBack}>
            返回
          </button>
          <HeartButton on={favorite} onToggle={onToggleFavorite} className="hero-heart" />
          <span className="bleed-slot">{SLOT_LABEL[recipe.slot]}</span>
        </div>

        <div className="recipe-body">
          <h1>{recipe.name}</h1>
          <div className="recipe-meta">
            <span className="time-chip">{recipe.minutes} 分钟</span>
            <div className="servings-stepper" role="group" aria-label="份数">
              <button
                type="button"
                disabled={servings <= 0.5}
                onClick={() => bumpServings(-1)}
                aria-label="减少份数"
              >
                −
              </button>
              <span>{servings} 人份</span>
              <button
                type="button"
                disabled={servings >= 2}
                onClick={() => bumpServings(1)}
                aria-label="增加份数"
              >
                +
              </button>
            </div>
          </div>

          <MacroRow macros={macros} />
          <p className="per100">
            每 100g 大约 {per100.kcal} 千卡 · 蛋白 {per100.protein}g · 碳水 {per100.carbs}g · 脂肪 {per100.fat}g
          </p>

          <h2>食材</h2>
          <ul className="chip-list">
            {scaled.ingredients.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <em>{formatAmount(item.name, item.food, item.grams)}</em>
              </li>
            ))}
          </ul>

          <div ref={stepsRef} className="steps-anchor">
            <h2>做法</h2>
            <ol className="step-list">
              {recipe.steps.map((step, index) => (
                <li key={step}>
                  <em>{index + 1}</em>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <aside className="tip">
            <strong>减脂小技巧</strong>
            <p>{recipe.tip}</p>
          </aside>

          <div className="assign-block">
            <p>换到今日</p>
            <div className="assign-row">
              {SLOTS.filter((slot) => slot !== "snack" || recipe.slot === "snack").map((slot) => (
                <button key={slot} type="button" className="assign-chip" onClick={() => assignToToday(slot)}>
                  {SLOT_LABEL[slot]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast ? <p className="toast">{toast}</p> : null}

      <div className="recipe-cta">
        <button type="button" className="btn-ghost" onClick={swap}>
          换一道
        </button>
        <button type="button" className="btn-primary" onClick={startCook}>
          {started ? "继续做这道菜" : "开始做这道菜"}
        </button>
      </div>
    </section>
  );
}
