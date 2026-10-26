"use client";

import { useState } from "react";
import {
  createCategory,
  deleteCategory,
  moveCategory,
  renameCategory,
} from "@/actions/categories";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { MarkPicker } from "@/components/admin/MarkPicker";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  mark: string;
  markImageUrl: string;
  accent: string;
  _count: { works: number };
};

function CategoryFields({ category }: { category?: Category }) {
  return (
    <>
      <label className="md:col-span-2">
        <span className="label text-violet">Name</span>
        <input name="name" required defaultValue={category?.name} className="field mt-2" />
      </label>
      <label className="md:col-span-2">
        <span className="label text-violet">Short description</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={category?.description}
          className="field mt-2"
        />
      </label>
      <div className="md:col-span-2">
        <span className="label text-violet">Gold mark</span>
        <div className="mt-2">
          <MarkPicker initialMark={category?.mark} initialImage={category?.markImageUrl} />
        </div>
      </div>
      <input type="hidden" name="accent" value={category?.accent ?? "violet-red"} />
      <input type="hidden" name="imageUrl" value={category?.imageUrl ?? ""} />
    </>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [error, setError] = useState("");

  return (
    <div className="space-y-10">
      <form
        className="grid gap-4 paper-wash p-5 md:grid-cols-2"
        action={async (formData) => {
          const result = await createCategory(formData);
          if (result?.error) setError(result.error);
        }}
      >
        <div className="md:col-span-2">
          <h2 className="font-title text-2xl">Add a category</h2>
          <p className="mt-2 text-ink/60">It appears on Home and the Categories page.</p>
        </div>
        {error ? <p className="text-crimson md:col-span-2">{error}</p> : null}
        <CategoryFields />
        <button className="btn-gold md:col-span-2" type="submit">
          Add
        </button>
      </form>

      <ul className="space-y-4">
        {categories.map((category, index) => (
          <li key={category.id} className="paper-wash p-5">
            <form
              className="grid gap-3 md:grid-cols-2"
              action={async (formData) => {
                formData.set("id", category.id);
                const result = await renameCategory(formData);
                if (result?.error) setError(result.error);
              }}
            >
              <div className="md:col-span-2">
                <p className="label text-violet">{category.name}</p>
                <p className="mt-1 text-sm text-ink/50">/categories/{category.slug}</p>
              </div>
              <CategoryFields category={category} />
              <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                <button className="btn-gold" type="submit">
                  Save
                </button>
                <button
                  type="button"
                  className="label text-ink/60"
                  disabled={index === 0}
                  onClick={() => moveCategory(category.id, "up")}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="label text-ink/60"
                  disabled={index === categories.length - 1}
                  onClick={() => moveCategory(category.id, "down")}
                >
                  Down
                </button>
                <span className="text-sm text-ink/50">{category._count.works} works</span>
                <ConfirmDelete
                  label="Remove"
                  message={`Remove “${category.name}”?`}
                  action={() => deleteCategory(category.id)}
                />
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
