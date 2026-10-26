export function HeroArt() {
  return (
    <svg
      viewBox="0 0 640 800"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <rect width="640" height="800" fill="#111" />
      <path d="M0 0 H640 V800 H0 Z" fill="#0c0c0c" />
      <path
        d="M90 0 C 160 90, 40 210, 120 340 C 70 500, 160 640, 20 800 H640 V0 Z"
        fill="#141414"
      />

      <ellipse cx="428" cy="198" rx="196" ry="70" fill="none" stroke="#e8d5a3" strokeWidth="1.15" opacity="0.75" />
      <ellipse
        cx="428"
        cy="198"
        rx="196"
        ry="70"
        fill="none"
        stroke="#e8d5a3"
        strokeWidth="1.15"
        opacity="0.28"
        transform="rotate(32 428 198)"
      />
      <ellipse
        cx="428"
        cy="198"
        rx="132"
        ry="48"
        fill="none"
        stroke="#d9c7ff"
        strokeWidth="1"
        opacity="0.55"
        transform="rotate(-16 428 198)"
      />
      <circle cx="248" cy="168" r="4.5" fill="#f2c94c" />
      <circle cx="600" cy="188" r="3.5" fill="#e23d2e" />
      <circle cx="520" cy="108" r="3" fill="#d9c7ff" />
      <circle cx="338" cy="88" r="5.5" fill="#f3f2ee" />
      <rect x="602" y="246" width="7" height="7" fill="#2b6cff" />
      <circle cx="236" cy="236" r="9" fill="none" stroke="#f3f2ee" strokeWidth="1.4" />
      <path d="M292 118 l9 0 m-4.5 -4.5 l0 9" stroke="#f3f2ee" strokeWidth="1.8" />

      <path
        d="M214 800 C 220 560, 210 500, 250 430 C 286 372, 368 350, 448 368 C 548 390, 590 470, 604 800 Z"
        fill="#f2ebe1"
      />
      <path
        d="M300 455 C 352 498, 430 508, 508 470"
        fill="none"
        stroke="#d8c7b4"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M318 268 C 304 188, 338 128, 404 118 C 478 106, 548 148, 556 214 C 564 268, 530 308, 478 320 C 422 332, 332 328, 318 268 Z"
        fill="#241811"
      />
      <path
        d="M348 214 C 372 164, 438 148, 498 176 C 470 206, 412 220, 348 214 Z"
        fill="#17100c"
      />
      <path
        d="M330 250 C 346 236, 360 250, 352 268"
        fill="#241811"
      />

      <ellipse cx="412" cy="246" rx="66" ry="78" fill="#d8a57a" />
      <path d="M372 228 C 392 214, 430 212, 458 226" fill="#c48b5c" opacity="0.35" />
      <path d="M368 236 C 390 226, 418 224, 448 234" fill="none" stroke="#c48b5c" strokeWidth="2.4" />
      <ellipse cx="390" cy="242" rx="6" ry="7" fill="#1b120e" />
      <ellipse cx="440" cy="240" rx="6" ry="7" fill="#1b120e" />
      <ellipse cx="392" cy="241" rx="2" ry="2" fill="#f3f2ee" opacity="0.35" />
      <ellipse cx="442" cy="239" rx="2" ry="2" fill="#f3f2ee" opacity="0.35" />
      <path d="M398 272 C 412 280, 430 280, 442 270" fill="none" stroke="#b5744d" strokeWidth="2.1" />
      <path d="M404 258 C 414 262, 424 260, 430 256" fill="none" stroke="#c48b5c" strokeWidth="1.4" />
      <circle cx="412" cy="226" r="2.4" fill="#3b2418" />
      <ellipse cx="388" cy="258" rx="10" ry="6" fill="#c88868" opacity="0.35" />
      <ellipse cx="442" cy="256" rx="10" ry="6" fill="#c88868" opacity="0.35" />

      <path
        d="M498 412 C 536 458, 558 560, 564 700"
        fill="none"
        stroke="#d8a57a"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <ellipse cx="576" cy="404" rx="26" ry="16" fill="#d8a57a" transform="rotate(16 576 404)" />
      <path d="M562 398 C 590 384, 610 372, 628 360" fill="none" stroke="#e8d5a3" strokeWidth="1.6" />
    </svg>
  );
}
