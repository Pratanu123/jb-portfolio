import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const images = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const videos = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const audios = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
]);

const sheets = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
  "text/plain",
]);

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/webm": "webm",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",
  "application/csv": "csv",
};

const IMAGE_LIMIT = 8 * 1024 * 1024;
const VIDEO_LIMIT = 40 * 1024 * 1024;
const AUDIO_LIMIT = 20 * 1024 * 1024;
const SHEET_LIMIT = 8 * 1024 * 1024;

type Kind = "image" | "video" | "audio" | "sheet";

function kindFromFile(file: File): Kind | null {
  if (images.has(file.type)) return "image";
  if (videos.has(file.type)) return "video";
  if (audios.has(file.type)) return "audio";
  if (sheets.has(file.type) && file.type !== "text/plain") return "sheet";

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac"].includes(ext)) return "audio";
  if (["xlsx", "xls", "csv"].includes(ext)) return "sheet";
  return null;
}

function limitFor(kind: Kind) {
  if (kind === "video") return VIDEO_LIMIT;
  if (kind === "audio") return AUDIO_LIMIT;
  if (kind === "sheet") return SHEET_LIMIT;
  return IMAGE_LIMIT;
}

function limitMessage(kind: Kind) {
  if (kind === "video") return "Videos need to stay under 40MB.";
  if (kind === "audio") return "Sound files need to stay under 20MB.";
  if (kind === "sheet") return "Spreadsheets need to stay under 8MB.";
  return "Images and GIFs need to stay under 8MB.";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const kind = kindFromFile(file);
  if (!kind) {
    return NextResponse.json(
      {
        error:
          "Use a JPG, PNG, WebP, GIF, SVG, MP4, WebM, MP3, WAV, OGG, M4A, XLSX, XLS, or CSV file.",
      },
      { status: 400 },
    );
  }

  if (file.size > limitFor(kind)) {
    return NextResponse.json({ error: limitMessage(kind) }, { status: 400 });
  }

  const fromName = file.name.split(".").pop()?.toLowerCase();
  const extension = extensions[file.type] || fromName || "bin";
  const filename = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
