import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { defaultCopy } from "../src/lib/copy";

const prisma = new PrismaClient();

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  mark: string;
  markImageUrl: string;
  accent: string;
  sortOrder: number;
};

type SeedWork = {
  title: string;
  slug: string;
  excerpt: string;
  body: Prisma.InputJsonValue;
  coverImageUrl: string;
  featured: boolean;
  featuredOrder: number;
  published: boolean;
  publishedAt: string | null;
  categorySlug: string;
};

type SeedSettings = {
  id?: string;
  displayName: string;
  tagline: string;
  bio: string;
  about: string;
  aboutWords: string;
  contactEmail: string;
  websiteUrl: string;
  websiteLabel: string;
  polaroidPhoto: string;
  polaroidWrite: string;
  polaroidPaint: string;
  polaroidRead: string;
  heroImage: string;
  copy: Prisma.InputJsonValue;
  socials: Prisma.InputJsonValue;
};

type SeedPayload = {
  categories: SeedCategory[];
  works: SeedWork[];
  settings: SeedSettings | null;
};

function loadSeed(): SeedPayload {
  const file = resolve(process.cwd(), "prisma/seed-data.json");
  return JSON.parse(readFileSync(file, "utf8")) as SeedPayload;
}

async function main() {
  const existing = await prisma.work.count();
  if (existing > 0) {
    console.log(`Seed skipped: ${existing} works already present.`);
    return;
  }

  const data = loadSeed();

  await prisma.work.deleteMany();
  await prisma.category.deleteMany();

  const created = new Map<string, string>();
  for (const category of data.categories) {
    const row = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        mark: category.mark,
        markImageUrl: category.markImageUrl,
        accent: category.accent,
        sortOrder: category.sortOrder,
      },
    });
    created.set(row.slug, row.id);
  }

  for (const work of data.works) {
    const categoryId = created.get(work.categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug for work ${work.slug}: ${work.categorySlug}`);
    }
    await prisma.work.create({
      data: {
        title: work.title,
        slug: work.slug,
        excerpt: work.excerpt,
        body: work.body,
        coverImageUrl: work.coverImageUrl,
        featured: work.featured,
        featuredOrder: work.featuredOrder,
        published: work.published,
        publishedAt: work.publishedAt ? new Date(work.publishedAt) : null,
        categoryId,
      },
    });
  }

  const settings = data.settings;
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      displayName: settings?.displayName ?? "JB",
      tagline: settings?.tagline ?? "Words, wrought with care.",
      bio: settings?.bio ?? "",
      about: settings?.about ?? "",
      aboutWords: settings?.aboutWords ?? "",
      contactEmail: settings?.contactEmail ?? "",
      websiteUrl: settings?.websiteUrl ?? "https://inkandvoltage.com/",
      websiteLabel: settings?.websiteLabel ?? "Visit my website",
      polaroidPhoto: settings?.polaroidPhoto ?? "/hero/photo-v3.jpg",
      polaroidWrite: settings?.polaroidWrite ?? "/hero/write-v3.jpg",
      polaroidPaint: settings?.polaroidPaint ?? "/hero/paint-v3.jpg",
      polaroidRead: settings?.polaroidRead ?? "/hero/read-v3.jpg",
      heroImage: settings?.heroImage ?? "/hero/portrait-v6.gif",
      copy: settings?.copy ?? defaultCopy,
      socials: settings?.socials ?? [{ label: "LinkedIn", url: "https://www.linkedin.com" }],
    },
  });

  console.log(
    `Seeded ${data.categories.length} categories and ${data.works.length} works.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
