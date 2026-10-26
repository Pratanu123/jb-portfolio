"use client";

import { useWindchimeAudio } from "@/components/comic/useWindchimeAudio";

const TUBES = ["low tube", "gold tube", "mid tube", "pale tube", "high tube"];

export function Windchime() {
  const { muted, unlockAndRing, toggleMute } = useWindchimeAudio();

  return (
    <div className="absolute top-[6%] left-[4%] z-10 h-[42%] w-[28%] max-w-48">
      <button
        type="button"
        className="absolute top-0 left-0 text-[11px] font-medium tracking-wide text-white/70 uppercase"
        onClick={toggleMute}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute windchime" : "Mute windchime"}
      >
        {muted ? "Sound off" : "Sound on"}
      </button>
      <div className="absolute inset-[18%_0_0] flex justify-between">
        {TUBES.map((label, index) => (
          <button
            key={label}
            type="button"
            className="h-full w-[16%] cursor-pointer border-0 bg-transparent"
            onClick={() => void unlockAndRing(index)}
            onMouseEnter={() => {
              if (!muted) void unlockAndRing(index);
            }}
            aria-label={`Ring the ${label}`}
          />
        ))}
      </div>
    </div>
  );
}
