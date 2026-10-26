export type ParagraphBlock = {
  type?: "paragraph" | "heading";
  level?: 2 | 3 | 4;
  text: string;
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type Block = ParagraphBlock | TableBlock;

export type Post = {
  title: string;
  featured?: boolean;
  excerpt?: string;
  blocks: Block[];
};

export function p(text: string): Block {
  return { text };
}

export function h2(text: string): Block {
  return { type: "heading", level: 2, text };
}

export function h3(text: string): Block {
  return { type: "heading", level: 3, text };
}

export function table(headers: string[], rows: string[][]): TableBlock {
  return { type: "table", headers, rows };
}

function clean(text: string) {
  return text.replace(/\u000b/g, "\n").replace(/\u00a0/g, " ");
}

function cell(type: "tableHeader" | "tableCell", text: string) {
  const value = clean(text);
  return {
    type,
    content: [
      {
        type: "paragraph",
        content: value ? [{ type: "text", text: value }] : [],
      },
    ],
  };
}

export function excerptFrom(blocks: Block[]) {
  const first = blocks.find(
    (block): block is ParagraphBlock => block.type !== "table" && Boolean(block.text?.trim() && block.text.trim().length >= 8),
  );
  return clean(first?.text.trim() || "Portfolio piece.");
}

export function toDoc(blocks: Block[]) {
  const content = blocks
    .map((block) => {
      if (block.type === "table") {
        return {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: block.headers.map((header) => cell("tableHeader", header)),
            },
            ...block.rows.map((row) => ({
              type: "tableRow",
              content: row.map((value) => cell("tableCell", value)),
            })),
          ],
        };
      }
      const text = clean(block.text);
      if (!text.trim()) return null;
      if (block.type === "heading") {
        return {
          type: "heading",
          attrs: { level: block.level ?? 2 },
          content: [{ type: "text", text }],
        };
      }
      return {
        type: "paragraph",
        content: [{ type: "text", text }],
      };
    })
    .filter(Boolean);

  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }],
  };
}
