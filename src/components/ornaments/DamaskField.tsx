"use client";

import { useId } from "react";

type Props = {
  className?: string;
};

function Rose() {
  return (
    <g fill="none" stroke="#e8c547" strokeWidth="0.55">
      <path d="M0 -11 C5 -11 8 -7 6 -3 C10 -3 11 2 7 5 C9 9 4 12 0 10 C-4 12 -9 9 -7 5 C-11 2 -10 -3 -6 -3 C-8 -7 -5 -11 0 -11 Z" />
      <path d="M0 -6 C3 -6 4 -3 2 -1 C4 0 3 3 0 2 C-3 3 -4 0 -2 -1 C-4 -3 -3 -6 0 -6 Z" stroke="#d4a017" />
      <circle r="1.1" fill="#f4d35e" stroke="none" opacity="0.55" />
      <path d="M8 4 C14 8 16 14 12 16" stroke="#d4a017" strokeWidth="0.45" />
      <path d="M10 8 C13 7 15 10 13 12 C11 11 10 10 10 8 Z" />
      <path d="M-8 4 C-14 9 -15 15 -11 16" stroke="#d4a017" strokeWidth="0.45" />
      <path d="M-10 9 C-13 8 -15 11 -13 13 C-11 12 -10 10 -10 9 Z" />
    </g>
  );
}

function CompassStar({ size = 1 }: { size?: number }) {
  return (
    <g transform={`scale(${size})`} fill="none" stroke="#f4d35e" strokeWidth="0.5">
      <path d="M0 -11 L1.6 -1.6 L11 0 L1.6 1.6 L0 11 L-1.6 1.6 L-11 0 L-1.6 -1.6 Z" />
      <path
        d="M0 -6 L6 0 L0 6 L-6 0 Z"
        stroke="#d4a017"
        strokeWidth="0.4"
      />
      <circle r="1.2" fill="#f4d35e" stroke="none" opacity="0.5" />
    </g>
  );
}

function Folio() {
  return (
    <g fill="none" stroke="#e8c547" strokeWidth="0.5">
      <path d="M-1 -9 C-14 -12 -20 -8 -21 -3 L-21 10 C-14 7 -6 8 -1 10 Z" />
      <path d="M1 -9 C14 -12 20 -8 21 -3 L21 10 C14 7 6 8 1 10 Z" />
      <path d="M0 -9.5 L0 10.5" stroke="#d4a017" strokeWidth="0.65" />
      <path d="M-16 -2 L-6 0" strokeWidth="0.3" />
      <path d="M-16 3 L-6 5" strokeWidth="0.3" />
      <path d="M6 0 L16 -2" strokeWidth="0.3" />
      <path d="M6 5 L16 3" strokeWidth="0.3" />
      <path d="M0 -9.5 C2 -14 0 -16 -2 -13" stroke="#d4a017" strokeWidth="0.4" />
    </g>
  );
}

function NouveauPeacock({ flip = false }: { flip?: boolean }) {
  return (
    <g
      transform={flip ? "scale(-1 1)" : undefined}
      fill="none"
      stroke="#f4d35e"
      strokeWidth="0.55"
    >
      <path d="M18 -28 C22 -40 16 -46 10 -42 C6 -39 8 -32 14 -28" />
      <circle cx="12" cy="-38" r="3.4" />
      <path d="M15 -38 L22 -36" />
      <path d="M10 -41 C8 -48 12 -50 13 -46" stroke="#d4a017" strokeWidth="0.4" />
      <path d="M18 -10 C28 -22 24 -34 16 -30 C8 -18 6 -6 14 2 C22 8 20 16 8 18 C-4 20 -10 10 -4 2 C2 -6 10 -2 18 -10 Z" />
      <path d="M14 2 C8 6 2 6 -2 2" stroke="#d4a017" strokeWidth="0.4" />
      <path d="M4 16 C-8 28 -22 48 -10 62" />
      <path d="M8 18 C-2 34 -8 52 4 64" stroke="#d4a017" strokeWidth="0.45" />
      <path d="M10 17 C6 36 10 54 22 66" />
      <circle cx="-10" cy="62" r="2.1" stroke="#d4a017" />
      <circle cx="4" cy="64" r="2.1" stroke="#d4a017" />
      <circle cx="22" cy="66" r="2.1" stroke="#d4a017" />
    </g>
  );
}

function VineScroll() {
  return (
    <g fill="none" stroke="#d4a017" strokeWidth="0.4">
      <path d="M20 20 C60 8 80 40 120 28 C160 16 180 48 220 36 C250 28 268 50 248 70" />
      <path d="M40 240 C80 220 110 250 150 232 C190 214 220 248 260 230" />
      <path d="M16 80 C8 120 36 150 24 190 C16 220 40 250 70 240" />
      <path d="M260 90 C272 130 244 160 258 200 C266 230 240 255 210 248" />
      <path d="M90 70 C110 110 90 150 120 180 C140 200 130 230 160 250" />
    </g>
  );
}

export function DamaskField({ className = "" }: Props) {
  const rawId = useId().replace(/:/g, "");
  const patternId = `damask-${rawId}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] ${className}`}
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          width="280"
          height="280"
          patternUnits="userSpaceOnUse"
        >
          <rect width="280" height="280" fill="none" />
          <VineScroll />

          <g transform="translate(92 96)">
            <NouveauPeacock />
          </g>
          <g transform="translate(214 186)">
            <NouveauPeacock flip />
          </g>

          <g transform="translate(200 64)">
            <Folio />
          </g>
          <g transform="translate(72 214) rotate(-8)">
            <Folio />
          </g>

          <g transform="translate(48 48)">
            <Rose />
          </g>
          <g transform="translate(236 118)">
            <Rose />
          </g>
          <g transform="translate(154 232)">
            <Rose />
          </g>
          <g transform="translate(40 150) scale(0.75)">
            <Rose />
          </g>

          <g transform="translate(148 40)">
            <CompassStar />
          </g>
          <g transform="translate(250 250)">
            <CompassStar size={0.7} />
          </g>
          <g transform="translate(36 250)">
            <CompassStar size={0.55} />
          </g>
          <g transform="translate(168 150)">
            <CompassStar size={0.5} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
