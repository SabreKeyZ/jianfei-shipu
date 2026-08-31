import { useState } from "react";
import { FoodArt } from "../components/FoodArt";
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
  const recipe = getRecipe(recipeId);
  const macros = recipeMacros(recipe);

  function swap() {
    const current = mealsForDate(date)[recipe.slot];
    const nextId = nextSwapId(recipe.slot, current);
    saveDaySwap(toDateKey(date), recipe.slot, nextId);
    const next = getRecipe(nextId);
    onSwapped(next);
    setToast(`已换成「${next.name}」`);
    window.setTimeout(() => setToast(""), 2200);
  }

  return (
    <section className="page recipe-page">
      <header className="recipe-head">
        <button type="button" className="back" onClick={onBack}>
          返回
        </button>
        <span>{SLOT_LABEL[recipe.slot]}</span>
      </header>

      <div className="recipe-hero">
        <FoodArt kind={recipe.art} size={88} />
        <div>
          <h1>{recipe.name}</h1>
          <p>
            {recipe.minutes} 分钟 · 1 人份
          </p>
        </div>
      </div>

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

      <button type="button" className="swap-btn" onClick={swap}>
        换一道同餐
      </button>
      {toast ? <p className="toast">{toast}</p> : null}

      <h2>食材</h2>
      <ul className="ing-list">
        {recipe.ingredients.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <b>{item.amount}</b>
          </li>
        ))}
      </ul>

      <h2>做法</h2>
      <ol className="step-list">
        {recipe.steps.map((step, index) => (
          <li key={step}>
            <em>{index + 1}</em>
            <p>{step}</p>
          </li>
        ))}
      </ol>

      <aside className="tip">
        <strong>减脂小技巧</strong>
        <p>{recipe.tip}</p>
      </aside>
    </section>
  );
}
