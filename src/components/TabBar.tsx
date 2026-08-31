import type { TabId } from "../types";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "today", label: "今天", icon: "日" },
  { id: "week", label: "本周", icon: "周" },
  { id: "grocery", label: "采购", icon: "购" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="tabbar" aria-label="底部导航">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === active ? "tab active" : "tab"}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
