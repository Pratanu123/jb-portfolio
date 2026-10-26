"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { defaultCopy, type SiteCopy } from "@/lib/copy";
import { prisma } from "@/lib/prisma";
import type { SocialLink } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

const schema = z.object({
  displayName: z.string().min(1),
  tagline: z.string().min(2),
  bio: z.string().min(8),
  about: z.string().min(8),
  contactEmail: z.string().email(),
  websiteUrl: z.string().url("Use a full website address, starting with https://"),
  websiteLabel: z.string().min(2),
  heroImage: z.string().min(1),
});

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse({
    displayName: formData.get("displayName"),
    tagline: formData.get("tagline"),
    bio: formData.get("bio"),
    about: formData.get("about"),
    contactEmail: formData.get("contactEmail"),
    websiteUrl: formData.get("websiteUrl"),
    websiteLabel: formData.get("websiteLabel"),
    heroImage: String(formData.get("heroImage") || "").trim() || "/hero/portrait-v6.gif",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const labels = formData.getAll("socialLabel").map(String);
  const urls = formData.getAll("socialUrl").map(String);
  const socials: SocialLink[] = labels
    .map((label, index) => ({ label, url: urls[index] ?? "" }))
    .filter((item) => item.label.trim() && item.url.trim());

  const copy = { ...defaultCopy };
  for (const key of Object.keys(defaultCopy) as (keyof SiteCopy)[]) {
    const raw = formData.get(`copy_${key}`);
    if (raw == null) continue;
    const value = String(raw);
    if (
      key === "heroVoice" ||
      key === "heroStepJoin" ||
      key === "heroStep1" ||
      key === "heroStep2" ||
      key === "heroStep3" ||
      key === "heroStep4"
    ) {
      copy[key] = value;
      continue;
    }
    if (value.trim()) copy[key] = value;
  }

  const current = await prisma.settings.findUnique({ where: { id: "default" } });

  const mustReadIds = formData.getAll("mustReadId").map(String).filter(Boolean);
  const mustReadTitles = formData.getAll("mustReadTitle").map(String);
  const mustReadExcerpts = formData.getAll("mustReadExcerpt").map(String);
  const mustReadCovers = formData.getAll("mustReadCover").map(String);
  for (const [index, id] of mustReadIds.entries()) {
    if (!mustReadTitles[index]?.trim() || !mustReadExcerpts[index]?.trim()) {
      return { error: "Each Must read needs a title and preview." };
    }
    const exists = await prisma.work.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { error: "A Must read work is missing. Refresh and try again." };
  }

  await prisma.settings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...parsed.data,
      aboutWords: current?.aboutWords ?? "",
      polaroidPhoto: current?.polaroidPhoto ?? "/hero/photo-v3.jpg",
      polaroidWrite: current?.polaroidWrite ?? "/hero/write-v3.jpg",
      polaroidPaint: current?.polaroidPaint ?? "/hero/paint-v3.jpg",
      polaroidRead: current?.polaroidRead ?? "/hero/read-v3.jpg",
      socials,
      copy,
    },
    update: { ...parsed.data, socials, copy },
  });

  await prisma.work.updateMany({ data: { featured: false } });
  for (const [index, id] of mustReadIds.entries()) {
    await prisma.work.update({
      where: { id },
      data: {
        featured: true,
        featuredOrder: index,
        title: mustReadTitles[index].trim(),
        excerpt: mustReadExcerpts[index].trim(),
        coverImageUrl: mustReadCovers[index] ?? "",
      },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/works");
  return { ok: true };
}
