import type { ReactNode } from "react";

export function RingProgress({
  value,
  max,
  size = 168,
  stroke = 7,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children: ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const length = 2 * Math.PI * radius;
  const ratio = Math.min(Math.max(value / max, 0), 1);
  const filled = length * ratio;

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--track)"
          strokeWidth={stroke}
        />
        <circle
          className="ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${length}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}
