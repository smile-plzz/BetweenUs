import { rm } from "node:fs/promises";
import { resolve } from "node:path";
const path = resolve(process.env.LOCAL_DATABASE_PATH || ".local/betweenus");
if (!path.startsWith(resolve(".local") + "/"))
  throw new Error("Reset only allows a database inside .local/.");
if (!process.argv.includes("--confirm"))
  throw new Error(
    "Stop the server, then run npm run db:reset -- --confirm to erase local development data.",
  );
await rm(path, { recursive: true, force: true });
console.log("Local development database reset.");
