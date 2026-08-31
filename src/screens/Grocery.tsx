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

  return (
    <section className="page">
      <header className="page-head">
        <p className="eyebrow">菜市场买这些</p>
        <h1>采购清单</h1>
      </header>

      <div className="segment">
        <button
          type="button"
          className={scope === "today" ? "on" : ""}
          onClick={() => toggleScope("today")}
        >
          只看今天
        </button>
        <button
          type="button"
          className={scope === "week" ? "on" : ""}
          onClick={() => toggleScope("week")}
        >
          看这一周
        </button>
      </div>

      <p className="grocery-progress">
        已勾选 {done} / {total}
      </p>

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
    </section>
  );
}
