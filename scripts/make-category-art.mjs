import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const plates = [
  { slug: "brand-storytelling", a: "#1a0612", b: "#ff4d6d", c: "#f4b942", mark: "01" },
  { slug: "website-copy", a: "#07161a", b: "#2ee6c6", c: "#fff4e4", mark: "02" },
  { slug: "seo-articles", a: "#14080a", b: "#f4b942", c: "#ff4d6d", mark: "03" },
  { slug: "blog-posts", a: "#0c0618", b: "#c084fc", c: "#2ee6c6", mark: "04" },
  { slug: "social-captions", a: "#1a0a08", b: "#ff6b35", c: "#ffe08a", mark: "05" },
  { slug: "email-newsletters", a: "#081018", b: "#3b82f6", c: "#f4b942", mark: "06" },
  { slug: "product-descriptions", a: "#161008", b: "#e8c547", c: "#ff4d6d", mark: "07" },
  { slug: "case-studies", a: "#0a1210", b: "#14b8a6", c: "#fff4e4", mark: "08" },
  { slug: "thought-leadership", a: "#180610", b: "#fb7185", c: "#f4b942", mark: "09" },
  { slug: "video-scripts", a: "#0b0a16", b: "#818cf8", c: "#ff4d6d", mark: "10" },
  { slug: "white-papers", a: "#101210", b: "#e7e5e4", c: "#f4b942", mark: "11" },
  { slug: "press-releases", a: "#16080c", b: "#f43f5e", c: "#2ee6c6", mark: "12" },
  { slug: "ghostwriting", a: "#0c0c14", b: "#a78bfa", c: "#fff4e4", mark: "13" },
  { slug: "creative-essays", a: "#180c06", b: "#fb923c", c: "#2ee6c6", mark: "14" },
  { slug: "landing-pages", a: "#08140e", b: "#34d399", c: "#f4b942", mark: "15" },
];

function svg({ a, b, c, mark }) {
  const id = mark.replace(/\W/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100" role="img">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="0.55" stop-color="${b}"/>
      <stop offset="1" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="r${id}" cx="20%" cy="10%" r="70%">
      <stop offset="0" stop-color="${c}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="1100" fill="url(#g${id})"/>
  <rect width="900" height="1100" fill="url(#r${id})"/>
  <circle cx="720" cy="220" r="210" fill="none" stroke="${c}" stroke-width="1.4" opacity="0.55"/>
  <circle cx="180" cy="920" r="160" fill="${a}" opacity="0.35"/>
  <path d="M80 240 C260 120 420 360 620 220 C760 130 820 300 700 420" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
  <path d="M140 780 C300 640 520 860 780 700" fill="none" stroke="${a}" stroke-width="1.6" opacity="0.45"/>
  <text x="70" y="180" fill="${c}" font-family="Georgia, serif" font-size="160" letter-spacing="-6">${mark}</text>
  <rect x="70" y="980" width="140" height="8" fill="${c}"/>
</svg>`;
}

const dir = join(process.cwd(), "public/categories");
mkdirSync(dir, { recursive: true });
for (const plate of plates) {
  writeFileSync(join(dir, `${plate.slug}.svg`), svg(plate));
}
console.log(`wrote ${plates.length} category plates`);
