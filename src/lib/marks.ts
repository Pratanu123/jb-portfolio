export const MARK_KEYS = [
  "quill",
  "script",
  "newspaper",
  "channels",
  "bubbles",
  "profile",
  "proof",
  "browser",
  "envelope",
  "flower",
  "ghost",
  "book",
  "landing",
  "star",
  "microphone",
  "camera",
  "compass",
  "ink",
  "seal",
  "globe",
  "leaf",
] as const;

export type MarkKey = (typeof MARK_KEYS)[number];

export const DEFAULT_MARK: MarkKey = "quill";

export const MARK_LABELS: Record<MarkKey, string> = {
  quill: "Quill",
  script: "Script",
  newspaper: "Newspaper",
  channels: "Channels",
  bubbles: "Bubbles",
  profile: "Profile",
  proof: "Proof",
  browser: "Browser",
  envelope: "Envelope",
  flower: "Flower",
  ghost: "Ghost",
  book: "Book",
  landing: "Page",
  star: "Star",
  microphone: "Microphone",
  camera: "Camera",
  compass: "Compass",
  ink: "Ink",
  seal: "Seal",
  globe: "Globe",
  leaf: "Leaf",
};

const SLUG_MARKS: Record<string, MarkKey> = {
  "feature-writing": "quill",
  "script-writing": "script",
  article: "newspaper",
  articles: "newspaper",
  "multi-channel-marketing-communications": "channels",
  "social-media-posts": "bubbles",
  "social-captions": "bubbles",
  "linkedin-posts": "profile",
  "editing-proofreading": "proof",
  "news-headlines": "newspaper",
  "website-copy": "browser",
  newsletter: "envelope",
  "email-newsletters": "envelope",
  ghostwriting: "ghost",
  "creative-essays": "flower",
  "landing-pages": "landing",
};

export function isMarkKey(value: string): value is MarkKey {
  return (MARK_KEYS as readonly string[]).includes(value);
}

export function resolveMark(value?: string | null, slug?: string | null): MarkKey {
  if (value && isMarkKey(value)) return value;
  if (slug && SLUG_MARKS[slug]) return SLUG_MARKS[slug];
  return DEFAULT_MARK;
}
