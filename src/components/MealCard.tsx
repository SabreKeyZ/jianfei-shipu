import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL } from "../data/plan";
import type { Recipe } from "../types";
import { FoodArt } from "./FoodArt";
import { MacroRow } from "./MacroRow";

export function MealCard({
  recipe,
  eaten,
  onOpen,
  onToggleEaten,
}: {
  recipe: Recipe;
  eaten?: boolean;
  onOpen: () => void;
  onToggleEaten?: () => void;
}) {
  const macros = recipeMacros(recipe);
  return (
    <article className={`meal-card${eaten ? " eaten" : ""}`}>
      <button type="button" className="meal-card-main" onClick={onOpen}>
        <FoodArt kind={recipe.art} size={92} />
        <div className="meal-card-body">
          <div className="meal-card-top">
            <span className="slot-text">{SLOT_LABEL[recipe.slot]}</span>
            <span className="pill">{recipe.minutes} 分钟</span>
          </div>
          <h3>{recipe.name}</h3>
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
