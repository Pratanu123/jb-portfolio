import { defaultCopy, mergeCopy } from "@/lib/copy";
import { prisma } from "@/lib/prisma";
import { parseSocials } from "@/lib/types";

export const defaultAboutWords = [
  "write",
  "houses",
  "ateliers",
  "people",
  "believe",
  "sentence",
  "change",
  "temperature",
  "room",
  "work",
  "research",
  "ornament",
  "facts",
  "filigree",
  "stories",
];

export function parseAboutWords(value: string | null | undefined) {
  return String(value ?? "")
    .split(/[\n,]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

const defaultSettings = {
  id: "default",
  displayName: "JB",
  tagline: "Words, wrought with care.",
  bio: "A content writer of brand stories, letters, and long arguments.",
  about:
    "I write for houses, ateliers, and people who still believe a sentence can change the temperature of a room.",
  aboutWords: defaultAboutWords.join("\n"),
  contactEmail: "hello@jb.example",
  websiteUrl: "https://inkandvoltage.com/",
  websiteLabel: "Visit my website",
  polaroidPhoto: "/hero/photo-v3.jpg",
  polaroidWrite: "/hero/write-v3.jpg",
  polaroidPaint: "/hero/paint-v3.jpg",
  polaroidRead: "/hero/read-v3.jpg",
  heroImage: "/hero/portrait-v6.gif",
  copy: defaultCopy,
  socials: [{ label: "LinkedIn", url: "https://www.linkedin.com" }],
};

export async function getSettings() {
  const row =
    (await prisma.settings.findUnique({ where: { id: "default" } })) ??
    (await prisma.settings.create({
      data: {
        ...defaultSettings,
        socials: defaultSettings.socials,
        copy: defaultSettings.copy,
      },
    }));

  return {
    ...row,
    websiteUrl: row.websiteUrl || defaultSettings.websiteUrl,
    websiteLabel: row.websiteLabel || defaultSettings.websiteLabel,
    polaroidPhoto: row.polaroidPhoto || defaultSettings.polaroidPhoto,
    polaroidWrite: row.polaroidWrite || defaultSettings.polaroidWrite,
    polaroidPaint: row.polaroidPaint || defaultSettings.polaroidPaint,
    polaroidRead: row.polaroidRead || defaultSettings.polaroidRead,
    heroImage: row.heroImage || defaultSettings.heroImage,
    aboutWords: parseAboutWords(row.aboutWords).length
      ? parseAboutWords(row.aboutWords)
      : defaultAboutWords,
    aboutWordsText: row.aboutWords?.trim()
      ? row.aboutWords
      : defaultAboutWords.join("\n"),
    socials: parseSocials(row.socials),
    copy: mergeCopy(row.copy),
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { works: { where: { published: true } } },
      },
    },
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { works: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      works: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      },
    },
  });
}

export async function getPublishedWorks(options?: {
  categorySlug?: string;
  query?: string;
  featured?: boolean;
}) {
  return prisma.work.findMany({
    where: {
      published: true,
      ...(options?.featured ? { featured: true } : {}),
      ...(options?.categorySlug
        ? { category: { slug: options.categorySlug } }
        : {}),
      ...(options?.query
        ? {
            OR: [
              { title: { contains: options.query } },
              { excerpt: { contains: options.query } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: options?.featured
      ? [{ featuredOrder: "asc" }, { publishedAt: "desc" }]
      : { publishedAt: "desc" },
  });
}

export async function getMustReadOptions() {
  return prisma.work.findMany({
    where: { published: true },
    include: { category: { select: { name: true } } },
    orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getWorkBySlug(slug: string) {
  return prisma.work.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
}

export async function getAdminWorks() {
  return prisma.work.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAdminWork(id: string) {
  return prisma.work.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getAdminStats() {
  const [works, published, drafts, categories] = await Promise.all([
    prisma.work.count(),
    prisma.work.count({ where: { published: true } }),
    prisma.work.count({ where: { published: false } }),
    prisma.category.count(),
  ]);
  const recent = await prisma.work.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
  return { works, published, drafts, categories, recent };
}
