"use client";

import { useState } from "react";
import { SiteMedia } from "@/components/folio/SiteMedia";
import { MEDIA_ACCEPT, mediaKind, uploadMediaFile } from "@/lib/media";

type Props = {
  name?: string;
  initial?: string;
  previewClass?: string;
  contain?: boolean;
  allowPath?: boolean;
  hint?: string;
  onChange?: (url: string) => void;
};

export function CoverUpload({
  name = "coverImageUrl",
  initial = "",
  previewClass = "aspect-16/10 max-w-md",
  contain = false,
  allowPath = false,
  hint = "JPG, PNG, WebP, GIF, SVG, MP4, or WebM.",
  onChange,
}: Props) {
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const kind = mediaKind(url);

  function update(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function onFile(file: File) {
    setError("");
    setBusy(true);
    try {
      const next = await uploadMediaFile(file);
      update(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The file could not be received.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className={`relative overflow-hidden border border-violet/25 bg-black ${previewClass}`}>
          <SiteMedia
            src={url}
            alt=""
            fill
            objectFit={contain || kind === "video" || kind === "gif" ? "contain" : "cover"}
            sizes="400px"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center border border-dashed border-violet/30 bg-cream/40 text-sm text-ink/45 ${previewClass}`}
        >
          No media yet
        </div>
      )}
      {allowPath ? (
        <label className="block">
          <span className="label text-violet">Path or uploaded file</span>
          <input
            value={url}
            onChange={(event) => update(event.target.value)}
            className="field mt-2"
            placeholder="/hero/portrait-v6.gif"
          />
        </label>
      ) : null}
      <input
        type="file"
        accept={MEDIA_ACCEPT}
        className="field"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onFile(file);
        }}
      />
      <p className="text-sm text-ink/55">{hint}</p>
      {url ? (
        <button
          type="button"
          className="label text-crimson"
          onClick={() => {
            update("");
            setError("");
          }}
        >
          Remove media
        </button>
      ) : null}
      {busy ? <p className="text-sm italic">Receiving the file…</p> : null}
      {error ? <p className="text-crimson">{error}</p> : null}
    </div>
  );
}
