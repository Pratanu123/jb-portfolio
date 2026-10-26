type Props = {
  className?: string;
  color?: string;
  size?: "default" | "compact";
};

function Corner({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        className="line-draw"
        pathLength={1}
        d="M8 72 V22 C8 10 16 6 28 6 H72"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        className="line-draw line-draw-delay"
        pathLength={1}
        d="M18 62 C18 38 38 22 58 22 M28 48 C36 36 50 30 64 28"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="18" cy="18" r="2.2" fill={color} opacity="0.85" />
    </svg>
  );
}

export function FiligreeCorners({
  className = "",
  color = "currentColor",
  size = "default",
}: Props) {
  const dim = size === "compact" ? "h-8 w-8" : "h-16 w-16 md:h-20 md:w-20";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <Corner className={`absolute top-0 left-0 ${dim}`} color={color} />
      <Corner className={`absolute top-0 right-0 ${dim} rotate-90`} color={color} />
      <Corner className={`absolute bottom-0 left-0 ${dim} -rotate-90`} color={color} />
      <Corner className={`absolute right-0 bottom-0 ${dim} rotate-180`} color={color} />
    </div>
  );
}
