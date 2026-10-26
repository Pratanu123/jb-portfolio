import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const q = process.argv.slice(2).join(" ");
  const works = await prisma.work.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { title: "asc" },
    select: { title: true, slug: true, body: true },
  });
  for (const work of works) {
    const body = work.body as { type?: string; html?: string };
    const html = typeof body?.html === "string" ? body.html : "";
    console.log("\n========", work.title, "/", work.slug, "========");
    console.log(
      "table",
      /<table/i.test(html),
      "h2",
      (html.match(/<h2/gi) || []).length,
      "h3",
      (html.match(/<h3/gi) || []).length,
      "h4",
      (html.match(/<h4/gi) || []).length,
    );
    const outline = html
      .replace(/<table[\s\S]*?<\/table>/gi, "\n[TABLE]\n")
      .split(/<(h[1-4]|p)\b[^>]*>/i)
      .reduce<string[]>((acc, chunk, i, all) => {
        if (!/^(h[1-4]|p)$/i.test(chunk)) return acc;
        const text = decode(all[i + 1]?.replace(/<[^>]+>/g, "") ?? "").trim();
        if (!text) return acc;
        acc.push(`${chunk.toUpperCase()}  ${text.slice(0, 140)}`);
        return acc;
      }, []);
    console.log(outline.join("\n"));
  }
}

function decode(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

main().finally(() => prisma.$disconnect());
