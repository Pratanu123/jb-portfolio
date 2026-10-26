import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const url = process.env.DATABASE_URL ?? "";
const provider = /^postgres(ql)?:\/\//i.test(url) ? "postgresql" : "sqlite";
const schemaPath = resolve(process.cwd(), "prisma/schema.prisma");
const schema = readFileSync(schemaPath, "utf8").replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`,
);

writeFileSync(schemaPath, schema);
console.log(`Prisma datasource provider: ${provider}`);
