import { useRef, useState } from "react";
import { ART_TONE, FoodArt } from "../components/FoodArt";
import { recipeMacros } from "../data/nutrition";
import { nextSwapId, SLOT_LABEL } from "../data/plan";
import { getRecipe } from "../data/recipes";
import { toDateKey } from "../lib/date";
import { mealsForDate } from "../lib/meals";
import { saveDaySwap } from "../lib/storage";
import type { Recipe as RecipeType } from "../types";

export function RecipeScreen({
  recipeId,
  date,
  onBack,
  onSwapped,
}: {
  recipeId: string;
  date: Date;
  onBack: () => void;
  onSwapped: (recipe: RecipeType) => void;
}) {
  const [toast, setToast] = useState("");
  const [started, setStarted] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const recipe = getRecipe(recipeId);
  const macros = recipeMacros(recipe);
  const tone = ART_TONE[recipe.art];

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  function swap() {
    const current = mealsForDate(date)[recipe.slot];
    const nextId = nextSwapId(recipe.slot, current);
    saveDaySwap(toDateKey(date), recipe.slot, nextId);
    const next = getRecipe(nextId);
    setStarted(false);
    onSwapped(next);
    showToast(`已换成「${next.name}」`);
  }

  function startCook() {
    setStarted(true);
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("按步骤做就行，一人份");
  }

  return (
    <section className="recipe-page">
      <div className="recipe-scroll">
        <div className="recipe-bleed" style={{ background: tone.bg, color: tone.ink }}>
          <button type="button" className="back-float" onClick={onBack}>
            返回
          </button>
          <span className="bleed-slot">{SLOT_LABEL[recipe.slot]}</span>
          <FoodArt kind={recipe.art} size={148} />
        </div>

        <div className="recipe-body">
          <h1>{recipe.name}</h1>
          <p className="recipe-sub">
            {recipe.minutes} 分钟 · 1 人份
          </p>

          <div className="macro-row">
            <div>
              <b>{macros.kcal}</b>
              <span>千卡</span>
            </div>
            <div>
              <b>{macros.protein}</b>
              <span>蛋白质</span>
            </div>
            <div>
              <b>{macros.carbs}</b>
              <span>碳水</span>
            </div>
            <div>
              <b>{macros.fat}</b>
              <span>脂肪</span>
            </div>
          </div>

          <h2>食材</h2>
          <ul className="chip-list">
            {recipe.ingredients.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <em>{item.amount}</em>
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
