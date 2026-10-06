import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

it("the hosted smoke checks execute and leave no synthetic users or couple data", async () => {
  const db = new PGlite();
  try {
    await db.waitReady;
    await db.exec(await readFile("db/local-bootstrap.sql", "utf8"));
    await db.exec(await readFile("db/schema.sql", "utf8"));
    await db.exec(await readFile("scripts/verify-hosted.sql", "utf8"));
    const result = await db.query<{ users: number; spaces: number }>(
      "select (select count(*)::int from auth.users) as users, (select count(*)::int from public.couple_spaces) as spaces",
    );
    expect(result.rows).toEqual([{ users: 0, spaces: 0 }]);
  } finally {
    await db.close();
  }
});
