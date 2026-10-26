import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function outline(body: unknown, depth = 0): string {
  if (!body || typeof body !== "object") return String(body ?? "");
  const node = body as { type?: string; attrs?: { level?: number }; content?: unknown[]; text?: string; html?: string };
  if (node.type === "html" && typeof node.html === "string") {
    return node.html
      .replace(/<h([1-4])[^>]*>/gi, "\n[H$1] ")
      .replace(/<\/h[1-4]>/gi, "\n")
      .replace(/<p[^>]*>/gi, "\n[P] ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&rsquo;/g, "'")
      .replace(/&hellip;/g, "...")
      .replace(/&mdash;/g, "—")
      .replace(/&amp;/g, "&");
  }
  if (node.type === "text") return node.text ?? "";
  const kids = Array.isArray(node.content) ? node.content.map((child) => outline(child, depth + 1)).join("") : "";
  if (node.type === "heading") return `\n[H${node.attrs?.level ?? "?"}] ${kids}`;
  if (node.type === "paragraph") return `\n[P] ${kids}`;
  if (node.type === "table") return "\n[TABLE]";
  return kids;
}

async function main() {
  const works = await prisma.work.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
    include: { category: true },
  });
  for (const work of works) {
    const body = work.body as { type?: string } | null;
    console.log(`\n===== ${work.category.name} / ${work.title}  (${body?.type ?? typeof work.body}) =====`);
    console.log(outline(work.body).trim() || "(empty)");
  }
}

main().finally(() => prisma.$disconnect());
