type Props = {
  className?: string;
  tone?: "gold" | "teal" | "cream";
};

const tones = {
  gold: "#d4a017",
  teal: "#1abc9c",
  cream: "#f7f0e4",
};

export function VineDivider({ className = "", tone = "gold" }: Props) {
  const color = tones[tone];
  return (
    <svg
      viewBox="0 0 320 28"
      className={`mx-auto h-7 w-full max-w-md ${className}`}
      fill="none"
      aria-hidden
    >
      <path
        className="line-draw"
        pathLength={1}
        d="M8 14 H118 C128 14 132 8 142 8 C152 8 156 14 160 14 C164 14 168 20 178 20 C188 20 192 14 202 14 H312"
        stroke={color}
        strokeWidth="1.1"
      />
      <path
        className="line-draw line-draw-delay"
        pathLength={1}
        d="M148 8 C144 2 152 0 156 6 M172 20 C176 26 168 28 164 22"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="160" cy="14" r="2.4" fill={color} />
    </svg>
  );
}
