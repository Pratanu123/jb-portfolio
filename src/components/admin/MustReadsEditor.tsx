"use client";

import { useMemo, useState } from "react";
import { CoverUpload } from "@/components/admin/CoverUpload";

export type MustReadOption = {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  featured: boolean;
  featuredOrder: number;
  categoryName: string;
};

type Slide = {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  categoryName: string;
};

export function MustReadsEditor({ works }: { works: MustReadOption[] }) {
  const [slides, setSlides] = useState<Slide[]>(() =>
    works
      .filter((work) => work.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .map(toSlide),
  );
  const [addId, setAddId] = useState("");

  const available = useMemo(
    () => works.filter((work) => !slides.some((slide) => slide.id === work.id)),
    [slides, works],
  );

  function update(id: string, patch: Partial<Slide>) {
    setSlides((current) => current.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= slides.length) return;
    setSlides((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  return (
    <div className="space-y-6">
      {slides.length === 0 ? (
        <p className="text-sm text-ink/55">Nothing in Must reads yet. Add a published work below.</p>
      ) : null}

      {slides.map((slide, index) => (
        <div key={slide.id} className="space-y-4 border border-violet/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label text-violet">Card {index + 1}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="label text-teal" onClick={() => move(index, -1)} disabled={index === 0}>
                Up
              </button>
              <button
                type="button"
                className="label text-teal"
                onClick={() => move(index, 1)}
                disabled={index === slides.length - 1}
              >
                Down
              </button>
              <button
                type="button"
                className="label text-crimson"
                onClick={() => setSlides((current) => current.filter((item) => item.id !== slide.id))}
              >
                Remove
              </button>
            </div>
          </div>

          <input type="hidden" name="mustReadId" value={slide.id} />

          <div>
            <p className="label text-violet">Cover</p>
            <div className="mt-2">
              <CoverUpload
                name="mustReadCover"
                initial={slide.coverImageUrl}
                previewClass="aspect-[4/3] max-w-56 bg-black"
                contain
                hint="Shown on the left of the card."
                onChange={(coverImageUrl) => update(slide.id, { coverImageUrl })}
              />
            </div>
          </div>

          <p className="text-sm text-ink/55">Category: {slide.categoryName}</p>

          <label className="block">
            <span className="label text-violet">Title</span>
            <input
              name="mustReadTitle"
              value={slide.title}
              onChange={(event) => update(slide.id, { title: event.target.value })}
              className="field mt-2"
            />
          </label>

          <label className="block">
            <span className="label text-violet">Preview</span>
            <textarea
              name="mustReadExcerpt"
              rows={3}
              value={slide.excerpt}
              onChange={(event) => update(slide.id, { excerpt: event.target.value })}
              className="field mt-2"
            />
            <span className="mt-2 block text-sm text-ink/55">Two sentences is enough.</span>
          </label>
        </div>
      ))}

      {available.length ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block min-w-0 flex-1">
            <span className="label text-violet">Add a work</span>
            <select value={addId} onChange={(event) => setAddId(event.target.value)} className="field mt-2">
              <option value="">Choose a published work</option>
              {available.map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="label text-teal sm:mb-3"
            onClick={() => {
              const work = works.find((item) => item.id === addId);
              if (!work) return;
              setSlides((current) => [...current, toSlide(work)]);
              setAddId("");
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <p className="text-sm text-ink/55">
          {works.length === 0
            ? "Publish a work first, then add it here."
            : "Every published work is already in Must reads."}
        </p>
      )}
    </div>
  );
}

function toSlide(work: MustReadOption): Slide {
  return {
    id: work.id,
    title: work.title,
    excerpt: work.excerpt,
    coverImageUrl: work.coverImageUrl,
    categoryName: work.categoryName,
  };
}
