export function HeartButton({
  on,
  onToggle,
  className,
}: {
  on: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`heart-btn${on ? " on" : ""}${className ? ` ${className}` : ""}`}
      aria-label={on ? "取消收藏" : "收藏"}
      aria-pressed={on}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path
          d="M12 20s-7-4.4-9.2-8.2C1.2 9.2 2.4 6 5.6 6c1.8 0 3 1.2 3.6 2.2C9.8 7.2 11 6 12.8 6c3.2 0 4.4 3.2 2.8 5.8C13.4 15.6 12 20 12 20z"
          fill={on ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
