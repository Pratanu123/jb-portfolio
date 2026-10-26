type Props = {
  letters: string;
  className?: string;
};

export function MonogramFrame({ letters, className = "" }: Props) {
  return (
    <div className={`relative mx-auto grid h-40 w-40 place-items-center md:h-52 md:w-52 ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0" fill="none" aria-hidden>
        <ellipse
          className="line-draw"
          pathLength={1}
          cx="100"
          cy="100"
          rx="78"
          ry="86"
          stroke="#d4a017"
          strokeWidth="1.2"
        />
        <ellipse
          className="line-draw line-draw-delay"
          pathLength={1}
          cx="100"
          cy="100"
          rx="68"
          ry="76"
          stroke="#9b1b30"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          className="line-draw"
          pathLength={1}
          d="M100 8 C92 22 92 28 100 36 C108 28 108 22 100 8 Z M100 192 C92 178 92 172 100 164 C108 172 108 178 100 192 Z"
          stroke="#1abc9c"
          strokeWidth="1"
        />
      </svg>
      <span className="font-display text-5xl tracking-[0.12em] text-gold-soft md:text-6xl">
        {letters}
      </span>
    </div>
  );
}
