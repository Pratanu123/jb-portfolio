import type { ReactNode } from "react";
import { SiteMedia } from "@/components/folio/SiteMedia";
import { resolveMark, type MarkKey } from "@/lib/marks";

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.65,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

const drawings: Record<MarkKey, ReactNode> = {
  quill: (
    <>
      <path {...s} d="M28 18 H78 L96 36 V104 H28 Z" />
      <path {...s} d="M78 18 V36 H96" />
      <path {...s} d="M40 52 H84 M40 64 H80 M40 76 H76 M40 88 H68" />
      <path {...s} d="M86 78 L104 96 L98 102 L80 84 Z" />
      <path {...s} d="M82 86 L88 92" />
    </>
  ),
  script: (
    <>
      <rect {...s} x="30" y="14" width="60" height="92" rx="3" />
      <path {...s} d="M42 14 V106" />
      <path {...s} d="M48 30 H80" strokeWidth="3" />
      <path {...s} d="M48 44 H78 M48 54 H74 M48 64 H80" />
      <path {...s} d="M52 80 H70 M52 90 H66" />
      <circle {...s} cx="36" cy="30" r="2" fill="currentColor" />
      <circle {...s} cx="36" cy="54" r="2" fill="currentColor" />
      <circle {...s} cx="36" cy="80" r="2" fill="currentColor" />
    </>
  ),
  newspaper: (
    <>
      <path {...s} d="M18 24 H70 V96 H18 Z" />
      <path {...s} d="M70 24 L102 36 V108 L70 96 Z" />
      <path {...s} d="M28 40 H58 M28 50 H54 M28 60 H58 M28 70 H48" />
      <path {...s} d="M78 46 L94 52 M78 58 L92 63 M78 70 L90 74" />
    </>
  ),
  channels: (
    <>
      <circle {...s} cx="60" cy="60" r="10" />
      <path {...s} d="M60 50 V28 M69 55 L90 40 M69 65 L90 80 M60 70 V92 M51 65 L30 80 M51 55 L30 40" />
      <rect {...s} x="50" y="16" width="20" height="14" rx="2" />
      <path {...s} d="M86 30 H104 V50 H86 Z" />
      <path {...s} d="M86 72 H104 V92 H86 Z" />
      <rect {...s} x="50" y="90" width="20" height="14" rx="2" />
      <path {...s} d="M16 72 H34 V92 H16 Z" />
      <path {...s} d="M16 30 H34 V50 H16 Z" />
    </>
  ),
  bubbles: (
    <>
      <path {...s} d="M18 30 H70 V66 H40 L28 80 V66 H18 Z" />
      <path {...s} d="M50 50 H102 V86 H84 L96 102 V86 H50 Z" />
      <path {...s} d="M28 42 H58 M28 50 H50" />
      <path {...s} d="M62 62 H90 M62 70 H84" />
    </>
  ),
  profile: (
    <>
      <rect {...s} x="22" y="28" width="76" height="68" rx="6" />
      <circle {...s} cx="46" cy="56" r="12" />
      <path {...s} d="M34 86 C36 72 56 72 58 86" />
      <path {...s} d="M68 50 H90 M68 62 H86 M68 74 H80" />
    </>
  ),
  proof: (
    <>
      <path {...s} d="M26 18 H78 L96 36 V104 H26 Z" />
      <path {...s} d="M78 18 V36 H96" />
      <path {...s} d="M38 54 L48 64 L70 42" />
      <path {...s} d="M38 78 L48 88 L70 66" />
      <path {...s} d="M86 70 L108 92" />
      <path {...s} d="M100 70 L86 84" />
    </>
  ),
  browser: (
    <>
      <rect {...s} x="18" y="24" width="84" height="72" rx="6" />
      <path {...s} d="M18 40 H102" />
      <circle {...s} cx="30" cy="32" r="2.2" fill="currentColor" />
      <circle {...s} cx="38" cy="32" r="2.2" fill="currentColor" />
      <circle {...s} cx="46" cy="32" r="2.2" fill="currentColor" />
      <rect {...s} x="56" y="28" width="38" height="8" rx="2" />
      <path {...s} d="M30 54 H90 M30 64 H82 M30 74 H88 M30 84 H70" />
    </>
  ),
  envelope: (
    <>
      <rect {...s} x="16" y="34" width="88" height="56" rx="3" />
      <path {...s} d="M16 38 L60 66 L104 38" />
      <path {...s} d="M16 90 L44 64 M104 90 L76 64" />
    </>
  ),
  flower: (
    <>
      <circle {...s} cx="60" cy="58" r="8" />
      <path {...s} d="M60 30 C70 38 70 50 60 58 C50 50 50 38 60 30" />
      <path {...s} d="M88 50 C80 60 68 62 60 58 C68 48 80 42 88 50" />
      <path {...s} d="M80 86 C68 82 62 70 60 58 C72 62 84 74 80 86" />
      <path {...s} d="M40 86 C36 74 48 62 60 58 C58 70 52 82 40 86" />
      <path {...s} d="M32 50 C40 42 52 48 60 58 C48 62 36 60 32 50" />
      <path {...s} d="M60 66 V100" />
      <path {...s} d="M60 86 C48 82 42 92 40 100" />
    </>
  ),
  ghost: (
    <>
      <path {...s} d="M36 96 L36 54 C36 30 84 30 84 54 V96 L74 86 L60 96 L46 86 Z" />
      <circle {...s} cx="50" cy="56" r="3.5" fill="currentColor" />
      <circle {...s} cx="70" cy="56" r="3.5" fill="currentColor" />
    </>
  ),
  book: (
    <>
      <path {...s} d="M60 28 L22 38 V96 L60 86 L98 96 V38 Z" />
      <path {...s} d="M60 28 V86" />
      <path {...s} d="M32 50 H52 M32 62 H50 M32 74 H48" />
      <path {...s} d="M88 50 H68 M88 62 H70 M88 74 H72" />
    </>
  ),
  landing: (
    <>
      <rect {...s} x="24" y="18" width="72" height="84" rx="3" />
      <path {...s} d="M36 34 H84" strokeWidth="3" />
      <path {...s} d="M36 48 H78 M36 58 H74 M36 68 H80" />
      <rect {...s} x="36" y="80" width="28" height="10" rx="2" />
    </>
  ),
  star: (
    <>
      <path {...s} d="M60 16 L70 46 H102 L76 66 L86 98 L60 80 L34 98 L44 66 L18 46 H50 Z" />
    </>
  ),
  microphone: (
    <>
      <rect {...s} x="46" y="16" width="28" height="48" rx="14" />
      <path {...s} d="M36 46 C36 66 84 66 84 46" />
      <path {...s} d="M60 66 V86" />
      <path {...s} d="M42 96 H78" />
      <path {...s} d="M52 32 H68 M52 42 H68" />
    </>
  ),
  camera: (
    <>
      <rect {...s} x="16" y="38" width="88" height="56" rx="6" />
      <path {...s} d="M40 38 L48 24 H72 L80 38" />
      <circle {...s} cx="60" cy="66" r="16" />
      <circle {...s} cx="60" cy="66" r="8" />
      <circle {...s} cx="90" cy="50" r="3" fill="currentColor" />
    </>
  ),
  compass: (
    <>
      <circle {...s} cx="60" cy="60" r="36" />
      <circle {...s} cx="60" cy="60" r="6" />
      <path {...s} d="M60 28 L68 60 L60 92 L52 60 Z" />
      <path {...s} d="M60 18 V26 M60 94 V102 M18 60 H26 M94 60 H102" />
    </>
  ),
  ink: (
    <>
      <path {...s} d="M44 28 H76 L82 46 H38 Z" />
      <path {...s} d="M38 46 H82 V96 C82 104 38 104 38 96 Z" />
      <path {...s} d="M52 20 H68 V28" />
      <path {...s} d="M48 68 H72" />
    </>
  ),
  seal: (
    <>
      <circle {...s} cx="60" cy="54" r="28" />
      <circle {...s} cx="60" cy="54" r="16" />
      <path {...s} d="M40 76 L32 104 L48 92 L60 108 L72 92 L88 104 L80 76" />
      <path {...s} d="M60 42 L64 50 H74 L66 56 L70 66 L60 60 L50 66 L54 56 L46 50 H56 Z" />
    </>
  ),
  globe: (
    <>
      <circle {...s} cx="60" cy="60" r="36" />
      <ellipse {...s} cx="60" cy="60" rx="16" ry="36" />
      <path {...s} d="M24 60 H96 M28 42 H92 M28 78 H92" />
    </>
  ),
  leaf: (
    <>
      <path {...s} d="M28 88 C28 40 72 16 98 24 C90 56 58 88 28 88 Z" />
      <path {...s} d="M36 80 C56 56 74 40 92 30" />
      <path {...s} d="M48 68 C58 62 70 50 80 42" />
    </>
  ),
};

export function CategoryMark({
  mark,
  slug,
  imageUrl,
}: {
  mark?: string;
  slug?: string;
  imageUrl?: string;
}) {
  const key = resolveMark(mark, slug);
  if (imageUrl) {
    return (
      <div className="relative h-full w-full">
        <SiteMedia src={imageUrl} alt="" fill objectFit="contain" sizes="448px" />
      </div>
    );
  }
  return <Frame>{drawings[key]}</Frame>;
}
