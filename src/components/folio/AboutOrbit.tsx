const ARIES = [
  { x: 29, y: 36, r: 1.15 },
  { x: 38, y: 30, r: 1.45 },
  { x: 54, y: 47, r: 2.15 },
  { x: 69, y: 55, r: 1.2 },
  { x: 78, y: 64, r: 0.95 },
] as const;

const FIELD = [
  [18, 22, 0.7],
  [72, 16, 0.85],
  [84, 48, 0.6],
  [78, 78, 0.75],
  [40, 86, 0.65],
  [14, 64, 0.7],
  [50, 10, 0.8],
  [8, 40, 0.55],
  [24, 52, 0.45],
  [33, 58, 0.4],
  [46, 28, 0.5],
  [62, 34, 0.42],
  [48, 66, 0.38],
  [72, 42, 0.4],
  [12, 78, 0.5],
  [90, 32, 0.55],
  [88, 68, 0.48],
  [22, 12, 0.6],
  [60, 88, 0.52],
  [36, 8, 0.44],
] as const;

export function AboutOrbit() {
  return (
    <div className="about-orbit relative mx-auto aspect-square w-full max-w-[28rem]" aria-hidden>
      <style href="about-orbit">{`
        @keyframes about-orbit-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes about-orbit-spin-rev {
          to { transform: rotate(-360deg); }
        }
        @keyframes about-aries-draw {
          0% { stroke-dashoffset: 160; opacity: 0.2; }
          28% { stroke-dashoffset: 0; opacity: 0.85; }
          72% { stroke-dashoffset: 0; opacity: 0.85; }
          100% { stroke-dashoffset: -160; opacity: 0.2; }
        }
        @keyframes about-aries-star {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @keyframes about-field-star {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.85; }
        }
        .about-orbit-ring {
          transform-origin: 50% 50%;
          animation: about-orbit-spin 48s linear infinite;
        }
        .about-orbit-ring-rev {
          transform-origin: 50% 50%;
          animation: about-orbit-spin-rev 36s linear infinite;
        }
        .about-aries-draw {
          stroke-dasharray: 160;
          animation: about-aries-draw 9s ease-in-out infinite;
        }
        .about-aries-star {
          animation: about-aries-star 3.6s ease-in-out infinite;
        }
        .about-field-star {
          animation: about-field-star 4.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-orbit-ring,
          .about-orbit-ring-rev,
          .about-aries-draw,
          .about-aries-star,
          .about-field-star {
            animation: none;
          }
        }
      `}</style>

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-[#e8c56b]">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="0.4"
        />
        <g className="about-orbit-ring">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="0.35"
            strokeDasharray="1.4 2.8"
          />
        </g>
        <g className="about-orbit-ring-rev">
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="0.35"
          />
        </g>

        <path
          className="about-aries-draw"
          d="M29 36 L38 30 L54 47 L69 55 L78 64"
          fill="none"
          stroke="#f4ead4"
          strokeOpacity="0.8"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {FIELD.map(([x, y, r], i) => (
          <circle
            key={`${x}-${y}`}
            className="about-field-star"
            cx={x}
            cy={y}
            r={r}
            fill={i % 3 === 0 ? "#e8c56b" : "#f4ead4"}
            style={{ animationDelay: `${(i % 8) * 0.4}s` }}
          />
        ))}

        {ARIES.map((star, i) => (
          <g key={`${star.x}-${star.y}`}>
            <circle cx={star.x} cy={star.y} r={star.r + 2.4} fill="#e8c56b" opacity="0.12" />
            <circle
              className="about-aries-star"
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#e8c56b"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
