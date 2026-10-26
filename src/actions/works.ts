"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { parseStoredBody } from "@/lib/article";

async function requireAdmin() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
}

const workSchema = z.object({
  title: z.string().min(2, "Title is too short."),
  slug: z.string().optional(),
  excerpt: z.string().min(8, "Give the piece a short excerpt."),
  categoryId: z.string().min(1, "Choose a category."),
  coverImageUrl: z.string().optional(),
  body: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
});

function parseBody(raw: string | undefined) {
  return parseStoredBody(raw);
}

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "work";
  let n = 1;
  while (
    await prisma.work.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
}

export async function saveWork(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = workSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    categoryId: formData.get("categoryId"),
    coverImageUrl: formData.get("coverImageUrl"),
    body: formData.get("body"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.slug || data.title, id || undefined);
  const published = Boolean(data.published);
  const existing = id ? await prisma.work.findUnique({ where: { id } }) : null;
  let featuredOrder = existing?.featuredOrder ?? 0;
  if (data.featured && !existing?.featured) {
    const max = await prisma.work.aggregate({ _max: { featuredOrder: true } });
    featuredOrder = (max._max.featuredOrder ?? -1) + 1;
  }
  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    categoryId: data.categoryId,
    coverImageUrl: data.coverImageUrl ?? "",
    body: parseBody(data.body),
    featured: Boolean(data.featured),
    featuredOrder,
    published,
    publishedAt: published ? new Date() : null,
  };

  if (id) {
    await prisma.work.update({
      where: { id },
      data: {
        ...payload,
        publishedAt: published
          ? (existing?.publishedAt ?? new Date())
          : null,
      },
    });
  } else {
    await prisma.work.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin");
  revalidatePath("/admin/works");
  redirect("/admin/works");
}

export async function togglePublish(id: string) {
  await requireAdmin();
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) return;
  const published = !work.published;
  await prisma.work.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? (work.publishedAt ?? new Date()) : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin/works");
}

export async function deleteWork(id: string) {
  await requireAdmin();
  await prisma.work.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin/works");
}
