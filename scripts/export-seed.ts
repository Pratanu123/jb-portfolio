import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const works = await prisma.work.findMany({
    include: { category: { select: { slug: true } } },
    orderBy: { createdAt: "asc" },
  });
  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  const payload = {
    categories: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      mark: category.mark,
      markImageUrl: category.markImageUrl,
      accent: category.accent,
      sortOrder: category.sortOrder,
    })),
    works: works.map((work) => ({
      title: work.title,
      slug: work.slug,
      excerpt: work.excerpt,
      body: work.body,
      coverImageUrl: work.coverImageUrl,
      featured: work.featured,
      featuredOrder: work.featuredOrder,
      published: work.published,
      publishedAt: work.publishedAt?.toISOString() ?? null,
      categorySlug: work.category.slug,
    })),
    settings,
  };

  const out = resolve(process.cwd(), "prisma/seed-data.json");
  writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Wrote ${payload.categories.length} categories, ${payload.works.length} works to ${out}`,
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
