import { useMemo, useState } from "react";
import { DishPhoto } from "../components/DishPhoto";
import { SLOTS } from "../data/plan";
import { toDateKey } from "../lib/date";
import { GROUP_LABEL, groceryForToday, groceryForWeek, recipesForDate } from "../lib/meals";
import type { Profile } from "../lib/profile";
import { copyText, groceryShareText } from "../lib/share";
import { loadChecked, loadGroceryScope, saveChecked, saveGroceryScope } from "../lib/storage";
import type { GroceryGroup } from "../types";

export function GroceryScreen({
  today,
  profile,
  revision,
}: {
  today: Date;
  profile: Profile;
  revision: number;
}) {
  const [scope, setScope] = useState<"today" | "week">(loadGroceryScope);
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);
  const [toast, setToast] = useState("");

  const sections = useMemo(
    () => (scope === "today" ? groceryForToday(profile, today) : groceryForWeek(profile, today)),
    [scope, today, revision, profile],
  );
  const thumbs = useMemo(() => {
    const recipes = recipesForDate(profile, today);
    return SLOTS.map((slot) => recipes[slot]);
  }, [profile, today, revision]);

  const prefix = scope === "today" ? `d:${toDateKey(today)}` : "w";

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  function toggleScope(next: "today" | "week") {
    setScope(next);
    saveGroceryScope(next);
  }

  function toggle(name: string) {
    const key = `${prefix}:${name}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    saveChecked(next);
  }

  async function copyList() {
    const ok = await copyText(groceryShareText(scope, sections));
    showToast(ok ? "已复制，去微信粘贴" : "复制失败，请长按选择文字");
  }

  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  const done = sections.reduce(
    (sum, section) =>
      sum + section.items.filter((item) => checked[`${prefix}:${item.name}`]).length,
    0,
  );
  const allDone = total > 0 && done === total;

  return (
    <section className="page">
      <header className="page-head">
        <p className="date-line">{scope === "today" ? "只买今天的，重复的已加总" : "这一周的量，重复的已加总"}</p>
        <h1>去菜市场转一圈</h1>
      </header>

      <div className="segment">
        <button
          type="button"
          className={scope === "today" ? "on" : ""}
          onClick={() => toggleScope("today")}
        >
          今天
        </button>
        <button
          type="button"
          className={scope === "week" ? "on" : ""}
          onClick={() => toggleScope("week")}
        >
          这一周
        </button>
      </div>

      <div className="grocery-thumbs" aria-label="今日这些菜">
        {thumbs.map((recipe) => (
          <div key={`${recipe.slot}-${recipe.id}`} className="grocery-thumb">
            <DishPhoto recipe={recipe} />
          </div>
        ))}
      </div>

      <div className="grocery-toolbar">
        <p className="grocery-progress">
          {allDone ? "买齐了" : `已勾选 ${done} / ${total}`}
        </p>
        {total > 0 ? (
          <button type="button" className="gear" onClick={() => void copyList()}>
            复制清单
          </button>
        ) : null}
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-plate" aria-hidden />
          <p>清单还是空的</p>
          <span>先回到今天，看看要做什么菜</span>
        </div>
      ) : null}

      {sections.map((section) => (
        <GroceryGroupList
          key={section.group}
          group={section.group}
          items={section.items}
          prefix={prefix}
          checked={checked}
          onToggle={toggle}
        />
      ))}

      {allDone ? (
        <div className="empty-state done-state">
          <p>菜买齐了，回家做饭吧</p>
          <span>勾选会留在这台手机上</span>
        </div>
      ) : null}

      {toast ? <p className="toast page-toast">{toast}</p> : null}
    </section>
  );
}

function GroceryGroupList({
  group,
  items,
  prefix,
  checked,
  onToggle,
}: {
  group: GroceryGroup;
  items: { name: string; amount: string }[];
  prefix: string;
  checked: Record<string, boolean>;
  onToggle: (name: string) => void;
}) {
  const sorted = [...items].sort((a, b) => {
    const aOn = Boolean(checked[`${prefix}:${a.name}`]);
    const bOn = Boolean(checked[`${prefix}:${b.name}`]);
    if (aOn === bOn) return 0;
    return aOn ? 1 : -1;
  });

  return (
    <div className="grocery-group">
      <h2>{GROUP_LABEL[group]}</h2>
      <ul>
        {sorted.map((item) => {
          const key = `${prefix}:${item.name}`;
          const on = Boolean(checked[key]);
          return (
            <li key={item.name}>
              <label className={on ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(item.name)}
                />
                <span className="check" />
                <span className="g-name">{item.name}</span>
                <span className="g-amt">{item.amount}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
