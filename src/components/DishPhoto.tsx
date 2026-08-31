import { dishFile, dishSrc } from "../lib/dish";
import type { Recipe } from "../types";

export function DishPhoto({
  recipe,
  className,
  eager = false,
  caption = false,
}: {
  recipe: Pick<Recipe, "id" | "name" | "art" | "image" | "ingredients">;
  className?: string;
  eager?: boolean;
  caption?: boolean;
}) {
  const file = dishFile(recipe);
  return (
    <>
      <img
        key={recipe.id}
        className={className ? `dish-photo ${className}` : "dish-photo"}
        src={dishSrc(recipe)}
        alt={recipe.name}
        data-recipe-id={recipe.id}
        data-dish={file}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {caption ? (
        <span className="photo-caption" aria-hidden="true">
          {recipe.name}
        </span>
      ) : null}
    </>
  );
}
