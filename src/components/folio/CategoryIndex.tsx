"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CategoryMark } from "@/components/folio/CategoryMark";
import { useWhimsyAudio } from "@/lib/useWhimsyAudio";

type Category = {
  id: string;
  slug: string;
  name: string;
  mark?: string;
  markImageUrl?: string;
};

function toSentenceCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const next = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  return next.replace(/\bseo\b/gi, "SEO").replace(/\blinkedin\b/gi, "LinkedIn");
}

function ringPoints(count: number, radius: number) {
  const safe = Math.max(count, 1);
  return Array.from({ length: safe }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / safe;
    return {
      x: Number((50 + radius * Math.cos(angle)).toFixed(3)),
      y: Number((50 + radius * Math.sin(angle)).toFixed(3)),
    };
  });
}

function closedRingPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  const line = points.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  return `${line} Z`;
}

function CategoryAstrolabe({
  slug,
  mark,
  imageUrl,
  index,
  count,
}: {
  slug: string;
  mark?: string;
  imageUrl?: string;
  index: number;
  count: number;
}) {
  const stars = ringPoints(count, 38);
  const ticks = ringPoints(count, 47);
  const tickEnds = ringPoints(count, 44.4);
  const path = closedRingPath(stars);

  return (
    <div className="relative aspect-square w-full text-[#e8c56b]">
      <style href="astrolabe-move">{`
        @keyframes astrolabe-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes astrolabe-march {
          to { stroke-dashoffset: -28.5; }
        }
        .astrolabe-spin {
          transform-origin: 50px 50px;
          animation: astrolabe-spin 48s linear infinite;
        }
        .astrolabe-march {
          animation: astrolabe-march 12s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .astrolabe-spin,
          .astrolabe-march { animation: none; }
        }
      `}</style>
      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_50%_42%,#2a2210_0%,#0a0804_68%,#000_100%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="0.55"
        />
        <circle
          cx="50"
          cy="50"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.34"
          strokeWidth="0.4"
        />
        {ticks.map((tick, i) => (
          <line
            key={`tick-${tick.x}-${tick.y}`}
            x1={tick.x}
            y1={tick.y}
            x2={tickEnds[i]?.x}
            y2={tickEnds[i]?.y}
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="0.45"
          />
        ))}
        <g className="astrolabe-spin">
          {path ? (
            <path
              key={count}
              className="astrolabe-march"
              d={path}
              fill="none"
              stroke="#e8c56b"
              strokeOpacity="0.75"
              strokeWidth="0.55"
              strokeDasharray="1.15 1.7"
              strokeLinecap="round"
            />
          ) : null}
          {stars.map((star, i) => {
            const selected = i === index;
            return (
              <circle
                key={`star-${star.x}-${star.y}`}
                cx={star.x}
                cy={star.y}
                r={selected ? 1.7 : 0.85}
                fill={selected ? "#e8c56b" : "#f4ead4"}
                opacity={selected ? 1 : 0.45}
              />
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-[16%] text-[#f4ead4]" key={`${mark}-${imageUrl}-${slug}`}>
        <CategoryMark mark={mark} slug={slug} imageUrl={imageUrl} />
      </div>
    </div>
  );
}

function useTouchViewport() {
  const [touchView, setTouchView] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px), (hover: none)");
    const sync = () => setTouchView(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return touchView;
}

export function CategoryIndex({ categories }: { categories: Category[] }) {
  const { play } = useWhimsyAudio();
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const touchView = useTouchViewport();
  const active = categories[index];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!touchView || !inView || categories.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % categories.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [touchView, inView, categories.length]);

  if (categories.length === 0 || !active) return null;

  const activate = (i: number) => {
    setIndex(i);
    void play(i);
  };

  return (
    <div
      ref={rootRef}
      className="mt-8 grid items-start gap-8 md:mt-10 md:grid-cols-[minmax(18rem,max-content)_minmax(0,1fr)] md:gap-10"
    >
      <ul className="flex min-w-0 flex-col gap-1">
        {categories.map((category, i) => {
          const selected = i === index;
          return (
            <li
              key={category.id}
              onMouseEnter={() => activate(i)}
              onTouchStart={() => activate(i)}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group flex min-h-11 items-start gap-3 sm:gap-4"
                onFocus={() => activate(i)}
              >
                <span
                  className={`w-8 shrink-0 pt-1 text-[15px] sm:w-10 sm:text-[16px] ${selected ? "text-[#e8c56b]" : "text-[#8a7340]"}`}
                >
                  {selected ? "→" : String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`folio-list min-w-0 break-words normal-case transition-colors group-hover:text-[#e8c56b] ${
                    selected ? "font-medium text-[#e8c56b]" : "font-normal text-[#8a7340]"
                  }`}
                >
                  {toSentenceCase(category.name)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <aside className="relative order-first !block md:order-none">
        <div className="mx-auto w-[min(22rem,84vw)] md:sticky md:top-24 md:w-full md:max-w-[34rem]">
          <Link href={`/categories/${active.slug}`} aria-label={active.name} className="block">
            <CategoryAstrolabe
              slug={active.slug}
              mark={active.mark}
              imageUrl={active.markImageUrl}
              index={index}
              count={categories.length}
            />
          </Link>
        </div>
      </aside>
    </div>
  );
}
