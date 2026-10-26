"use client";

import { useState } from "react";
import { saveWork } from "@/actions/works";
import { CoverUpload } from "@/components/admin/CoverUpload";
import { Editor } from "@/components/admin/Editor";
import { slugify } from "@/lib/slug";

type Category = { id: string; name: string };

type Work = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: unknown;
  coverImageUrl: string;
  featured: boolean;
  published: boolean;
  categoryId: string;
};

export function WorkForm({
  categories,
  work,
}: {
  categories: Category[];
  work?: Work;
}) {
  const [slug, setSlug] = useState(work?.slug ?? "");
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-8"
      action={async (formData) => {
        const result = await saveWork(formData);
        if (result?.error) setError(result.error);
      }}
    >
      {work ? <input type="hidden" name="id" value={work.id} /> : null}
      {error ? <p className="text-crimson">{error}</p> : null}
      <label className="block">
        <span className="label text-violet">Title</span>
        <input
          name="title"
          required
          defaultValue={work?.title}
          className="field mt-2"
          onBlur={(event) => {
            if (!work) setSlug(slugify(event.target.value));
          }}
        />
      </label>
      <label className="block">
        <span className="label text-violet">Slug</span>
        <input
          name="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="field mt-2"
        />
        <span className="mt-2 block text-sm text-ink/55">/works/{slug || "title-here"}</span>
      </label>
      <label className="block">
        <span className="label text-violet">Category</span>
        <select
          name="categoryId"
          required
          defaultValue={work?.categoryId ?? categories[0]?.id}
          className="field mt-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="label text-violet">Preview</span>
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={work?.excerpt}
          className="field mt-2"
        />
        <span className="mt-2 block text-sm text-ink/55">
          Two sentences is enough for Must reads.
        </span>
      </label>
      <div>
        <p className="label mb-2 text-violet">Cover</p>
        <CoverUpload
          initial={work?.coverImageUrl}
          contain
          hint="Used on Must reads, the category page, and the article."
        />
      </div>
      <div>
        <p className="label mb-2 text-violet">Article</p>
        <Editor name="body" initial={work?.body} />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-lg">
          <input type="checkbox" name="featured" defaultChecked={work?.featured} />
          Featured in Must reads
        </label>
        <label className="flex items-center gap-2 text-lg">
          <input type="checkbox" name="published" defaultChecked={work?.published} />
          Published
        </label>
      </div>
      <button className="btn-gold" type="submit">
        {work ? "Save" : "Add"}
      </button>
    </form>
  );
}
