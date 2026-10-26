"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteMedia } from "@/components/folio/SiteMedia";
import { useWhimsyAudio } from "@/lib/useWhimsyAudio";

export type CarouselWork = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  category: { name: string };
};

const INTERVAL = 5200;

function toSentenceCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function MustReadsCarousel({
  works,
  moreLabel,
}: {
  works: CarouselWork[];
  moreLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [clock, setClock] = useState(0);
  const touchX = useRef<number | null>(null);
  const { play } = useWhimsyAudio();
  const reduce = useReducedMotion();
  const active = works[index];

  useEffect(() => {
    if (works.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % works.length);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [works.length, clock]);

  if (works.length === 0 || !active) return null;

  const goTo = (next: number, fromUser = false) => {
    const wrapped = (next + works.length) % works.length;
    if (wrapped === index) {
      if (fromUser) void play(wrapped);
      return;
    }
    const delta = (wrapped - index + works.length) % works.length;
    setDirection(delta <= works.length / 2 ? 1 : -1);
    setIndex(wrapped);
    if (fromUser) {
      setClock((value) => value + 1);
      void play(wrapped);
    }
  };

  return (
    <div className="relative w-full">
      <style href="must-read-float">{`
        @keyframes must-read-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          30% { transform: translate3d(0, -10px, 0); }
          60% { transform: translate3d(0, 6px, 0); }
        }
        @keyframes must-read-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .must-read-float {
          animation: must-read-float 8s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .must-read-float { animation: none; }
        }
      `}</style>

      <div
        className="must-read-float relative"
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchX.current;
          const end = event.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start == null || end == null) return;
          const delta = end - start;
          if (delta > 40) goTo(index - 1, true);
          if (delta < -40) goTo(index + 1, true);
        }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e8c56b]/25 bg-black/40 px-5 py-6 sm:px-10 sm:py-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={active.id}
              custom={direction}
              initial={reduce ? false : { opacity: 0, y: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/works/${active.slug}`} className="grid gap-6 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-center md:gap-10">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden bg-[#111] md:mx-0 md:max-w-none">
                  <SiteMedia
                    src={active.coverImageUrl || "/covers/cover-1.svg"}
                    alt=""
                    fill
                    objectFit="contain"
                    sizes="(min-width: 768px) 28vw, 70vw"
                    priority={index === 0}
                  />
                </div>
                <div className="min-w-0 text-center md:text-left">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-[#8a7340] uppercase">
                    {active.category.name}
                  </p>
                  <h3 className="folio-list mt-3 break-words font-medium normal-case text-[#e8c56b]">
                    {toSentenceCase(active.title)}
                  </h3>
                  <p className="folio-body-gold mt-4">{active.excerpt}</p>
                  <span className="mt-5 inline-block text-[16px] font-bold text-[#e8c56b]">
                    {moreLabel}
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {works.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous must read"
              className="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8c56b]/40 bg-black/70 text-[22px] text-[#e8c56b] md:left-3"
              onClick={() => {
                setDirection(-1);
                setIndex((current) => (current - 1 + works.length) % works.length);
                setClock((value) => value + 1);
                void play(index === 0 ? works.length - 1 : index - 1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next must read"
              className="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8c56b]/40 bg-black/70 text-[22px] text-[#e8c56b] md:right-3"
              onClick={() => {
                setDirection(1);
                setIndex((current) => (current + 1) % works.length);
                setClock((value) => value + 1);
                void play((index + 1) % works.length);
              }}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {works.length > 1 ? (
        <div className="mt-5 flex justify-center gap-2">
          {works.map((work, i) => {
            const selected = i === index;
            return (
              <button
                key={work.id}
                type="button"
                aria-label={`Show ${work.title}`}
                className="h-1.5 w-10 overflow-hidden bg-[#8a7340]/35"
                onClick={() => goTo(i, true)}
              >
                {selected ? (
                  <span
                    className="block h-full origin-left bg-[#e8c56b]"
                    style={{
                      animation: reduce ? "none" : `must-read-progress ${INTERVAL}ms linear`,
                      transform: reduce ? "scaleX(1)" : undefined,
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
