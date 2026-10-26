"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { AboutOrbit } from "@/components/folio/AboutOrbit";

type Props = {
  title: string;
  text: string;
  moreHref?: string;
  moreLabel?: string;
  children?: React.ReactNode;
};

function normalize(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function splitLine(text: string) {
  return text.split(/(\s+)/);
}

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function AboutPlay({ title, text, moreHref, moreLabel, children }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const focus = hover ?? picked;

  return (
    <div className="folio-x folio-section">
      <style href="about-float">{`
        @keyframes about-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(6px, -12px, 0); }
          50% { transform: translate3d(-4px, -5px, 0); }
          75% { transform: translate3d(5px, 9px, 0); }
        }
        .about-float {
          animation: about-float 11s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-float {
            animation: none;
          }
        }
      `}</style>
      <div className="mx-auto w-full max-w-7xl">
      <h2 className="font-display folio-display text-[#f4ead4]">{title}</h2>
      <div className="mt-8 grid items-start gap-8 overflow-hidden md:mt-10 md:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)] md:gap-12">
        <aside className="relative order-first pointer-events-none !block">
          <div className="mx-auto w-[min(18rem,72vw)] md:w-full md:max-w-[24rem]">
            <AboutOrbit />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="about-float max-w-3xl space-y-5">
            {text.split(/\n\n+/).map((paragraph, paragraphIndex) => (
              <motion.p
                key={`about-p-${paragraphIndex}`}
                className="folio-body"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: reduce ? 0 : 0.016, delayChildren: 0.08 },
                  },
                }}
              >
                {splitLine(paragraph).map((chunk, index) => {
                  const key = normalize(chunk);
                  if (!key || /^\s+$/.test(chunk)) {
                    return (
                      <motion.span key={`${chunk}-${paragraphIndex}-${index}`} variants={wordVariants}>
                        {chunk}
                      </motion.span>
                    );
                  }
                  const lit = Boolean(focus && focus === key);
                  return (
                    <motion.span key={`${key}-${paragraphIndex}-${index}`} variants={wordVariants} className="inline-block">
                      <motion.button
                        type="button"
                        className="inline-block origin-center"
                        animate={{
                          color: lit ? "#f4ead4" : "#cfc3a8",
                          y: lit ? -6 : 0,
                          scale: lit ? 1.08 : 1,
                          textShadow: lit
                            ? "0 0 18px rgba(244, 234, 212, 0.35)"
                            : "0 0 0px rgba(0,0,0,0)",
                        }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => setHover(key)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setPicked((current) => (current === key ? null : key))}
                      >
                        {chunk}
                      </motion.button>
                    </motion.span>
                  );
                })}
              </motion.p>
            ))}
          </div>
          {moreHref && moreLabel ? (
            <Link href={moreHref} className="mt-5 block w-fit text-[17px] font-bold leading-[1.6] text-[#cfc3a8]">
              {moreLabel}
            </Link>
          ) : null}
          {children}
        </div>
      </div>
      </div>
    </div>
  );
}
