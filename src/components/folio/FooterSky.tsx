const FIELD = [
  [10, 16, 0.65],
  [20, 8, 0.45],
  [6, 38, 0.5],
  [14, 72, 0.6],
  [26, 90, 0.4],
  [80, 10, 0.55],
  [90, 24, 0.45],
  [94, 48, 0.65],
  [86, 82, 0.5],
  [72, 94, 0.38],
  [8, 86, 0.42],
  [40, 6, 0.4],
  [60, 5, 0.48],
  [96, 68, 0.4],
] as const;

export function FooterSky() {
  return (
    <div className="footer-sky relative aspect-square w-[min(18rem,68vw)] md:w-[min(22rem,34vw)] lg:w-[min(26rem,32vw)]" aria-hidden>
      <style href="footer-sky">{`
        @keyframes footer-sky-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes footer-sky-spin-rev {
          to { transform: rotate(-360deg); }
        }
        @keyframes footer-sky-drop {
          0%, 100% { transform: translateY(-6px); opacity: 0.2; }
          35% { transform: translateY(10px); opacity: 1; }
          55% { transform: translateY(12px); opacity: 0.85; }
          80% { transform: translateY(-2px); opacity: 0.35; }
        }
        @keyframes footer-sky-ripple {
          0%, 100% { transform: scale(0.7); opacity: 0.15; }
          45% { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes footer-sky-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        @keyframes footer-sky-dip {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(3deg); }
        }
        .footer-sky-spin {
          transform-origin: 50px 50px;
          animation: footer-sky-spin 42s linear infinite;
        }
        .footer-sky-spin-rev {
          transform-origin: 50px 50px;
          animation: footer-sky-spin-rev 28s linear infinite;
        }
        .footer-sky-drop {
          animation: footer-sky-drop 4.8s ease-in-out infinite;
        }
        .footer-sky-ripple {
          transform-origin: 50px 62px;
          animation: footer-sky-ripple 4.8s ease-in-out infinite;
        }
        .footer-sky-twinkle {
          animation: footer-sky-twinkle 4.4s ease-in-out infinite;
        }
        .footer-sky-dip {
          transform-origin: 50px 76px;
          animation: footer-sky-dip 5.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-sky-spin,
          .footer-sky-spin-rev,
          .footer-sky-drop,
          .footer-sky-ripple,
          .footer-sky-twinkle,
          .footer-sky-dip {
            animation: none;
          }
        }
      `}</style>

      <svg viewBox="0 0 100 100" className="h-full w-full text-[#e8c56b]">
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="0.4"
        />
        <g className="footer-sky-spin">
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="0.45"
            strokeDasharray="1.3 2.1"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="10.5" r="1.4" fill="#e8c56b" />
        </g>
        <g className="footer-sky-spin-rev">
          <rect
            x="30"
            y="30"
            width="40"
            height="40"
            fill="none"
            stroke="#f4ead4"
            strokeOpacity="0.22"
            strokeWidth="0.35"
            transform="rotate(45 50 50)"
          />
        </g>

        {FIELD.map(([x, y, r], i) => (
          <circle
            key={`${x}-${y}`}
            className="footer-sky-twinkle"
            cx={x}
            cy={y}
            r={r}
            fill={i % 3 === 0 ? "#e8c56b" : "#f4ead4"}
            style={{ animationDelay: `${(i % 7) * 0.35}s` }}
          />
        ))}

        <circle
          className="footer-sky-ripple"
          cx="50"
          cy="62"
          r="6"
          fill="none"
          stroke="#e8c56b"
          strokeOpacity="0.35"
          strokeWidth="0.4"
        />

        <g fill="none" stroke="#f4ead4" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round">
          <path d="M37 50 H63 L67 58 H33 Z" strokeOpacity="0.88" />
          <path d="M35 58 H65 V72 C65 80 35 80 35 72 Z" strokeOpacity="0.88" />
          <path d="M43 44 H57 V50" strokeOpacity="0.65" />
        </g>
        <circle className="footer-sky-drop" cx="50" cy="40" r="1.7" fill="#e8c56b" />

        <g transform="rotate(-36 48 72)">
          <g className="footer-sky-dip" fill="none" stroke="#f4ead4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M45.6 16.5 Q50 12.4 54.4 16.5 V31.2 H45.6 Z" strokeWidth="1.15" />
            <path d="M54.4 18.2 H58.6 Q59.8 22.4 58.5 28.4 H54.4" strokeWidth="0.95" />
            <path d="M45 31.2 H55 M45 34 H55" strokeWidth="0.85" stroke="#e8c56b" />
            <path d="M46.6 34 H53.4 V56.8 Q50 58.6 46.6 56.8 Z" strokeWidth="1.15" />
            <path d="M47.8 56.8 H52.2 L51.2 64.6 H48.8 Z" strokeWidth="1" />
            <path d="M48.7 64.6 H51.3 L50 76.4 Z" stroke="#e8c56b" strokeWidth="1.05" />
            <path d="M50 66.6 V74.2" stroke="#e8c56b" strokeWidth="0.55" />
            <circle cx="50" cy="68.6" r="0.7" fill="none" stroke="#e8c56b" strokeWidth="0.55" />
          </g>
        </g>
      </svg>
    </div>
  );
}
