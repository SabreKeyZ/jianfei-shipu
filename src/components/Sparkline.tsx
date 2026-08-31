export function Sparkline({ values }: { values: number[] }) {
  const points = values.filter((n) => Number.isFinite(n) && n > 0);
  if (points.length < 2) {
    return <p className="spark-empty">记下体重后，这里会出现近 7 天的小走势</p>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(max - min, 0.4);
  const w = 160;
  const h = 36;
  const d = points
    .map((n, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((n - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width="100%" height="36" aria-hidden>
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
