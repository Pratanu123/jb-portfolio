import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "node_modules", "tinymce");
const dest = join(process.cwd(), "public", "tinymce");

if (!existsSync(src)) {
  console.warn("tinymce is not installed; skip copy");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
