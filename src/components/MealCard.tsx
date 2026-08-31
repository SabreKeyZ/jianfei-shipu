import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL } from "../data/plan";
import type { Recipe } from "../types";
import { FoodArt } from "./FoodArt";

export function MealCard({
  recipe,
  onOpen,
}: {
  recipe: Recipe;
  onOpen: () => void;
}) {
  const macros = recipeMacros(recipe);
  return (
    <button type="button" className="meal-card" onClick={onOpen}>
      <FoodArt kind={recipe.art} size={96} />
      <div className="meal-card-body">
        <div className="meal-card-top">
          <span className="slot-text">{SLOT_LABEL[recipe.slot]}</span>
          <span className="pill">{recipe.minutes} 分钟</span>
        </div>
        <h3>{recipe.name}</h3>
        <p>
          {macros.kcal} 千卡 · 蛋白 {macros.protein} 克
        </p>
      </div>
    </button>
  );
}
