import type { JSONContent } from "@tiptap/core";

const MAX_ROWS = 40;
const MAX_COLS = 16;

function cell(type: "tableHeader" | "tableCell", text: string): JSONContent {
  const value = String(text ?? "").replace(/\u000b/g, "\n");
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

export function rowsToTable(rows: string[][]): JSONContent {
  const width = Math.min(
    MAX_COLS,
    Math.max(1, ...rows.map((row) => row.length)),
  );
  const limited = (rows.length ? rows : [[""]]).slice(0, MAX_ROWS).map((row) => {
    return Array.from({ length: width }, (_, index) => row[index] ?? "");
  });
  const [header, ...body] = limited;
  return {
    type: "table",
    content: [
      {
        type: "tableRow",
        content: header.map((value) => cell("tableHeader", value)),
      },
      ...body.map((row) => ({
        type: "tableRow",
        content: row.map((value) => cell("tableCell", value)),
      })),
    ],
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function rowsToHtmlTable(rows: string[][]): string {
  const width = Math.min(
    MAX_COLS,
    Math.max(1, ...rows.map((row) => row.length)),
  );
  const limited = (rows.length ? rows : [[""]]).slice(0, MAX_ROWS).map((row) => {
    return Array.from({ length: width }, (_, index) => row[index] ?? "");
  });
  const [header, ...body] = limited;
  const head = `<tr>${header.map((value) => `<th>${escapeHtml(value)}</th>`).join("")}</tr>`;
  const rest = body
    .map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead>${head}</thead><tbody>${rest}</tbody></table>`;
}

export async function parseSpreadsheet(file: File) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const name = workbook.SheetNames[0];
  if (!name) throw new Error("That spreadsheet has no sheets.");
  const sheet = workbook.Sheets[name];
  const raw = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });
  const rows = raw.map((row) => row.map((value) => String(value ?? "")));
  if (!rows.length) throw new Error("That spreadsheet looks empty.");
  return {
    table: rowsToTable(rows),
    htmlTable: rowsToHtmlTable(rows),
    trimmed: rows.length > MAX_ROWS || rows.some((row) => row.length > MAX_COLS),
  };
}
