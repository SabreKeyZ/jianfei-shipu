import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL } from "../data/plan";
import { mainIngredientLine } from "../lib/dish";
import type { Recipe } from "../types";
import { DishPhoto } from "./DishPhoto";
import { HeartButton } from "./HeartButton";
import { MacroRow } from "./MacroRow";

export function MealCard({
  recipe,
  eaten,
  favorite,
  onOpen,
  onToggleEaten,
  onToggleFavorite,
}: {
  recipe: Recipe;
  eaten?: boolean;
  favorite?: boolean;
  onOpen: () => void;
  onToggleEaten?: () => void;
  onToggleFavorite?: () => void;
}) {
  const macros = recipeMacros(recipe);
  return (
    <article className={`meal-card${eaten ? " eaten" : ""}`}>
      <button type="button" className="meal-card-main" onClick={onOpen}>
        <div className="meal-thumb">
          <DishPhoto recipe={recipe} />
        </div>
        <div className="meal-card-body">
          <div className="meal-card-top">
            <span className="slot-text">{SLOT_LABEL[recipe.slot]}</span>
            <span className="pill time-pill">{recipe.minutes} 分钟</span>
            {onToggleFavorite ? (
              <HeartButton on={Boolean(favorite)} onToggle={onToggleFavorite} />
            ) : null}
          </div>
          <h3>{recipe.name}</h3>
          <p className="meal-grams">{mainIngredientLine(recipe)}</p>
          <MacroRow macros={macros} compact />
        </div>
      </button>
      {onToggleEaten ? (
        <button
          type="button"
          className={eaten ? "eat-btn on" : "eat-btn"}
          onClick={onToggleEaten}
        >
          {eaten ? "已吃完" : "吃完了"}
        </button>
      ) : null}
    </article>
  );
}
