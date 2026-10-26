import type { ReactNode } from "react";

export function Halftone({ className = "" }: { className?: string }) {
  return <span className={`pointer-events-none absolute inset-0 opacity-0 ${className}`} aria-hidden />;
}

export function Panel({
  children,
  className = "",
  fill = "transparent",
}: {
  children: ReactNode;
  className?: string;
  fill?: string;
  tilt?: number;
}) {
  return (
    <div className={className} style={{ background: fill === "#fffaf1" ? "transparent" : fill }}>
      {children}
    </div>
  );
}

export function Stamp({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`text-[11px] tracking-wide uppercase ${className}`}>{children}</span>;
}

export function Thought({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

export function Caption({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-[11px] tracking-wide text-[#666] uppercase ${className}`}>{children}</p>;
}

export function Speech({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[19px] leading-relaxed font-light">{children}</p>
    </div>
  );
}

export function StripTitle({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-[11px] tracking-wide text-[#666] uppercase">{kicker}</p>
      <h2 className="mt-2 text-[24px] font-normal tracking-tight text-[#929292] uppercase">{title}</h2>
    </div>
  );
}
