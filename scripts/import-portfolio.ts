import { PrismaClient, type Prisma } from "@prisma/client";
import { resolveMark } from "../src/lib/marks";
import { slugify } from "../src/lib/slug";
import { excerptFrom, toDoc, type Post } from "./portfolio/blocks";

const prisma = new PrismaClient();

type Shelf = {
  name: string;
  posts: Post[];
};

const covers = ["/covers/cover-1.svg", "/covers/cover-2.svg", "/covers/cover-3.svg"];

async function uniqueSlug(base: string) {
  let slug = slugify(base) || "work";
  let n = 1;
  while (await prisma.work.findUnique({ where: { slug } })) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
}

async function main() {
  const { featureWriting } = await import("./portfolio/feature-writing");
  const { scriptWriting } = await import("./portfolio/script-writing");
  const { articles } = await import("./portfolio/articles");
  const { multiChannel } = await import("./portfolio/multi-channel");
  const { socialMedia } = await import("./portfolio/social-media");
  const { linkedIn } = await import("./portfolio/linkedin");
  const { editing } = await import("./portfolio/editing");
  const { newsHeadlines } = await import("./portfolio/news-headlines");
  const { websiteCopy } = await import("./portfolio/website-copy");
  const { newsletter } = await import("./portfolio/newsletter");

  const data: Shelf[] = [
    { name: "Feature writing", posts: featureWriting },
    { name: "Script writing", posts: scriptWriting },
    { name: "Article", posts: articles },
    { name: "Multi-channel marketing communications", posts: multiChannel },
    { name: "Social media posts", posts: socialMedia },
    { name: "LinkedIN posts", posts: linkedIn },
    { name: "Editing & proofreading", posts: editing },
    { name: "News headlines", posts: newsHeadlines },
    { name: "Website copy", posts: websiteCopy },
    { name: "Newsletter", posts: newsletter },
  ];

  await prisma.work.deleteMany();
  await prisma.category.deleteMany();

  let coverIndex = 0;
  for (const [index, shelf] of data.entries()) {
    const slug = slugify(shelf.name) || `category-${index + 1}`;
    const category = await prisma.category.create({
      data: {
        name: shelf.name,
        slug,
        description: "",
        imageUrl: "",
        mark: resolveMark(undefined, slug),
        markImageUrl: "",
        accent: index % 2 === 0 ? "violet-red" : "teal-gold",
        sortOrder: index,
      },
    });

    for (const post of shelf.posts) {
      await prisma.work.create({
        data: {
          title: post.title,
          slug: await uniqueSlug(post.title),
          excerpt: post.excerpt?.trim() || excerptFrom(post.blocks),
          body: toDoc(post.blocks) as Prisma.InputJsonValue,
          coverImageUrl: covers[coverIndex % covers.length],
          featured: Boolean(post.featured),
          published: true,
          publishedAt: new Date(),
          categoryId: category.id,
        },
      });
      coverIndex += 1;
    }
  }

  const counts = await prisma.work.count();
  const cats = await prisma.category.count();
  console.log(`Imported ${cats} categories and ${counts} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

