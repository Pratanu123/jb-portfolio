const MARKS = [
  { word: "POW", top: "6%", left: "2%", rotate: -14, size: "4.6rem", color: "#e23d2e" },
  { word: "BOOM", top: "14%", right: "3%", rotate: 10, size: "3.8rem", color: "#ffe566" },
  { word: "BAM", top: "28%", left: "8%", rotate: 16, size: "3.2rem", color: "#ff7a18" },
  { word: "ZAP", top: "36%", right: "7%", rotate: -8, size: "3.4rem", color: "#d7ecff" },
  { word: "WHAM", top: "48%", left: "1%", rotate: -18, size: "3.6rem", color: "#ffe566" },
  { word: "KAPOW", top: "58%", right: "2%", rotate: 12, size: "4.1rem", color: "#e23d2e" },
  { word: "INK", top: "70%", left: "6%", rotate: 8, size: "3rem", color: "#ffd3c2" },
  { word: "CRASH", top: "78%", right: "8%", rotate: -12, size: "3.3rem", color: "#ffe566" },
  { word: "POW", top: "88%", left: "12%", rotate: 14, size: "3.8rem", color: "#e23d2e" },
  { word: "BOOM", top: "94%", right: "14%", rotate: -6, size: "3.2rem", color: "#ff7a18" },
];

export function ComicBackdrop() {
  return (
    <div className="comic-backdrop" aria-hidden>
      {MARKS.map((mark, index) => (
        <span
          key={`${mark.word}-${index}`}
          className="comic-backdrop-mark"
          style={{
            top: mark.top,
            left: mark.left,
            right: mark.right,
            transform: `rotate(${mark.rotate}deg)`,
            fontSize: mark.size,
            color: mark.color,
          }}
        >
          {mark.word}!
        </span>
      ))}
    </div>
  );
}
