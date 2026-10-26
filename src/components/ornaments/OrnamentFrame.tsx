import type { ReactNode } from "react";
import { FiligreeCorners } from "@/components/ornaments/FiligreeCorners";

type Props = {
  children: ReactNode;
  className?: string;
  accent?: "violet-red" | "teal-gold";
};

export function OrnamentFrame({
  children,
  className = "",
  accent = "violet-red",
}: Props) {
  const color = accent === "teal-gold" ? "#d4a017" : "#f4d35e";
  return (
    <div
      className={`relative overflow-hidden p-5 transition duration-500 ${className}`}
    >
      <FiligreeCorners size="compact" color={color} className="opacity-80" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
