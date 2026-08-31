import { FILTER_LABEL, type MenuFilter } from "../lib/tags";

const FILTERS: MenuFilter[] = ["all", "quick", "highProtein", "lowCal"];

export function FilterChips({
  value,
  onChange,
}: {
  value: MenuFilter;
  onChange: (filter: MenuFilter) => void;
}) {
  return (
    <div className="chips" role="tablist" aria-label="筛选">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={value === filter ? "chip on" : "chip"}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABEL[filter]}
        </button>
      ))}
    </div>
  );
}
