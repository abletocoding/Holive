/**
 * OpenNext on Windows sometimes writes duplicate exports into
 * `.open-next/cloudflare/next-env.mjs`, which breaks `wrangler deploy`.
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const target = join(process.cwd(), ".open-next", "cloudflare", "next-env.mjs");

if (!existsSync(target)) {
  console.warn(`[fix-opennext-next-env] skip: missing ${target}`);
  process.exit(0);
}

const contents = `export const production = {};
export const development = {};
export const test = {};
`;

writeFileSync(target, contents, "utf8");
console.log(`[fix-opennext-next-env] normalized ${target}`);
