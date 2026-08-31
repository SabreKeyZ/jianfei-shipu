import type { FoodArtKind } from "../types";

const TONE: Record<FoodArtKind, { bg: string; ink: string }> = {
  oats: { bg: "#f3e0b8", ink: "#8a5a28" },
  toast: { bg: "#f0d4a8", ink: "#8b5a2b" },
  yogurt: { bg: "#f4e6d4", ink: "#b56a4a" },
  congee: { bg: "#efe4c8", ink: "#7a5c32" },
  soy: { bg: "#eee3c6", ink: "#8d6a32" },
  corn: { bg: "#f6e3a2", ink: "#9a7420" },
  potato: { bg: "#edc9a3", ink: "#8b4e2a" },
  chicken: { bg: "#f0d2c2", ink: "#b4583a" },
  beef: { bg: "#ebcfc4", ink: "#a34732" },
  pork: { bg: "#f0d4cc", ink: "#a05548" },
  shrimp: { bg: "#f3d2c6", ink: "#c45b3a" },
  noodle: { bg: "#efe0b8", ink: "#8a6230" },
  soup: { bg: "#dce6d4", ink: "#4f6b48" },
  tofu: { bg: "#ece6d6", ink: "#7a6a4c" },
  egg: { bg: "#f6e7b8", ink: "#c4842a" },
  veg: { bg: "#dce8d6", ink: "#4e7a46" },
  salad: { bg: "#d7ead8", ink: "#3f7a4a" },
  fruit: { bg: "#f3d6c8", ink: "#c45b45" },
  nut: { bg: "#ead3b0", ink: "#8a5a28" },
};

export function FoodArt({
  kind,
  size = 56,
}: {
  kind: FoodArtKind;
  size?: number;
}) {
  const tone = TONE[kind];
  return (
    <div
      className="food-art"
      style={{ width: size, height: size, background: tone.bg, color: tone.ink }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size * 0.72} height={size * 0.72}>
        {iconPath(kind)}
      </svg>
    </div>
  );
}

function iconPath(kind: FoodArtKind) {
  switch (kind) {
    case "oats":
      return (
        <>
          <ellipse cx="32" cy="42" rx="20" ry="10" fill="currentColor" opacity="0.18" />
          <path
            d="M14 38c0-12 8-22 18-22s18 10 18 22v2H14z"
            fill="currentColor"
            opacity="0.35"
          />
          <circle cx="24" cy="30" r="3" fill="currentColor" />
          <circle cx="33" cy="26" r="2.5" fill="currentColor" />
          <circle cx="40" cy="32" r="3" fill="currentColor" />
        </>
      );
    case "toast":
      return (
        <path
          d="M16 22c0-6 8-10 16-10s16 4 16 10v22a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"
          fill="currentColor"
          opacity="0.55"
        />
      );
    case "yogurt":
      return (
        <>
          <rect x="18" y="22" width="28" height="24" rx="6" fill="currentColor" opacity="0.35" />
          <ellipse cx="32" cy="22" rx="14" ry="6" fill="currentColor" opacity="0.55" />
        </>
      );
    case "congee":
    case "soup":
      return (
        <>
          <path
            d="M10 30h44c-1 12-10 20-22 20S11 42 10 30z"
            fill="currentColor"
            opacity="0.4"
          />
          <path d="M16 26c4-8 28-8 32 0" fill="none" stroke="currentColor" strokeWidth="3" />
        </>
      );
    case "soy":
      return (
        <path
          d="M24 12h16l4 10v26a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8V22z"
          fill="currentColor"
          opacity="0.45"
        />
      );
    case "corn":
      return (
        <ellipse cx="32" cy="34" rx="10" ry="20" fill="currentColor" opacity="0.5" />
      );
    case "potato":
      return (
        <ellipse cx="32" cy="34" rx="18" ry="14" fill="currentColor" opacity="0.5" />
      );
    case "chicken":
    case "beef":
    case "pork":
      return (
        <path
          d="M14 36c4-14 32-18 38-4 3 8-6 20-18 20-10 0-22-6-20-16z"
          fill="currentColor"
          opacity="0.45"
        />
      );
    case "shrimp":
      return (
        <path
          d="M14 40c2-16 20-24 32-16 4 3 6 8 2 12-8 8-22 10-34 4z"
          fill="currentColor"
          opacity="0.5"
        />
      );
    case "noodle":
      return (
        <>
          <ellipse cx="32" cy="40" rx="20" ry="10" fill="currentColor" opacity="0.25" />
          <path
            d="M16 28c8 6 24-6 32 4M14 34c10 6 24-4 34 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      );
    case "tofu":
      return (
        <rect x="16" y="20" width="32" height="26" rx="4" fill="currentColor" opacity="0.4" />
      );
    case "egg":
      return (
        <ellipse cx="32" cy="34" rx="13" ry="16" fill="currentColor" opacity="0.5" />
      );
    case "veg":
    case "salad":
      return (
        <path
          d="M32 48c-10-6-16-18-8-28 8 4 10 10 8 28zm0 0c10-6 16-18 8-28-8 4-10 10-8 28z"
          fill="currentColor"
          opacity="0.5"
        />
      );
    case "fruit":
      return (
        <>
          <circle cx="32" cy="36" r="14" fill="currentColor" opacity="0.5" />
          <path d="M32 22c4-8 10-8 10-8" fill="none" stroke="currentColor" strokeWidth="3" />
        </>
      );
    case "nut":
      return (
        <ellipse cx="32" cy="34" rx="12" ry="16" fill="currentColor" opacity="0.5" />
      );
    default:
      return <circle cx="32" cy="32" r="14" fill="currentColor" opacity="0.4" />;
  }
}
