"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MARK, isMarkKey } from "@/lib/marks";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

const schema = z.object({
  name: z.string().min(2, "Name is too short."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  mark: z.string().optional(),
  markImageUrl: z.string().optional(),
  accent: z.enum(["violet-red", "teal-gold"]),
});

function categoryFields(data: z.infer<typeof schema>) {
  return {
    name: data.name,
    description: data.description ?? "",
    imageUrl: data.imageUrl ?? "",
    mark: data.mark && isMarkKey(data.mark) ? data.mark : DEFAULT_MARK,
    markImageUrl: data.markImageUrl ?? "",
    accent: data.accent,
  };
}

function readCategory(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
    mark: String(formData.get("mark") || "").trim(),
    markImageUrl: String(formData.get("markImageUrl") || "").trim(),
    accent: formData.get("accent") || "violet-red",
  });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = readCategory(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const last = await prisma.category.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  const base = slugify(parsed.data.name) || "category";
  let slug = base;
  let n = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n += 1;
  }

  await prisma.category.create({
    data: {
      ...categoryFields(parsed.data),
      slug,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = readCategory(formData);
  if (!id || !parsed.success) {
    return { error: parsed.success ? "Missing category." : parsed.error.issues[0]?.message };
  }
  await prisma.category.update({
    where: { id },
    data: categoryFields(parsed.data),
  });
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.work.count({ where: { categoryId: id } });
  if (count > 0) {
    return { error: "Move or delete the works in this category first." };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
}

export async function moveCategory(id: string, direction: "up" | "down") {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const index = categories.findIndex((item) => item.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= categories.length) return;

  const current = categories[index];
  const other = categories[swapWith];
  await prisma.$transaction([
    prisma.category.update({
      where: { id: current.id },
      data: { sortOrder: other.sortOrder },
    }),
    prisma.category.update({
      where: { id: other.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
}
