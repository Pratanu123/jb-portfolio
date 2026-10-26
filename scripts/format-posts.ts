import { PrismaClient, type Prisma } from "@prisma/client";
import { htmlToBody } from "../src/lib/article";
import { rowsToHtmlTable } from "../src/lib/sheet";
import { linkedIn } from "./portfolio/linkedin";

const prisma = new PrismaClient();

type Block =
  | { kind: "text"; text: string; level: 0 | 1 | 2 | 3 | 4 }
  | { kind: "html"; html: string };

function decode(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function collectText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const item = node as { type?: string; text?: string; content?: unknown[] };
  if (item.type === "text") return item.text ?? "";
  if (!Array.isArray(item.content)) return "";
  return item.content.map(collectText).join("");
}

function walkTable(node: unknown): string {
  const table = node as { content?: unknown[] };
  const rows = Array.isArray(table.content) ? table.content : [];
  const htmlRows = rows.map((row) => {
    const cells = Array.isArray((row as { content?: unknown[] }).content)
      ? (row as { content: unknown[] }).content
      : [];
    return `<tr>${cells
      .map((cell) => {
        const kind = (cell as { type?: string }).type === "tableHeader" ? "th" : "td";
        return `<${kind}>${escapeHtml(collectText(cell))}</${kind}>`;
      })
      .join("")}</tr>`;
  });
  return `<table>${htmlRows.join("")}</table>`;
}

function extractBlocks(body: unknown): Block[] {
  if (!body || typeof body !== "object") return [];
  const root = body as { type?: string; html?: string; content?: unknown[] };
  if (root.type === "html" && typeof root.html === "string") {
    const out: Block[] = [];
    const parts = root.html.split(/(<table[\s\S]*?<\/table>)/i);
    for (const part of parts) {
      if (/^<table/i.test(part)) {
        out.push({ kind: "html", html: part });
        continue;
      }
      part
        .split(/<\/(?:p|h[1-4]|li)>/i)
        .forEach((chunk) => {
          const heading = chunk.match(/<h([1-4])[^>]*>/i);
          const text = decode(
            chunk.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""),
          ).trim();
          if (!text) return;
          out.push({
            kind: "text",
            text,
            level: heading ? (Number(heading[1]) as 1 | 2 | 3 | 4) : 0,
          });
        });
    }
    return out;
  }
  const out: Block[] = [];
  function visit(node: unknown) {
    if (!node || typeof node !== "object") return;
    const item = node as { type?: string; attrs?: { level?: number }; content?: unknown[] };
    if (item.type === "table") {
      out.push({ kind: "html", html: walkTable(item) });
      return;
    }
    if (item.type === "heading") {
      out.push({
        kind: "text",
        text: collectText(item),
        level: (item.attrs?.level as 1 | 2 | 3 | 4) || 2,
      });
      return;
    }
    if (item.type === "paragraph") {
      const text = collectText(item);
      if (text.trim()) out.push({ kind: "text", text, level: 0 });
      return;
    }
    if (Array.isArray(item.content)) item.content.forEach(visit);
  }
  visit(body);
  return out;
}

