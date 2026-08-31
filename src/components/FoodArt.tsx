import type { FoodArtKind } from "../types";

export const ART_TONE: Record<FoodArtKind, { bg: string; ink: string }> = {
  oats: { bg: "#F3E6C8", ink: "#8A6230" },
  toast: { bg: "#F0DDB8", ink: "#8B5A2B" },
  yogurt: { bg: "#F0E6D4", ink: "#8A6A4A" },
  congee: { bg: "#EFE4C8", ink: "#7A5C32" },
  soy: { bg: "#EEE4C8", ink: "#8D6A32" },
  corn: { bg: "#F4E6A8", ink: "#8A7020" },
  potato: { bg: "#EED4B4", ink: "#8B5A32" },
  chicken: { bg: "#F0D8C8", ink: "#8A5340" },
  beef: { bg: "#EBD4C8", ink: "#8A4A3A" },
  pork: { bg: "#F0D8D0", ink: "#8A5048" },
  shrimp: { bg: "#F2D8CC", ink: "#A05840" },
  noodle: { bg: "#EFE0B8", ink: "#8A6230" },
  soup: { bg: "#DCE6D4", ink: "#3B7A57" },
  tofu: { bg: "#EBE6D8", ink: "#7A6A4C" },
  egg: { bg: "#F4E6B4", ink: "#A07828" },
  veg: { bg: "#DCE8D6", ink: "#3B7A57" },
  salad: { bg: "#D8EAD8", ink: "#3B7A57" },
  fruit: { bg: "#F0DCD0", ink: "#A05848" },
  nut: { bg: "#E8D4B0", ink: "#8A5A28" },
};

function Plate() {
  return (
    <>
      <ellipse cx="32" cy="40" rx="22" ry="14" fill="#fff" opacity="0.92" />
      <ellipse cx="32" cy="39" rx="16" ry="10" fill="currentColor" opacity="0.08" />
    </>
  );
}

export function FoodArt({
  kind,
  size = 88,
}: {
  kind: FoodArtKind;
  size?: number;
}) {
  const tone = ART_TONE[kind];
  return (
    <div
      className="food-art"
      style={{ width: size, height: size, background: tone.bg, color: tone.ink }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size * 0.78} height={size * 0.78}>
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
          <Plate />
          <ellipse cx="32" cy="36" rx="13" ry="8" fill="currentColor" opacity="0.28" />
          <circle cx="26" cy="34" r="2.2" fill="currentColor" opacity="0.55" />
          <circle cx="33" cy="32" r="2" fill="currentColor" opacity="0.45" />
          <circle cx="38" cy="36" r="2.2" fill="currentColor" opacity="0.55" />
          <path d="M42 28c4-6 8-6 8-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "toast":
      return (
        <>
          <Plate />
          <rect x="20" y="22" width="18" height="16" rx="3" fill="currentColor" opacity="0.4" />
          <ellipse cx="40" cy="34" rx="8" ry="6" fill="currentColor" opacity="0.55" />
        </>
      );
    case "yogurt":
      return (
        <>
          <rect x="20" y="24" width="24" height="22" rx="6" fill="#fff" opacity="0.95" />
          <ellipse cx="32" cy="24" rx="12" ry="5" fill="currentColor" opacity="0.35" />
          <circle cx="28" cy="34" r="2" fill="currentColor" opacity="0.45" />
          <circle cx="35" cy="37" r="2.2" fill="currentColor" opacity="0.4" />
        </>
      );
    case "congee":
    case "soup":
      return (
        <>
          <path d="M12 32h40c-1 13-9 20-20 20S13 45 12 32z" fill="#fff" opacity="0.95" />
          <ellipse cx="32" cy="32" rx="18" ry="6" fill="currentColor" opacity="0.2" />
          <path d="M20 26c3-6 8-8 12-4M36 24c3-5 8-6 10-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        </>
      );
    case "soy":
      return (
        <>
          <path d="M26 14h12l3 8v26a7 7 0 0 1-7 7H30a7 7 0 0 1-7-7V22z" fill="#fff" opacity="0.95" />
          <rect x="26" y="28" width="12" height="14" rx="2" fill="currentColor" opacity="0.2" />
        </>
      );
    case "corn":
      return (
        <>
          <Plate />
          <ellipse cx="32" cy="34" rx="8" ry="16" fill="currentColor" opacity="0.45" />
          <path d="M24 24c4 2 4 8 0 12M40 24c-4 2-4 8 0 12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        </>
      );
    case "potato":
      return (
        <>
          <Plate />
          <ellipse cx="28" cy="36" rx="11" ry="8" fill="currentColor" opacity="0.4" />
          <ellipse cx="40" cy="34" rx="7" ry="6" fill="currentColor" opacity="0.28" />
        </>
      );
    case "chicken":
    case "beef":
    case "pork":
      return (
        <>
          <Plate />
          <path d="M18 36c3-10 22-14 28-4 2 6-4 14-14 14-9 0-16-4-14-10z" fill="currentColor" opacity="0.42" />
          <path d="M22 40c6 2 16 2 22-2" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
        </>
      );
    case "shrimp":
      return (
        <>
          <Plate />
          <path d="M16 38c2-12 16-18 26-12 4 2 5 7 2 10-7 7-18 8-28 2z" fill="currentColor" opacity="0.45" />
          <circle cx="40" cy="28" r="1.6" fill="#fff" />
        </>
      );
    case "noodle":
      return (
        <>
          <path d="M12 34h40c-1 12-9 18-20 18S13 46 12 34z" fill="#fff" opacity="0.95" />
          <path
            d="M18 30c8 5 20-5 28 3M16 35c10 5 22-3 30 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.45"
          />
        </>
      );
    case "tofu":
      return (
        <>
          <Plate />
          <rect x="20" y="26" width="14" height="12" rx="2" fill="#fff" />
          <rect x="32" y="30" width="12" height="10" rx="2" fill="currentColor" opacity="0.28" />
        </>
      );
    case "egg":
      return (
        <>
          <Plate />
          <ellipse cx="32" cy="34" rx="12" ry="10" fill="#fff" />
          <circle cx="32" cy="34" r="5" fill="currentColor" opacity="0.45" />
        </>
      );
    case "veg":
    case "salad":
      return (
        <>
          <Plate />
          <path d="M32 44c-8-4-12-12-6-20 6 3 8 8 6 20zm0 0c8-4 12-12 6-20-6 3-8 8-6 20z" fill="currentColor" opacity="0.42" />
          <path d="M32 44V26" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        </>
      );
    case "fruit":
      return (
        <>
          <Plate />
          <circle cx="32" cy="34" r="11" fill="currentColor" opacity="0.42" />
          <path d="M32 24c3-6 8-6 8-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "nut":
      return (
        <>
          <Plate />
          <ellipse cx="27" cy="35" rx="6" ry="8" fill="currentColor" opacity="0.4" />
          <ellipse cx="38" cy="36" rx="5" ry="7" fill="currentColor" opacity="0.3" />
        </>
      );
    default:
      return <Plate />;
  }
}
