export type Accent = "violet-red" | "teal-gold";

export function isAccent(value: string): value is Accent {
  return value === "violet-red" || value === "teal-gold";
}

export function accentClasses(accent: string) {
  if (accent === "teal-gold") {
    return {
      pair: "teal-gold" as const,
      border: "folio-card folio-card-teal",
      glow: "",
      ink: "text-teal",
      label: "text-gold",
      wash: "from-teal/20 to-gold/10",
    };
  }
  return {
    pair: "violet-red" as const,
      border: "folio-card",
      glow: "",
    ink: "text-violet-bright",
    label: "text-crimson",
    wash: "from-violet/25 to-crimson/10",
  };
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function monogram(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "JB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function initialsFromSettings(displayName: string) {
  return monogram(displayName);
}
