import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ink = "#14110e";

function sheet(id, bg, art, sfx, sfxFill = "#e23d2e") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img">
  <defs>
    <pattern id="ht-${id}" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="1.4" cy="1.4" r="1.2" fill="${ink}" opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="800" height="520" fill="${bg}"/>
  <rect width="800" height="520" fill="url(#ht-${id})"/>
  <g stroke="${ink}" stroke-width="10" stroke-linecap="round" opacity="0.12" fill="none">
    <path d="M-40 80 L260 20"/><path d="M-20 160 L300 90"/><path d="M40 240 L340 160"/>
  </g>
  ${art}
  <g transform="translate(620 70) rotate(-12)">
    <polygon points="0,28 18,0 52,8 78,0 96,30 78,62 42,70 10,60" fill="${sfxFill}" stroke="${ink}" stroke-width="6"/>
    <text x="48" y="42" text-anchor="middle" fill="#fff8e8" font-family="Impact, Bangers, sans-serif" font-size="22">${sfx}</text>
  </g>
</svg>`;
}

const scenes = {
  "brand-storytelling": sheet(
    "01",
    "#ffcf3d",
    `<g stroke="${ink}" stroke-width="7" fill="#fff6d6">
      <path d="M170 430 L170 250 L320 140 L470 250 L470 430 Z"/>
      <rect x="250" y="300" width="70" height="130" fill="#6b3a1f"/>
      <rect x="360" y="270" width="54" height="54" fill="#7ec8ff"/>
      <rect x="200" y="270" width="54" height="54" fill="#7ec8ff"/>
      <path d="M155 255 L320 120 L485 255" fill="none"/>
    </g>
    <path d="M500 210c40-6 70 10 78 40-22-4-40 8-44 28-28-18-70-20-90-4 8-28 22-56 56-64z" fill="#fffdf8" stroke="${ink}" stroke-width="5"/>
    <text x="528" y="248" fill="${ink}" font-family="Impact, sans-serif" font-size="20">HOME</text>`,
    "TALE",
  ),
  "website-copy": sheet(
    "02",
    "#d7ecff",
    `<rect x="180" y="120" width="300" height="300" rx="8" fill="#fffdf8" stroke="${ink}" stroke-width="7"/>
    <path d="M200 170 H460 M200 210 H430 M200 250 H450 M200 290 H400" stroke="${ink}" stroke-width="8"/>
    <path d="M470 300 l90 40 -20 70 -90-40z" fill="#ffe566" stroke="${ink}" stroke-width="6"/>
    <path d="M545 360 l40 70" stroke="${ink}" stroke-width="8"/>
    <circle cx="590" cy="440" r="16" fill="#e23d2e" stroke="${ink}" stroke-width="5"/>`,
    "SCRIB",
  ),
  "seo-articles": sheet(
    "03",
    "#e8f5d8",
    `<text x="150" y="250" fill="${ink}" font-family="Impact, sans-serif" font-size="92" opacity="0.18">SEO</text>
    <circle cx="340" cy="230" r="110" fill="none" stroke="${ink}" stroke-width="16"/>
    <circle cx="340" cy="230" r="78" fill="#7ec8ff" stroke="${ink}" stroke-width="6"/>
    <path d="M420 310 L530 430" stroke="${ink}" stroke-width="22"/>
    <path d="M260 210 h50 M310 250 h70" stroke="#fff8e8" stroke-width="10"/>`,
    "SEEK",
  ),
  "blog-posts": sheet(
    "04",
    "#f3d9ff",
    `<path d="M200 120 h280 l40 40 v280 h-320z" fill="#fff6d6" stroke="${ink}" stroke-width="7"/>
    <path d="M480 120 v40 h40" fill="none" stroke="${ink}" stroke-width="7"/>
    <path d="M230 200 H450 M230 250 H430 M230 300 H440 M230 350 H390" stroke="${ink}" stroke-width="8"/>
    <circle cx="250" cy="160" r="10" fill="#e23d2e"/>`,
    "NOTE",
  ),
  "social-captions": sheet(
    "05",
    "#ffd3c2",
    `<rect x="300" y="90" width="180" height="340" rx="28" fill="#14110e"/>
    <rect x="318" y="120" width="144" height="250" fill="#7ec8ff"/>
    <circle cx="390" cy="400" r="16" fill="#ffe566" stroke="${ink}" stroke-width="4"/>
    <polygon points="470,150 560,110 590,190 510,210" fill="#e23d2e" stroke="${ink}" stroke-width="6"/>
    <text x="530" y="175" text-anchor="middle" fill="#fff8e8" font-family="Impact, sans-serif" font-size="22">HA</text>`,
    "CHAT",
  ),
  "email-newsletters": sheet(
    "06",
    "#d7ecff",
    `<g transform="translate(220 150) rotate(-12)">
      <rect width="340" height="210" fill="#fffdf8" stroke="${ink}" stroke-width="7"/>
      <path d="M0 0 L170 110 L340 0" fill="none" stroke="${ink}" stroke-width="7"/>
      <path d="M0 210 L130 120 M340 210 L210 120" stroke="${ink}" stroke-width="6"/>
    </g>
    <path d="M140 120 C180 40 260 50 280 110" fill="none" stroke="${ink}" stroke-width="6"/>`,
    "POST",
  ),
  "product-descriptions": sheet(
    "07",
    "#ffe566",
    `<rect x="250" y="180" width="240" height="200" fill="#ff7a18" stroke="${ink}" stroke-width="7"/>
    <path d="M250 180 L370 100 L490 180" fill="#e23d2e" stroke="${ink}" stroke-width="7"/>
    <rect x="340" y="240" width="60" height="90" fill="#ffe566" stroke="${ink}" stroke-width="6"/>
    <path d="M200 140 q40 -60 90 -10" fill="none" stroke="${ink}" stroke-width="6"/>`,
    "BUY",
  ),
  "case-studies": sheet(
    "08",
    "#e8f5d8",
    `<rect x="200" y="140" width="280" height="250" fill="#fff6d6" stroke="${ink}" stroke-width="7"/>
    <path d="M200 140 h70 l20 30 h190 v-30" fill="#2b6cff" stroke="${ink}" stroke-width="6"/>
    <path d="M250 260 v80 M310 230 v110 M370 280 v60" stroke="#e23d2e" stroke-width="16"/>
    <circle cx="500" cy="200" r="70" fill="none" stroke="${ink}" stroke-width="12"/>`,
    "CASE",
  ),
  "thought-leadership": sheet(
    "09",
    "#fff3c4",
    `<path d="M340 120 c80 0 110 70 80 130 -10 20 10 30 10 50 h-160 c0-20 20-30 10-50 -30-60 0-130 60-130z" fill="#ffe566" stroke="${ink}" stroke-width="7"/>
    <rect x="350" y="310" width="80" height="30" fill="#14110e"/>
    <path d="M300 400 h180 l-20 -50 h-140z" fill="#6b3a1f" stroke="${ink}" stroke-width="6"/>
    <circle cx="500" cy="150" r="8" fill="#e23d2e"/>
    <circle cx="530" cy="180" r="6" fill="#e23d2e"/>`,
    "IDEA",
  ),
  "video-scripts": sheet(
    "10",
    "#f3d9ff",
    `<rect x="200" y="160" width="300" height="200" fill="#14110e"/>
    <rect x="220" y="180" width="120" height="80" fill="#7ec8ff"/>
    <rect x="360" y="180" width="120" height="80" fill="#ffcf3d"/>
    <rect x="220" y="280" width="120" height="60" fill="#e23d2e"/>
    <rect x="360" y="280" width="120" height="60" fill="#fff6d6"/>
    <rect x="160" y="130" width="380" height="36" fill="#ffe566" stroke="${ink}" stroke-width="6"/>
    <text x="350" y="156" text-anchor="middle" fill="${ink}" font-family="Impact, sans-serif" font-size="22">SCENE 01</text>`,
    "CUT",
  ),
  "white-papers": sheet(
    "11",
    "#e8e6e1",
    `<g stroke="${ink}" stroke-width="6" fill="#fffdf8">
      <rect x="280" y="180" width="200" height="260"/>
      <rect x="250" y="150" width="200" height="260"/>
      <rect x="220" y="120" width="200" height="260"/>
    </g>
    <path d="M250 190 H390 M250 230 H370" stroke="${ink}" stroke-width="7"/>`,
    "DOSS",
  ),
  "press-releases": sheet(
    "12",
    "#ffd3c2",
    `<rect x="180" y="110" width="380" height="320" fill="#fffdf8" stroke="${ink}" stroke-width="7"/>
    <rect x="180" y="110" width="380" height="70" fill="#e23d2e"/>
    <text x="370" y="158" text-anchor="middle" fill="#fff8e8" font-family="Impact, sans-serif" font-size="36">EXTRA</text>
    <path d="M210 220 H520 M210 260 H500 M210 300 H510 M210 340 H470" stroke="${ink}" stroke-width="8"/>`,
    "NEWS",
  ),
  "ghostwriting": sheet(
    "13",
    "#d7ecff",
    `<path d="M300 160 c80-70 180-20 180 70 0 80-30 140-70 170 l-20-40 -20 50 -20-46 -24 40 c-40-40-70-110-26-244z" fill="#fffdf8" stroke="${ink}" stroke-width="7"/>
    <circle cx="360" cy="230" r="10" fill="${ink}"/>
    <circle cx="420" cy="230" r="10" fill="${ink}"/>
    <path d="M370 270 q20 16 40 0" fill="none" stroke="${ink}" stroke-width="6"/>
    <path d="M470 330 l70 20 -10 50" fill="#ffe566" stroke="${ink}" stroke-width="5"/>`,
    "BOO",
  ),
  "creative-essays": sheet(
    "14",
    "#ffe566",
    `<path d="M240 360 l220 -200 40 40 -220 200z" fill="#2b6cff" stroke="${ink}" stroke-width="7"/>
    <path d="M460 160 l50 -50 30 30 -50 50z" fill="#e23d2e" stroke="${ink}" stroke-width="6"/>
    <path d="M200 180 l20 40 40-10 -20-40z" fill="#fff8e8" stroke="${ink}" stroke-width="4"/>
    <path d="M560 220 l16 30 30-8 -16-30z" fill="#fff8e8" stroke="${ink}" stroke-width="4"/>
    <path d="M170 300 l14 26 26-8 -14-26z" fill="#fff8e8" stroke="${ink}" stroke-width="4"/>`,
    "OOH",
  ),
  "landing-pages": sheet(
    "15",
    "#e8f5d8",
    `<rect x="210" y="90" width="360" height="340" fill="#fffdf8" stroke="${ink}" stroke-width="8"/>
    <rect x="210" y="90" width="360" height="50" fill="#14110e"/>
    <circle cx="236" cy="115" r="8" fill="#e23d2e"/>
    <circle cx="260" cy="115" r="8" fill="#ffe566"/>
    <rect x="250" y="180" width="180" height="70" fill="#2b6cff" stroke="${ink}" stroke-width="5"/>
    <path d="M250 280 H520 M250 320 H480 M250 360 H500" stroke="${ink}" stroke-width="8"/>`,
    "ENTER",
  ),
};

const covers = {
  "cover-1": sheet(
    "c1",
    "#ffcf3d",
    `<path d="M140 430 L140 240 L300 110 L460 240 L460 430 Z" fill="#fff6d6" stroke="${ink}" stroke-width="8"/>
    <rect x="240" y="300" width="80" height="130" fill="#6b3a1f"/>
    <rect x="340" y="260" width="60" height="60" fill="#7ec8ff" stroke="${ink}" stroke-width="5"/>
    <path d="M500 200c50-10 90 20 96 50-30 0-48 16-50 40-36-20-90-24-120 0 14-40 36-78 74-90z" fill="#fffdf8" stroke="${ink}" stroke-width="6"/>
    <text x="548" y="248" fill="${ink}" font-family="Impact, sans-serif" font-size="22">KNOCK</text>
    <circle cx="180" cy="160" r="18" fill="#e23d2e"/>`,
    "HOME",
  ),
  "cover-2": sheet(
    "c2",
    "#ffe08a",
    `<rect x="190" y="110" width="340" height="300" fill="#fffdf8" stroke="${ink}" stroke-width="8"/>
    <path d="M210 160 H500 M210 210 H470 M210 260 H490 M210 310 H430" stroke="#d4a017" stroke-width="10"/>
    <circle cx="480" cy="360" r="46" fill="#e23d2e" stroke="${ink}" stroke-width="6"/>
    <text x="480" y="370" text-anchor="middle" fill="#ffe566" font-family="Impact, sans-serif" font-size="20">JB</text>
    <path d="M140 90 l40 20 -10 40" fill="#2b6cff" stroke="${ink}" stroke-width="5"/>`,
    "GOLD",
  ),
  "cover-3": sheet(
    "c3",
    "#d7ecff",
    `<ellipse cx="400" cy="360" rx="180" ry="36" fill="#c9a05a" stroke="${ink}" stroke-width="6"/>
    <rect x="250" y="250" width="300" height="110" fill="#6b3a1f" stroke="${ink}" stroke-width="7"/>
    <path d="M200 250 q40-90 0-140" fill="#fff6d6" stroke="${ink}" stroke-width="7"/>
    <path d="M600 250 q-40-90 0-140" fill="#fff6d6" stroke="${ink}" stroke-width="7"/>
    <path d="M360 200 q40 -30 80 0" fill="none" stroke="${ink}" stroke-width="5" opacity="0.5"/>
    <text x="400" y="160" text-anchor="middle" fill="${ink}" font-family="Impact, sans-serif" font-size="28">AIR</text>`,
    "HUSH",
  ),
};

const catDir = join(process.cwd(), "public/categories");
const coverDir = join(process.cwd(), "public/covers");
mkdirSync(catDir, { recursive: true });
mkdirSync(coverDir, { recursive: true });
for (const [slug, svg] of Object.entries(scenes)) {
  writeFileSync(join(catDir, `${slug}.svg`), svg);
}
for (const [name, svg] of Object.entries(covers)) {
  writeFileSync(join(coverDir, `${name}.svg`), svg);
}
console.log(`wrote ${Object.keys(scenes).length} category comics and ${Object.keys(covers).length} covers`);
