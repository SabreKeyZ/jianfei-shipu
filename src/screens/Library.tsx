import { useMemo, useState } from "react";
import { DishPhoto } from "../components/DishPhoto";
import { HeartButton } from "../components/HeartButton";
import { recipeMacros } from "../data/nutrition";
import { SLOT_LABEL, SLOTS } from "../data/plan";
import { RECIPES } from "../data/recipes";
import { matchesFilter, recipeTags, type MenuFilter } from "../lib/tags";
import type { MealSlot, Recipe } from "../types";

type SlotChip = "all" | MealSlot;
type ExtraChip = MenuFilter | "fav";

const SLOT_CHIPS: { id: SlotChip; label: string }[] = [
  { id: "all", label: "全部" },
  ...SLOTS.map((slot) => ({ id: slot, label: SLOT_LABEL[slot] })),
];

const EXTRA_CHIPS: { id: ExtraChip; label: string }[] = [
  { id: "quick", label: "快手" },
  { id: "highProtein", label: "高蛋白" },
  { id: "lowCal", label: "低卡" },
  { id: "fav", label: "收藏" },
];

export function LibraryScreen({
  favorites,
  onOpen,
  onToggleFavorite,
  onOpenSettings,
}: {
  favorites: string[];
  onOpen: (recipe: Recipe) => void;
  onToggleFavorite: (id: string) => void;
  onOpenSettings: () => void;
}) {
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<SlotChip>("all");
  const [extra, setExtra] = useState<ExtraChip | null>(null);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((recipe) => {
      if (slot !== "all" && recipe.slot !== slot) return false;
      if (extra === "fav" && !favSet.has(recipe.id)) return false;
      if (extra && extra !== "fav" && !matchesFilter(recipe, extra)) return false;
      if (!q) return true;
      const hay = `${recipe.name} ${recipe.ingredients.map((item) => item.name).join(" ")}`;
      return hay.toLowerCase().includes(q);
    });
  }, [query, slot, extra, favSet]);

  return (
    <section className="page">
      <header className="page-head row-head">
        <div>
          <p className="date-line">菜市场家常菜，点进去就能做</p>
          <h1>菜谱</h1>
        </div>
        <button type="button" className="gear" onClick={onOpenSettings}>
          改身体数据
        </button>
      </header>

      <label className="search-bar">
        <span className="sr-only">搜索菜名或食材</span>
        <input
          type="search"
          value={query}
          placeholder="搜索菜名或食材"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="chips" role="tablist" aria-label="餐次">
        {SLOT_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={slot === chip.id ? "chip on" : "chip"}
            onClick={() => setSlot(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="chips" role="tablist" aria-label="筛选">
        {EXTRA_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={extra === chip.id ? "chip on" : "chip"}
            onClick={() => setExtra((cur) => (cur === chip.id ? null : chip.id))}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <p className="library-count">{list.length} 道</p>

      {list.length === 0 ? (
        <div className="empty-state">
          <p>{extra === "fav" ? "还没有收藏" : "没有符合的菜"}</p>
          <span>{extra === "fav" ? "在卡片上点爱心，以后好找" : "换个词，或看看全部"}</span>
        </div>
      ) : (
        <div className="library-grid">
          {list.map((recipe) => (
            <LibraryCard
              key={recipe.id}
              recipe={recipe}
              favorite={favSet.has(recipe.id)}
              onOpen={() => onOpen(recipe)}
              onToggleFavorite={() => onToggleFavorite(recipe.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LibraryCard({
  recipe,
  favorite,
  onOpen,
  onToggleFavorite,
}: {
  recipe: Recipe;
  favorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  const macros = recipeMacros(recipe);
  const tags = recipeTags(recipe);
  return (
    <article className="lib-card">
      <button type="button" className="lib-card-main" onClick={onOpen}>
        <div className="lib-thumb">
          <DishPhoto recipe={recipe} caption />
          <HeartButton on={favorite} onToggle={onToggleFavorite} className="lib-heart" />
        </div>
        <div className="lib-body">
          <p className="lib-meta">
            {SLOT_LABEL[recipe.slot]}
            {tags.has("quick") ? " · 快手" : ""}
            {` · ${recipe.minutes}分钟`}
          </p>
          <h3>{recipe.name}</h3>
          <p className="lib-kcal">{macros.kcal} kcal · 蛋白 {macros.protein}g</p>
        </div>
      </button>
    </article>
  );
}
