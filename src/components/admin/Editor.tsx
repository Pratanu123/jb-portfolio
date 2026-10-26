"use client";

import { useEffect, useId, useRef, useState } from "react";
import { bodyToHtml, htmlToBody } from "@/lib/article";
import { uploadMediaFile } from "@/lib/media";
import { parseSpreadsheet } from "@/lib/sheet";

type Props = {
  name: string;
  initial?: unknown;
};

type TinyEditor = {
  getContent: () => string;
  insertContent: (html: string) => void;
  formatter: {
    register: (name: string, format: Record<string, unknown>) => void;
    toggle: (name: string) => void;
  };
  ui: {
    registry: {
      addButton: (name: string, spec: { text: string; tooltip: string; onAction: () => void }) => void;
    };
  };
  on: (event: string, handler: () => void) => void;
  remove: () => void;
};

type TinyMCEApi = {
  init: (options: Record<string, unknown>) => Promise<TinyEditor[]> | void;
};

declare global {
  interface Window {
    tinymce?: TinyMCEApi;
  }
}

function loadTinyMce() {
  if (window.tinymce) return Promise.resolve(window.tinymce);
  const existing = document.querySelector<HTMLScriptElement>("script[data-tinymce]");
  if (existing) {
    return new Promise<TinyMCEApi>((resolve, reject) => {
      const done = () => {
        if (window.tinymce) resolve(window.tinymce);
        else reject(new Error("TinyMCE failed to load."));
      };
      existing.addEventListener("load", done);
      existing.addEventListener("error", () => reject(new Error("TinyMCE failed to load.")));
      if (window.tinymce) resolve(window.tinymce);
    });
  }
  return new Promise<TinyMCEApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    script.dataset.tinymce = "true";
    script.onload = () => {
      if (window.tinymce) resolve(window.tinymce);
      else reject(new Error("TinyMCE failed to load."));
    };
    script.onerror = () => reject(new Error("TinyMCE failed to load."));
    document.head.appendChild(script);
  });
}

