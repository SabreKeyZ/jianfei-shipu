import { dishSrc } from "../lib/dish";
import type { Recipe } from "../types";

export function DishPhoto({
  recipe,
  className,
  eager = false,
}: {
  recipe: Pick<Recipe, "name" | "art" | "image">;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      className={className ? `dish-photo ${className}` : "dish-photo"}
      src={dishSrc(recipe)}
      alt={recipe.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
