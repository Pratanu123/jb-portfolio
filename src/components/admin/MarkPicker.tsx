"use client";

import { useState } from "react";
import { CoverUpload } from "@/components/admin/CoverUpload";
import { CategoryMark } from "@/components/folio/CategoryMark";
import { MARK_KEYS, MARK_LABELS, resolveMark } from "@/lib/marks";

type Props = {
  markName?: string;
  imageName?: string;
  initialMark?: string;
  initialImage?: string;
};

export function MarkPicker({
  markName = "mark",
  imageName = "markImageUrl",
  initialMark = "quill",
  initialImage = "",
}: Props) {
  const [mark, setMark] = useState(resolveMark(initialMark));
  const [image, setImage] = useState(initialImage);

  return (
    <div className="space-y-4">
      <input type="hidden" name={markName} value={mark} />
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 rounded-full bg-black text-[#e8c56b] ring-1 ring-[#e8c56b]/50">
          <div className="absolute inset-[18%]">
            <CategoryMark mark={mark} imageUrl={image} />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-ink/60">
          Shown in the gold circle on Home. Pick a drawing or upload your own.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {MARK_KEYS.map((key) => {
          const selected = key === mark;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMark(key)}
              className={`flex flex-col items-center gap-2 border p-2 text-center transition-colors ${
                selected ? "border-gold bg-gold/10" : "border-violet/20 bg-cream hover:border-gold/60"
              }`}
            >
              <span className="relative block h-14 w-14 rounded-full bg-black text-[#e8c56b]">
                <span className="absolute inset-[16%]">
                  <CategoryMark mark={key} />
                </span>
              </span>
              <span className="label text-[11px] text-ink/70">{MARK_LABELS[key]}</span>
            </button>
          );
        })}
      </div>
      <div>
        <span className="label text-violet">Custom astrolabe image</span>
        <div className="mt-2">
          <CoverUpload
            name={imageName}
            initial={initialImage}
            previewClass="aspect-square max-w-28"
            contain
            onChange={setImage}
            hint="Optional. Replaces the drawing inside the astrolabe. JPG, PNG, WebP, GIF, or SVG."
          />
        </div>
      </div>
    </div>
  );
}
