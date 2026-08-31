import type { Macros } from "../types";

export function MacroRow({
  macros,
  compact = false,
}: {
  macros: Macros;
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "macros compact" : "macros"}>
      <li className="m-kcal">
        <b>{macros.kcal}</b>
        <span>千卡</span>
      </li>
      <li className="m-pro">
        <b>{macros.protein}g</b>
        <span>蛋白质</span>
      </li>
      <li className="m-carb">
        <b>{macros.carbs}g</b>
        <span>碳水</span>
      </li>
      <li className="m-fat">
        <b>{macros.fat}g</b>
        <span>脂肪</span>
      </li>
    </ul>
  );
}