function classify(text: string, current: 0 | 1 | 2 | 3 | 4): 0 | 1 | 2 | 3 | 4 {
  const t = text.replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean).length;
  const exact = t.replace(/[•·]\s*/, "");

  const title = [
    /^SAMPLE \d+/i,
    /^Title:/i,
    /^Band, Baja, Baraat/i,
    /^The Colours of Nature/i,
    /^XYZ Resort:/i,
    /^MEGA IPO LAUNCH$/i,
    /^XYZ PLATFORM$/i,
    /^EMAIL MARKETING CAMPAIGN$/i,
    /^LinkedIn Posts$/i,
    /^Corrected:/i,
    /^"Gar firdaus/i,
  ];
  if (
    /Fill the calendar|International festival Post|Indian festival Post|Cybersecurity Services -|Policy Checking Automation|assignment for you to proofread|The ad script should be|There will be only 1 speaker|^[•·]\s+\d+\s/i.test(
      t,
    )
  ) {
    return 0;
  }

  if (title.some((rule) => rule.test(t))) return 2;

  const heading = [
    /^[•·]\s.{0,70}$/,
    /^When skincare became/i,
    /^The ingredient parade$/i,
    /^Your skin didn't sign up/i,
    /^More products, more care/i,
    /^The price of feeling good/i,
    /^So, what does good skincare/i,
    /^Maybe the glow isn't/i,
    /^It Ends Here/i,
    /^A few words on their amenities$/i,
    /^What’s more\?$/i,
    /^What's more\?$/i,
    /^Reasons to choose a cloud firewall$/i,
    /^Conclusion$/i,
    /^The lessons your salary never taught you$/i,
    /^Start before the next surprise$/i,
    /^The Vibe Check!$/i,
    /^Key Highlights of XYZ Resort$/i,
    /^Where are we situated\?$/i,
    /^Opening Scene/i,
    /^D0:/i,
    /^D1:/i,
    /^D2:/i,
    /^D0 Push Notifications/i,
    /^D1 Push Notifications/i,
    /^D0 SMS Copies/i,
    /^D1 SMS Copies/i,
    /^D0 Emailer/i,
    /^D1 Emailer/i,
    /^D0 Banner/i,
    /^D1 Banner/i,
    /^D0 WhatsApp/i,
    /^D1 WhatsApp/i,
    /^Push Notification \d/i,
    /^WhatsApp Notification \d/i,
    /^SMS Copy \d/i,
    /^Emailer:$/i,
    /^Banner:$/i,
    /^NOTE:/i,
    /^Write an (ad script|article|SEO)/i,
    /^Write headlines/i,
    /^D\.\s*Write headlines/i,
    /^Choose A, AN, THE/i,
    /^Edit the following paragraph/i,
    /^Create \d /i,
    /^Objective:/i,
    /^An HR’s guide to handling/i,
    /^Feminism in India$/i,
    /^Is Cloud Firewall/i,
    /^A Hospital Bill Exposes/i,
    /^Case Study [12]$/i,
    /^So, here we go!$/i,
    /^US Open 2020:/i,
    /^Rhea Chakraborty lands in trouble/i,
    /^COVID declares war/i,
    /^What happens next is both surprising/i,
    /^A possibility:/i,
    /^Food for thought:/i,
    /^\d+\.\s+Thought of the day/i,
    /^\d+\.\s+Most successful leaders/i,
    /^\d+\.\s+Is the job of Human/i,
    /^\d+\.\s+Navigating/i,
    /^\d+\.\s+Struck between/i,
    /^\d+\.\s+“Am I draining/i,
    /^\d+\.\s+An HR’s guide/i,
    /^\d+\.\s+Feeling a little/i,
    /^\d+\.\s+Anxious, stressed/i,
    /^\d+\.\s+Speak up/i,
    /^\d+\.\s+Are we still keeping/i,
    /^\d+\.\s+Raising the youth/i,
  ];
  if (
    heading.some((rule) => rule.test(t) || rule.test(exact)) &&
    !/CTA \(|assignment for you|Fill the calendar/i.test(t)
  ) {
    return 2;
  }

  const subhead = [
    /^Let’s understand it hypothetically/i,
    /^But how does this happen/i,
    /^Picture the PPC ad/i,
    /^\d+\.\s+Picture the PPC/i,
    /^What really happened here/i,
    /^Is This Even Real\?$/i,
    /^\d+\.\s+The Engaging Email/i,
    /^The Engaging Email Campaign/i,
    /^What changed\?$/i,
    /^Dreamwalk Into Your Customer/i,
    /^Your Data is Your Darkhold/i,
    /^Avoid the Incursion/i,
    /^Avoid The Incursion/i,
    /^What’s All the Fuss/i,
    /^Scene \d/i,
    /^Dream-to-Reality Transition$/i,
    /^Closing Frame/i,
    /^Identity Protection$/i,
    /^Application Control$/i,
    /^Secure access by employees$/i,
    /^Reduced operational costs$/i,
    /^Easily Deployable/i,
    /^Scalability$/i,
    /^Real-time updates$/i,
    /^Disclaimer:/i,
    /^Experience the most heavenly/i,
    /^\d+\.\s+Novak/i,
    /^\d+\.\s+Rhea/i,
    /^\d+\.\s+The worldwide COVID/i,
    /^Target Audience:/i,
    /^Deliverables:/i,
    /^Tone of Voice:/i,
    /^Key Requirements:/i,
    /^Success Metric:/i,
    /^Thought of the day$/i,
    /^\d+\.\s+Saving isn't/i,
    /^\d+\.\s+Insurance isn't/i,
    /^\d+\.\s+Your budget needs/i,
    /^\d+\.\s+Debt has consequences/i,
    /^\d+\.\s+Financial literacy is about/i,
    /^1\. Services We Offer$/i,
    /^2\. Amenities We Have$/i,
    /^3\. Other Important Information$/i,
    /^Subject line:/i,
    /^Subject:/i,
  ];
  if (subhead.some((rule) => rule.test(t) || rule.test(exact))) return 3;

  const small = [
    /^The Movie Reference/i,
    /^The Marketing Parallel$/i,
    /^Narration$/i,
    /^Visual$/i,
    /^Text on screen$/i,
    /^Email body$/i,
    /^Duration:/i,
    /^Speaker:/i,
    /^Tone:/i,
    /^Format:/i,
    /^CTA:/i,
    /^Product:/i,
  ];
  if (small.some((rule) => rule.test(t))) return 4;

  if (current === 1) return 2;
  if (current === 4 && words > 18) return 3;
  return current;
}

