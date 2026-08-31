import { useState } from "react";
import { FilterChips } from "../components/FilterChips";
import { MacroRow } from "../components/MacroRow";
import { MealCard } from "../components/MealCard";
import { RingProgress } from "../components/RingProgress";
import { Sparkline } from "../components/Sparkline";
import { SLOTS } from "../data/plan";
import { formatChineseDate, toDateKey, weekdayName } from "../lib/date";
import { generateDay } from "../lib/generate";
import { dayMacros, recipesForDate, streakDays } from "../lib/meals";
import { kgToJin, type Profile } from "../lib/profile";
import { copyText, todayShareText } from "../lib/share";
import type { EatenMap } from "../lib/storage";
import {
  loadPwaHintDismissed,
  loadWater,
  savePwaHintDismissed,
  saveWater,
} from "../lib/storage";
import { matchesFilter, type MenuFilter } from "../lib/tags";
import type { MealSlot, Recipe } from "../types";

export function TodayScreen({
  date,
  profile,
  eaten,
  weights,
  favorites,
  onOpen,
  onToggleEaten,
  onToggleFavorite,
  onOpenSettings,
  onReroll,
  onSwap,
  onSaveWeight,
}: {
  date: Date;
  profile: Profile;
  eaten: EatenMap;
  weights: Record<string, number>;
  favorites: string[];
  onOpen: (recipe: Recipe) => void;
  onToggleEaten: (slot: MealSlot) => void;
  onToggleFavorite: (id: string) => void;
  onOpenSettings: () => void;
  onReroll: () => void;
  onSwap: (slot: MealSlot, recipe: Recipe) => Recipe;
  onSaveWeight: (jin: number) => void;
}) {
  const [filter, setFilter] = useState<MenuFilter>("all");
  const [toast, setToast] = useState("");
  const [pwaHint, setPwaHint] = useState(() => !loadPwaHintDismissed());
  const recipes = recipesForDate(profile, date);
  const macros = dayMacros(profile, date);
  const generated = generateDay(profile, date);
  const key = toDateKey(date);
  const dayEaten = eaten[key] ?? {};
  const streak = streakDays(eaten, date);
  const [jin, setJin] = useState(String(weights[key] ?? kgToJin(profile.weightKg)));
  const [water, setWater] = useState(() => clampCups(loadWater()[key] ?? 0));
  const spark = lastSevenWeights(weights, date);
  const visible = SLOTS.map((slot) => recipes[slot]).filter((recipe) =>
    matchesFilter(recipe, filter),
  );

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function shareMenu() {
    const text = todayShareText(recipes, macros.kcal);
    const ok = await copyText(text);
    showToast(ok ? "已复制，去微信粘贴" : "复制失败，请长按选择文字");
  }

  function setCups(next: number) {
    const cups = clampCups(next);
    setWater(cups);
    const all = loadWater();
    saveWater({ ...all, [key]: cups });
  }

  function dismissPwa() {
    savePwaHintDismissed();
    setPwaHint(false);
  }

  return (
    <section className="page">
      {pwaHint ? (
        <p className="pwa-hint">
          <span>加到主屏幕，明天打开就是今日菜单</span>
          <button type="button" onClick={dismissPwa} aria-label="关闭">
            知道了
          </button>
        </p>
      ) : null}

      <header className="page-head row-head">
        <div>
          <p className="date-line">
            {formatChineseDate(date)} {weekdayName(date)}
            {streak > 0 ? ` · 连续${streak}天` : ""}
          </p>
          <h1>今天轻松吃</h1>
        </div>
        <div className="head-actions">
          <button type="button" className="gear" onClick={() => void shareMenu()}>
            分享菜单
          </button>
          <button type="button" className="gear" onClick={onOpenSettings}>
            身体数据
          </button>
        </div>
      </header>

      <div className="hero-card">
        <RingProgress value={macros.kcal} max={generated.target.kcal}>
          <strong>{macros.kcal}</strong>
          <em>千卡</em>
        </RingProgress>
        <p className="hero-caption">
          按你的身体数据 · 今日 {generated.target.kcal} kcal
        </p>
        <button type="button" className="hero-sub tap-edit" onClick={onOpenSettings}>
          {profile.sex === "female" ? "女" : "男"} · {profile.age}岁 · {profile.heightCm}cm ·{" "}
          {profile.weightKg}kg · {profile.goal === "cut" ? "减脂" : "维持"}
          {profile.source === "demo" ? " · 示例" : ""}
        </button>
        <button type="button" className="edit-profile" onClick={onOpenSettings}>
          改身体数据
        </button>
        <MacroRow macros={macros} />
      </div>

      <div className="habit-row">
        <div className="water-card">
          <div className="habit-head">
            <span>喝水</span>
            <em>
              {water}/8 杯 · {water * 250}ml
            </em>
          </div>
          <div className="water-cups" role="group" aria-label="今日饮水">
            {Array.from({ length: 8 }, (_, index) => {
              const filled = index < water;
              return (
                <button
                  key={index}
                  type="button"
                  className={filled ? "cup on" : "cup"}
                  aria-label={`第 ${index + 1} 杯`}
                  onClick={() => setCups(water === index + 1 ? index : index + 1)}
                />
              );
            })}
          </div>
        </div>

        <div className="weight-card">
          <div className="habit-head">
            <span>体重</span>
            <em>近 7 天</em>
          </div>
          <div className="weight-row">
            <input
              type="number"
              inputMode="decimal"
              value={jin}
              onChange={(e) => setJin(e.target.value)}
              aria-label="今日体重"
            />
            <em>斤</em>
            <button type="button" className="mini-btn" onClick={() => onSaveWeight(Number(jin))}>
              记下
            </button>
          </div>
          <Sparkline values={spark} />
        </div>
      </div>

      <div className="section-row">
        <h2 className="section-title">今日安排</h2>
        <button
          type="button"
          className="reroll-btn"
          onClick={() => {
            onReroll();
            showToast("已换一批，仍按你的热量来");
          }}
        >
          🎲 换一批
        </button>
      </div>
      <FilterChips value={filter} onChange={setFilter} />

      <div className="meal-list">
        {visible.length === 0 ? (
          <div className="empty-state">
            <p>这个筛选下今天没有菜</p>
            <span>换「全部」看看，或去本周换一天</span>
          </div>
        ) : (
          visible.map((recipe) => (
            <MealCard
              key={recipe.slot}
              recipe={recipe}
              eaten={Boolean(dayEaten[recipe.slot])}
              favorite={favorites.includes(recipe.id)}
              onOpen={() => onOpen(recipe)}
              onToggleEaten={() => onToggleEaten(recipe.slot)}
              onToggleFavorite={() => onToggleFavorite(recipe.id)}
              onSwap={() => {
                const next = onSwap(recipe.slot, recipe);
                showToast(`已换成「${next.name}」`);
              }}
            />
          ))
        )}
      </div>

      {toast ? <p className="toast page-toast">{toast}</p> : null}
    </section>
  );
}

function clampCups(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(8, Math.max(0, Math.round(n)));
}

function lastSevenWeights(weights: Record<string, number>, today: Date): number[] {
  const out: number[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const value = weights[toDateKey(day)];
    if (value) out.push(value);
  }
  return out;
}
