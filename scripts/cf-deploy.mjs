/**
 * Deploy OpenNext worker without Wrangler autoconfig (which re-runs a custom
 * build on Windows and deletes `.open-next/worker.js` before upload).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const worker = join(process.cwd(), ".open-next", "worker.js");
if (!existsSync(worker)) {
  console.error(`[cf-deploy] Missing ${worker}. Run the OpenNext build first.`);
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["wrangler", "deploy", "--autoconfig=false"],
  {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      OPEN_NEXT_DEPLOY: "true",
    },
  },
);

process.exit(result.status ?? 1);