export function Editor({ name, initial }: Props) {
  const fieldId = useId().replace(/:/g, "");
  const initialHtml = bodyToHtml(initial);
  const [html, setHtml] = useState(initialHtml);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const editorRef = useRef<TinyEditor | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const tinymce = await loadTinyMce();
        if (cancelled) return;
        const editors = await tinymce.init({
          selector: `#article-editor-${fieldId}`,
          license_key: "gpl",
          base_url: "/tinymce",
          suffix: ".min",
          height: 560,
          menubar: true,
          branding: false,
          promotion: false,
          resize: true,
          statusbar: true,
          browser_spellcheck: true,
          plugins:
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | question writeup blockquote | link image media table excel | hr removeformat | code fullscreen",
          block_formats: "Paragraph=p; Title=h1; Heading=h2; Subheading=h3; Small heading=h4",
          font_family_formats:
            "Garamond=EB Garamond, Georgia, serif; Fell English=IM Fell English, serif; Cinzel=Cinzel, serif; Georgia=Georgia, Times New Roman, serif; Palatino=Palatino, Palatino Linotype, serif; Courier=Courier New, Courier, monospace",
          font_size_formats: "12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 40px 48px",
          content_style: `
            body { font-family: Georgia, "Times New Roman", serif; font-size: 18px; line-height: 1.65; color: #1c1612; }
            h1 { font-size: 2.15rem; line-height: 1.2; margin: 1.1em 0 0.45em; }
            h2 { font-size: 1.65rem; line-height: 1.25; margin: 1.1em 0 0.45em; }
            h3 { font-size: 1.3rem; line-height: 1.3; margin: 1em 0 0.4em; }
            h4 { font-size: 1.12rem; line-height: 1.35; margin: 1em 0 0.4em; }
            blockquote { border-left: 3px solid #e8c56b; margin: 1.4rem 0; padding: 0.2rem 0 0.2rem 1rem; }
            aside.article-callout { margin: 1.4rem 0; padding: 1rem 1.1rem; border: 1px solid #d8c48a; }
            aside.article-callout.is-question { background: #fff6d8; border-left: 3px solid #c9a227; }
            aside.article-callout.is-writeup { background: #f4efe4; border-left: 3px solid #8a7340; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #c9b48a; padding: 0.55rem 0.7rem; text-align: left; vertical-align: top; }
            img, video { max-width: 100%; height: auto; }
            audio { width: 100%; }
          `,
          extended_valid_elements:
            "aside[class|data-callout],video[*],audio[*],source[*],figcaption[*],iframe[*],a[href|download|class|data-name|data-kind|target|rel]",
          valid_children: "+aside[h1|h2|h3|h4|p|div|ul|ol|blockquote]",
          automatic_uploads: true,
          images_file_types: "jpg,jpeg,png,gif,webp,svg",
          file_picker_types: "image media",
          images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
            const blob = blobInfo.blob();
            const file = new File([blob], blobInfo.filename(), {
              type: blob.type || "application/octet-stream",
            });
            return uploadMediaFile(file);
          },
          file_picker_callback: (
            callback: (url: string, meta?: Record<string, string>) => void,
            _value: string,
            meta: { filetype: string },
          ) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept =
              meta.filetype === "media" ? "video/*,audio/*" : "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              try {
                const url = await uploadMediaFile(file);
                callback(url, { title: file.name, alt: file.name });
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "The file could not be received.");
              }
            };
            input.click();
          },
          setup: (editor: TinyEditor) => {
            editor.on("init", () => {
              editor.formatter.register("question", {
                block: "aside",
                classes: "article-callout is-question",
                attributes: { "data-callout": "question" },
                wrapper: true,
              });
              editor.formatter.register("writeup", {
                block: "aside",
                classes: "article-callout is-writeup",
                attributes: { "data-callout": "writeup" },
                wrapper: true,
              });
            });
            editor.ui.registry.addButton("question", {
              text: "Question",
              tooltip: "Mark as a question",
              onAction: () => editor.formatter.toggle("question"),
            });
            editor.ui.registry.addButton("writeup", {
              text: "Write-up",
              tooltip: "Mark as a write-up",
              onAction: () => editor.formatter.toggle("writeup"),
            });
            editor.ui.registry.addButton("excel", {
              text: "Excel",
              tooltip: "Insert a spreadsheet as a table",
              onAction: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept =
                  ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  setError("");
                  setNote("");
                  try {
                    const parsed = await parseSpreadsheet(file);
                    const url = await uploadMediaFile(file);
                    editor.insertContent(
                      `${parsed.htmlTable}<p><a class="article-attachment" href="${url}" download="${file.name}" data-name="${file.name}" data-kind="sheet">${file.name}</a></p>`,
                    );
                    if (parsed.trimmed) {
                      setNote(
                        "The first 40 rows and 16 columns are in the table. The full sheet is attached to download.",
                      );
                    }
                  } catch (caught) {
                    setError(caught instanceof Error ? caught.message : "The file could not be received.");
                  }
                };
                input.click();
              },
            });
          },
        });
        if (cancelled) return;
        const editor = Array.isArray(editors) ? editors[0] : null;
        if (!editor) return;
        editorRef.current = editor;
        editor.on("change", () => setHtml(editor.getContent()));
        editor.on("input", () => setHtml(editor.getContent()));
        editor.on("undo", () => setHtml(editor.getContent()));
        editor.on("redo", () => setHtml(editor.getContent()));
        setReady(true);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "TinyMCE failed to load.");
        }
      }
    }

    void start();
    return () => {
      cancelled = true;
      editorRef.current?.remove();
      editorRef.current = null;
    };
  }, [fieldId]);

  return (
    <div className="editor-shell overflow-hidden">
      {!ready && !error ? (
        <p className="px-4 py-6 text-ink/55">Loading TinyMCE…</p>
      ) : null}
      <textarea id={`article-editor-${fieldId}`} defaultValue={initialHtml} className={ready ? "" : "hidden"} />
      {error ? <p className="px-4 py-2 text-crimson">{error}</p> : null}
      {note ? <p className="px-4 py-2 text-sm text-ink/60">{note}</p> : null}
      <p className="border-t border-violet/15 px-4 py-2 text-sm text-ink/50">
        Use the menus for titles, size, colour, tables, images, GIFs, video, sound, and Excel.
      </p>
      <input type="hidden" name={name} value={JSON.stringify(htmlToBody(html))} />
    </div>
  );
}