function restoreBreaks(text: string) {
  return text
    .replace("Format: Animated explainer videoTarget audience:", "Format: Animated explainer video\nTarget audience:")
    .replace("intimidatingEstimated duration:", "intimidating\nEstimated duration:")
    .replace("1 min 43 secTone:", "1 min 43 sec\nTone:")
    .replace("Year 1: ₹11,000Year 2:", "Year 1: ₹11,000\nYear 2:")
    .replace("book for womenCampaign type:", "book for women\nCampaign type:")
    .replace("conversion sequenceAudience:", "conversion sequence\nAudience:")
    .replace("Warmly,The XYZ Team", "Warmly,\nThe XYZ Team");
}

function mergeWrappedTitles(blocks: Block[]) {
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const current = blocks[i];
    const next = blocks[i + 1];
    if (
      current.kind === "text" &&
      next?.kind === "text" &&
      current.text === "XYZ Resort: A Goodbye to the" &&
      next.text === "Past for a New and Joyous Beginning!"
    ) {
      out.push({
        kind: "text",
        text: `${current.text} ${next.text}`,
        level: 2,
      });
      i += 1;
      continue;
    }
    out.push(current);
  }
  return out;
}

function calendarTable() {
  const source = linkedIn.find((post) => post.title === "Content calendar");
  const table = source?.blocks.find((block) => block.type === "table");
  if (!table || table.type !== "table") return "";
  return rowsToHtmlTable([table.headers, ...table.rows]);
}

function toHtml(blocks: Block[]) {
  return blocks
    .map((block) => {
      if (block.kind === "html") return block.html;
      const text = escapeHtml(block.text).replace(/\n/g, "<br>");
      if (block.level === 2) return `<h2>${text}</h2>`;
      if (block.level === 3) return `<h3>${text}</h3>`;
      if (block.level === 4) return `<h4>${text}</h4>`;
      if (block.level === 1) return `<h2>${text}</h2>`;
      return `<p>${text}</p>`;
    })
    .join("");
}

async function main() {
  const works = await prisma.work.findMany({ orderBy: { title: "asc" } });
  for (const work of works) {
    const blocks = mergeWrappedTitles(
      extractBlocks(work.body)
        .filter((block) => block.kind !== "text" || !/^Sr\. NoPost Type/i.test(block.text))
        .map((block) => {
          if (block.kind !== "text") return block;
          const text = restoreBreaks(block.text);
          return { ...block, text, level: classify(text, block.level) };
        }),
    );
    if (work.title === "Content calendar" && !blocks.some((block) => block.kind === "html")) {
      const table = calendarTable();
      if (table) blocks.push({ kind: "html", html: table });
    }
    const html = toHtml(blocks);
    await prisma.work.update({
      where: { id: work.id },
      data: { body: htmlToBody(html) as Prisma.InputJsonValue },
    });
    const counts = blocks.reduce(
      (acc, block) => {
        if (block.kind !== "text") return acc;
        acc[block.level] += 1;
        return acc;
      },
      { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 } as Record<number, number>,
    );
    console.log(
      `${work.title}: H2 ${counts[2]} / H3 ${counts[3]} / H4 ${counts[4]} / P ${counts[0]}`,
    );
  }
}

main().finally(() => prisma.$disconnect());
