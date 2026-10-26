import { spawnSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";
const onVercel = process.env.VERCEL === "1";
const isPostgres = /^postgres(ql)?:\/\//i.test(url);

if (onVercel && !isPostgres) {
  console.error(
    "Vercel deploy needs a Postgres DATABASE_URL (Neon or Vercel Postgres). Set it in the project Environment Variables, then redeploy.",
  );
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("node", ["scripts/sync-prisma-provider.mjs"]);
run("npx", ["prisma", "generate"]);

if (onVercel && isPostgres) {
  run("npx", ["prisma", "db", "push", "--skip-generate"]);
  run("npx", ["prisma", "db", "seed"]);
}
