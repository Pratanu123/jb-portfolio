import { generateHTML } from "@tiptap/html";
import { articleExtensions, isJsonContent } from "@/lib/tiptap";

export type HtmlBody = {
  type: "html";
  html: string;
};

export function isHtmlBody(value: unknown): value is HtmlBody {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as { type?: unknown }).type === "html" &&
      typeof (value as { html?: unknown }).html === "string",
  );
}

export const emptyBody: HtmlBody = { type: "html", html: "" };

export function htmlToBody(html: string): HtmlBody {
  return { type: "html", html };
}

export function bodyToHtml(body: unknown): string {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (isHtmlBody(body)) return body.html;
  if (isJsonContent(body) && body.type === "doc") {
    try {
      return generateHTML(body, articleExtensions);
    } catch {
      return "";
    }
  }
  return "";
}

export function renderArticleHtml(body: unknown) {
  return bodyToHtml(body);
}

export function articleHasTable(body: unknown) {
  const html = bodyToHtml(body);
  if (html.includes("<table") || html.includes("article-attachment")) return true;
  if (isJsonContent(body)) {
    const raw = JSON.stringify(body);
    return raw.includes('"type":"table"') || raw.includes('"type":"attachment"');
  }
  return false;
}

export function parseStoredBody(raw: string | undefined) {
  if (!raw) return emptyBody;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isHtmlBody(parsed)) return parsed;
    if (isJsonContent(parsed) && parsed.type === "doc") return parsed;
    if (typeof parsed === "string") return htmlToBody(parsed);
  } catch {
    if (raw.trim().startsWith("<")) return htmlToBody(raw);
  }
  return htmlToBody(raw);
}
