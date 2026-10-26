export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml";
export const GIF_ACCEPT = "image/gif";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
export const AUDIO_ACCEPT =
  "audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac,audio/webm,.mp3,.wav,.ogg,.m4a,.aac";
export const SHEET_ACCEPT =
  ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";
export const MEDIA_ACCEPT = `${IMAGE_ACCEPT},${GIF_ACCEPT},${VIDEO_ACCEPT}`;

const VIDEO_EXT = [".mp4", ".webm", ".mov"];
const AUDIO_EXT = [".mp3", ".wav", ".ogg", ".m4a", ".aac"];
const SHEET_EXT = [".xlsx", ".xls", ".csv"];

function pathOf(src: string) {
  return src.split("?")[0].toLowerCase();
}

export function isVideoUrl(src: string) {
  const path = pathOf(src);
  return VIDEO_EXT.some((ext) => path.endsWith(ext));
}

export function isAudioUrl(src: string) {
  const path = pathOf(src);
  return AUDIO_EXT.some((ext) => path.endsWith(ext));
}

export function isSheetUrl(src: string) {
  const path = pathOf(src);
  return SHEET_EXT.some((ext) => path.endsWith(ext));
}

export function isGifUrl(src: string) {
  return pathOf(src).endsWith(".gif");
}

export function isSvgUrl(src: string) {
  return pathOf(src).endsWith(".svg");
}

export function mediaKind(src: string) {
  if (!src) return "empty";
  if (isVideoUrl(src)) return "video";
  if (isAudioUrl(src)) return "audio";
  if (isSheetUrl(src)) return "sheet";
  if (isGifUrl(src)) return "gif";
  return "image";
}

export async function uploadMediaFile(file: File) {
  const data = new FormData();
  data.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: data });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || typeof json.url !== "string") {
    throw new Error(json.error || "Upload failed");
  }
  return json.url;
}
