import { useMemo, useState } from "react";
import { toDateKey } from "../lib/date";
import { GROUP_LABEL, groceryForToday, groceryForWeek } from "../lib/meals";
import { loadChecked, loadGroceryScope, saveChecked, saveGroceryScope } from "../lib/storage";

export function GroceryScreen({ today, revision }: { today: Date; revision: number }) {
  const [scope, setScope] = useState<"today" | "week">(loadGroceryScope);
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);

  const sections = useMemo(
    () => (scope === "today" ? groceryForToday(today) : groceryForWeek(today)),
    [scope, today, revision],
  );

  const prefix = scope === "today" ? `d:${toDateKey(today)}` : "w";

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
        <p className="date-line">{scope === "today" ? "只买今天的" : "这一周的量"}</p>
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

      <p className="grocery-progress">
        {allDone ? "买齐了" : `已勾选 ${done} / ${total}`}
      </p>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-plate" aria-hidden />
          <p>清单还是空的</p>
          <span>先回到今天，看看要做什么菜</span>
        </div>
      ) : null}

      {sections.map((section) => (
        <div key={section.group} className="grocery-group">
          <h2>{GROUP_LABEL[section.group]}</h2>
          <ul>
            {section.items.map((item) => {
              const key = `${prefix}:${item.name}`;
              const on = Boolean(checked[key]);
              return (
                <li key={item.name}>
                  <label className={on ? "done" : ""}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(item.name)}
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
      ))}

      {allDone ? (
        <div className="empty-state done-state">
          <p>菜买齐了，回家做饭吧</p>
          <span>勾选会留在这台手机上</span>
        </div>
      ) : null}
    </section>
  );
}
