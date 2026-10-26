import { Extension, Node, mergeAttributes, type JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

const INDENTABLE = ["paragraph", "heading", "blockquote", "callout"];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
    callout: {
      toggleCallout: (kind: "question" | "writeup") => ReturnType;
    };
  }
}

export const Indent = Extension.create({
  name: "indent",
  addGlobalAttributes() {
    return [
      {
        types: INDENTABLE,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => Number(element.getAttribute("data-indent") || 0),
            renderHTML: (attributes) => {
              const indent = Number(attributes.indent) || 0;
              if (!indent) return {};
              return { "data-indent": String(indent) };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ state, tr, dispatch }) => {
          let changed = false;
          state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
            if (!INDENTABLE.includes(node.type.name)) return;
            const next = Math.min((Number(node.attrs.indent) || 0) + 1, 8);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
            changed = true;
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
      outdent:
        () =>
        ({ state, tr, dispatch }) => {
          let changed = false;
          state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
            if (!INDENTABLE.includes(node.type.name)) return;
            const next = Math.max((Number(node.attrs.indent) || 0) - 1, 0);
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
            changed = true;
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
    };
  },
});

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      kind: {
        default: "question",
        parseHTML: (element) => element.getAttribute("data-callout") || "question",
        renderHTML: (attributes) => ({
          "data-callout": attributes.kind,
          class: `article-callout is-${attributes.kind}`,
        }),
      },
    };
  },
  parseHTML() {
    return [
      { tag: "aside.article-callout" },
      { tag: "aside[data-callout]" },
      { tag: "div.article-callout" },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleCallout:
        (kind) =>
        ({ editor, chain }) => {
          if (editor.isActive("callout")) {
            if (editor.getAttributes("callout").kind === kind) {
              return chain().focus().lift("callout").run();
            }
            return chain().focus().updateAttributes("callout", { kind }).run();
          }
          return chain().focus().wrapIn(this.name, { kind }).run();
        },
    };
  },
});

export const QuoteStyle = Extension.create({
  name: "quoteStyle",
  addGlobalAttributes() {
    return [
      {
        types: ["blockquote"],
        attributes: {
          variant: {
            default: "quote",
            parseHTML: (element) => element.getAttribute("data-quote") || "quote",
            renderHTML: (attributes) =>
              attributes.variant === "pull"
                ? { "data-quote": "pull", class: "is-pullquote" }
                : { "data-quote": "quote" },
          },
        },
      },
    ];
  },
});

export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        playsinline: "true",
        preload: "metadata",
      }),
    ];
  },
});

export const Audio = Node.create({
  name: "audio",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "audio[src]" }, { tag: "figure.article-audio audio[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    const { title, ...audio } = HTMLAttributes;
    return [
      "figure",
      { class: "article-audio" },
      [
        "audio",
        mergeAttributes(audio, {
          controls: "true",
          preload: "metadata",
        }),
      ],
      title ? ["figcaption", {}, String(title)] : ["figcaption", { class: "is-empty" }],
    ];
  },
});

export const Attachment = Node.create({
  name: "attachment",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("href") || element.getAttribute("src"),
      },
      name: {
        default: "Spreadsheet",
        parseHTML: (element) => element.getAttribute("data-name") || element.textContent || "Spreadsheet",
      },
      kind: {
        default: "sheet",
        parseHTML: (element) => element.getAttribute("data-kind") || "sheet",
      },
    };
  },
  parseHTML() {
    return [{ tag: "a.article-attachment" }];
  },
  renderHTML({ HTMLAttributes }) {
    const name = String(HTMLAttributes.name || "Download spreadsheet");
    return [
      "p",
      { class: "article-attachment-wrap" },
      [
        "a",
        mergeAttributes({
          href: HTMLAttributes.src,
          class: "article-attachment",
          download: name,
          "data-name": name,
          "data-kind": HTMLAttributes.kind || "sheet",
        }),
        name,
      ],
    ];
  },
});

export const articleExtensions = [
  StarterKit.configure({
    link: false,
    heading: { levels: [1, 2, 3, 4] },
  }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image.configure({ inline: false, allowBase64: false }),
  TableKit.configure({
    table: { resizable: true },
  }),
  Underline,
  TextStyleKit,
  TextAlign.configure({
    types: ["heading", "paragraph", "blockquote"],
  }),
  Highlight.configure({ multicolor: true }),
  Indent,
  QuoteStyle,
  Callout,
  Video,
  Audio,
  Attachment,
];

export function isJsonContent(value: unknown): value is JSONContent {
  return Boolean(value && typeof value === "object" && "type" in value);
}

export function articleHasTable(body: unknown) {
  if (!isJsonContent(body)) return false;
  const raw = JSON.stringify(body);
  return raw.includes('"type":"table"') || raw.includes('"type":"attachment"');
}

export function renderArticleHtml(body: unknown) {
  if (!isJsonContent(body)) return "";
  try {
    return generateHTML(body, articleExtensions);
  } catch {
    return "";
  }
}

export const emptyDoc: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export const EDITOR_FONTS = [
  { label: "Garamond", value: "" },
  { label: "Fell English", value: 'var(--font-display), "IM Fell English", serif' },
  { label: "Cinzel", value: "var(--font-heading), Cinzel, serif" },
  { label: "Script", value: "var(--font-script), Tangerine, cursive" },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Palatino", value: 'Palatino, "Palatino Linotype", serif' },
  { label: "Courier", value: '"Courier New", Courier, monospace' },
];

export const EDITOR_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "48px",
];

export const EDITOR_COLORS = [
  { label: "Cream", value: "#f4ead4" },
  { label: "Gold", value: "#e8c56b" },
  { label: "Process gold", value: "#f4b942" },
  { label: "Taupe", value: "#cfc3a8" },
  { label: "Muted gold", value: "#8a7340" },
  { label: "Crimson", value: "#ff2d55" },
  { label: "Teal", value: "#0d8a80" },
  { label: "Violet", value: "#8f1238" },
  { label: "Ink", value: "#07040c" },
];

export const EDITOR_HIGHLIGHTS = [
  { label: "Gold wash", value: "#ffe08a" },
  { label: "Cream", value: "#fff4e4" },
  { label: "Teal wash", value: "#9ee8dc" },
  { label: "Rose", value: "#ffc1cc" },
];
