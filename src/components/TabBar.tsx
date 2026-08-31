import type { TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "今天" },
  { id: "week", label: "本周" },
  { id: "library", label: "菜谱" },
  { id: "grocery", label: "采购" },
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
          <span className="tab-icon">{icon(tab.id)}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function icon(id: TabId) {
  if (id === "today") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (id === "week") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3.5v3M16 3.5v3M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "library") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
        <rect x="4" y="5" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="5" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="14" width="7" height="5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="14" width="7" height="5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path
        d="M5 8h14l-1.2 10.2A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.8L5 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8V6.5A3 3 0 0 1 12 3.5 3 3 0 0 1 15 6.5V8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
