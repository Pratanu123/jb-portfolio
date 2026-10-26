"use client";

import { motion } from "framer-motion";

type Kind = "breeze" | "folio" | "catalog" | "portrait";

const CAPTIONS: Record<Kind, string> = {
  breeze: "The pages catch a draft",
  folio: "Keep turning",
  catalog: "Fifteen doors, one house",
  portrait: "Then the quiet panel",
};

export function SectionBreak({ kind }: { kind: Kind }) {
  return (
    <motion.div
      className="relative overflow-hidden py-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-4 text-[0.68rem] tracking-[0.22em] text-[#6b6b6b] uppercase">
        {CAPTIONS[kind]}
      </p>
      {kind === "breeze" ? <BreezeArt /> : null}
      {kind === "folio" ? <FolioArt /> : null}
      {kind === "catalog" ? <CatalogArt /> : null}
      {kind === "portrait" ? <PortraitArt /> : null}
    </motion.div>
  );
}

function BreezeArt() {
  return (
    <svg viewBox="0 0 1200 220" className="h-auto w-full" aria-hidden>
      <ellipse cx="180" cy="110" rx="160" ry="70" fill="#d9c7ff" opacity="0.45" />
      <ellipse cx="980" cy="100" rx="150" ry="64" fill="#e8d5a3" opacity="0.4" />
      <motion.path
        d="M20 120 C 180 40, 320 190, 500 90 S 820 30, 1020 130 1180 80, 1190 100"
        fill="none"
        stroke="#111"
        strokeWidth="1.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />
      <motion.path
        d="M40 150 C 240 80, 420 200, 640 120 S 980 70, 1160 150"
        fill="none"
        stroke="#111"
        strokeWidth="1"
        opacity="0.45"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.1 }}
      />
      {[220, 420, 640, 860].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y={48 + (i % 2) * 18}
          width="54"
          height="72"
          fill={i % 2 ? "#f3f2ee" : "#111"}
          stroke="#111"
          strokeWidth="1"
          transform={`rotate(${i % 2 ? -8 : 7} ${x + 27} 90)`}
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 * i }}
        />
      ))}
      <circle cx="90" cy="36" r="4" fill="#e23d2e" />
      <circle cx="1120" cy="40" r="5" fill="#2b6cff" />
      <path d="M700 28 l10 0 m-5 -5 l0 10" stroke="#111" strokeWidth="1.6" />
    </svg>
  );
}

function FolioArt() {
  return (
    <svg viewBox="0 0 1200 220" className="h-auto w-full" aria-hidden>
      <path d="M0 220 L 0 90 C 180 40, 360 140, 560 80 S 900 20, 1200 100 V220 Z" fill="#111" />
      <path d="M0 220 L 0 140 C 220 90, 400 180, 640 120 S 980 80, 1200 150 V220 Z" fill="#d9c7ff" />
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {[80, 130, 180, 230, 280, 780, 830, 880, 930, 980, 1030].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={128 - (i % 4) * 10}
            width="36"
            height={70 + (i % 3) * 12}
            fill={["#f3f2ee", "#e8d5a3", "#111", "#d9c7ff"][i % 4]}
          />
        ))}
        <path d="M500 190 L560 88 L620 190 Z" fill="#f3f2ee" />
        <path d="M560 96 L560 190" stroke="#111" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function CatalogArt() {
  const doors = [90, 270, 450, 630, 810, 990];
  return (
    <svg viewBox="0 0 1200 220" className="h-auto w-full" aria-hidden>
      <line x1="0" y1="188" x2="1200" y2="188" stroke="#111" strokeWidth="1.4" />
      {doors.map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 188 V78 Q${x + 50} 28 ${x + 100} 78 V188 Z`}
          fill={i % 2 ? "#e8d5a3" : "#f3f2ee"}
          stroke="#111"
          strokeWidth="1.2"
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
        />
      ))}
      <circle cx="40" cy="36" r="5" fill="#d9c7ff" />
      <circle cx="1160" cy="42" r="4" fill="#e23d2e" />
    </svg>
  );
}

function PortraitArt() {
  return (
    <svg viewBox="0 0 1200 220" className="h-auto w-full" aria-hidden>
      <ellipse cx="600" cy="110" rx="210" ry="80" fill="#e8d5a3" opacity="0.55" />
      <motion.path
        d="M20 130 C 220 130, 220 50, 430 50"
        fill="none"
        stroke="#111"
        strokeWidth="1.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
      <ellipse cx="600" cy="110" rx="92" ry="52" fill="#f3f2ee" stroke="#111" strokeWidth="1.2" />
      <path d="M548 110 H652" stroke="#111" strokeWidth="1" />
      <path d="M560 92 Q600 74 640 92" fill="none" stroke="#111" strokeWidth="1.2" />
      <motion.path
        d="M770 50 C 980 50, 980 130, 1180 130"
        fill="none"
        stroke="#111"
        strokeWidth="1.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
      />
      <circle cx="160" cy="40" r="6" fill="#111" />
      <path d="M1040 32 l12 0 m-6 -6 l0 12" stroke="#111" strokeWidth="1.6" />
    </svg>
  );
}
