import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import type { Snapshot } from "../src/domain/model";
let db: PGlite;
const a = randomUUID(),
  b = randomUUID(),
  c = randomUUID(),
  d = randomUUID();
async function as<T>(user: string, sql: string, args: unknown[] = []) {
  return db.transaction(async (tx) => {
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [
      user,
    ]);
    await tx.exec("set local role authenticated");
    return (await tx.query<T>(sql, args)).rows;
  });
}
async function act(
  user: string,
  action: string,
  payload: Record<string, unknown> = {},
) {
  return (
    await as<{ result: Record<string, string> }>(
      user,
      "select api_mutate($1,$2) as result",
      [action, payload],
    )
  )[0].result;
}
async function snap(user: string) {
  return (
    await as<{ result: Snapshot }>(user, "select api_snapshot() as result")
  )[0].result;
}
let space: string, item: string, card: string, token: string;
beforeAll(async () => {
  db = new PGlite();
  await db.waitReady;
  await db.exec(await readFile("db/local-bootstrap.sql", "utf8"));
  await db.exec(await readFile("db/schema.sql", "utf8"));
  for (const [u, name] of [
    [a, "A"],
    [b, "B"],
    [c, "C"],
    [d, "D"],
  ]) {
    await db.query("insert into auth.users values($1)", [u]);
    await act(u, "profile", { display_name: name, adult: true });
  }
});
afterAll(async () => {
  await db?.close();
});
describe("real PostgreSQL authorization and pilot flows", () => {
  it("denies anonymous table reads and RPC execution", async () => {
    await expect(
      db.transaction(async (tx) => {
        await tx.exec("set local role anon");
        await tx.query("select * from shared_objects");
      }),
    ).rejects.toThrow();
    await expect(
      db.transaction(async (tx) => {
        await tx.exec("set local role anon");
        await tx.query("select api_snapshot()");
      }),
    ).rejects.toThrow();
  });
  it("creates a one-member home with a scoped hashed invite", async () => {
    space = (await act(a, "create_space", { accepted: true })).space_id;
    token = (await act(a, "invite")).token;
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    const stored = await db.query<{ token_hash: string }>(
      "select token_hash from private.invites",
    );
    expect(stored.rows[0].token_hash).not.toBe(token);
    expect((await snap(a)).space?.id).toBe(space);
    expect((await snap(c)).space).toBeNull();
  });
  it("requires explicit shared contract, expires and revokes invites", async () => {
    await expect(act(b, "join", { token, accepted: false })).rejects.toThrow();
    await db.exec(
      "update private.invites set expires_at=now()-interval '1 second'",
    );
    await expect(act(b, "join", { token, accepted: true })).rejects.toThrow();
    token = (await act(a, "invite")).token;
    await act(a, "revoke_invite");
    await expect(act(b, "join", { token, accepted: true })).rejects.toThrow();
    token = (await act(a, "invite")).token;
  });
  it("pairs B, consumes invite, rejects replay and third members", async () => {
    await act(b, "join", { token, accepted: true });
    expect((await snap(b)).space?.id).toBe(space);
    expect((await snap(b)).members).toHaveLength(2);
    await expect(act(c, "join", { token, accepted: true })).rejects.toThrow();
    await expect(
      db.query(
        "insert into memberships(couple_space_id,user_id) values($1,$2)",
        [space, c],
      ),
    ).rejects.toThrow("Space is full");
    await expect(
      as(c, "insert into memberships(couple_space_id,user_id) values($1,$2)", [
        space,
        c,
      ]),
    ).rejects.toThrow();
    await expect(act(a, "create_space", { accepted: true })).rejects.toThrow();
  });
  it("isolates a second active CoupleSpace, not just an unpaired account", async () => {
    const other = (await act(c, "create_space", { accepted: true })).space_id;
    expect(other).not.toBe(space);
    await act(c, "capture", {
      kind: "note",
      title: "Other home",
      category: "other",
      sensitivity: "ordinary",
    });
    expect((await snap(a)).objects).toHaveLength(0);
  });
  it("persists capture, preserves source, lets A/B read, blocks guessed IDs for C", async () => {
    item = (
      await act(a, "capture", {
        kind: "url",
        title: "A real movie",
        body: "For our next evening",
        source_url: "https://example.com/movie",
        category: "watch",
        sensitivity: "ordinary",
      })
    ).id;
    await expect(
      act(a, "enrich", { id: randomUUID(), source: "unavailable" }),
    ).rejects.toThrow();
    expect((await snap(b)).objects[0].source_url).toBe(
      "https://example.com/movie",
    );
    expect(
      await as(c, "select * from shared_objects where id=$1", [item]),
    ).toHaveLength(0);
    expect(
      (await as(c, "select api_detail($1,$2) as result", [item, "object"]))[0],
    ).toEqual({ result: null });
    await expect(
      act(c, "reaction", { id: item, reaction_type: "love" }),
    ).rejects.toThrow();
    await expect(
      as(
        c,
        "insert into shared_objects(couple_space_id,kind,title,created_by) values($1,$2,$3,$4)",
        [space, "note", "attack", c],
      ),
    ).rejects.toThrow();
  });
  it("prevents actor spoofing and parent reassignment", async () => {
    await expect(
      as(
        a,
        "insert into shared_objects(couple_space_id,kind,title,created_by) values($1,$2,$3,$4)",
        [space, "note", "spoof", b],
      ),
    ).rejects.toThrow();
    await expect(
      as(
        a,
        "insert into reactions(object_id,user_id,reaction_type) values($1,$2,$3)",
        [item, b, "love"],
      ),
    ).rejects.toThrow();
    await expect(
      as(a, "update shared_objects set created_by=$1 where id=$2", [b, item]),
    ).rejects.toThrow();
    await expect(
      as(a, "update shared_objects set couple_space_id=$1 where id=$2", [
        randomUUID(),
        item,
      ]),
    ).rejects.toThrow();
  });
  it("keeps reactions independent and permits reversible disagreement", async () => {
    await act(a, "reaction", { id: item, reaction_type: "interested" });
    await act(b, "reaction", { id: item, reaction_type: "not_for_me" });
    expect((await snap(a)).objects[0].reactions).toHaveLength(2);
    await act(b, "reaction", { id: item, reaction_type: "love" });
    expect(
      (await snap(a)).objects[0].reactions.find((r) => r.user_id === a)
        ?.reaction_type,
    ).toBe("interested");
    await act(b, "reaction", { id: item, reaction_type: "remove" });
    expect((await snap(a)).objects[0].reactions).toHaveLength(1);
  });
  it("models unanswered, Answer, Pass, Not now independently; clears old answer payloads", async () => {
    card = (
      await act(a, "question", {
        prompt: "What shall we do?",
        domain: "everyday",
        sensitivity: "ordinary",
        prompt_source: "custom",
      })
    ).id;
    expect((await snap(b)).questions[0].responses).toHaveLength(0);
    await act(a, "response", { id: card, state: "answered", answer: "A walk" });
    await act(b, "response", {
      id: card,
      state: "passed",
      answer: "should not persist",
    });
    expect(
      (await snap(a)).questions[0].responses.find((r) => r.user_id === b),
    ).toEqual({ user_id: b, state: "passed", answer: null });
    await act(b, "response", { id: card, state: "not_now" });
    await act(b, "response", {
      id: card,
      state: "answered",
      answer: "A movie",
    });
    await expect(
      act(b, "response", { id: card, state: "answered", answer: " " }),
    ).rejects.toThrow();
    await expect(
      as(
        a,
        "insert into question_responses(question_card_id,user_id,state,answer) values($1,$2,$3,$4)",
        [card, b, "answered", "spoof"],
      ),
    ).rejects.toThrow();
    await expect(
      act(c, "response", {
        id: card,
        state: "answered",
        answer: "cross space",
      }),
    ).rejects.toThrow();
    await act(b, "response", { id: card, state: "unanswered" });
    expect((await snap(a)).questions[0].responses).toHaveLength(1);
    await act(a, "archive_question", { id: card });
    await expect(
      act(b, "response", { id: card, state: "not_now" }),
    ).rejects.toThrow();
  });
  it("sensitive text never appears in collection previews; detail is authorized", async () => {
    const secret = (
      await act(a, "capture", {
        kind: "note",
        title: "Sensitive title",
        body: "Private note fixture",
        category: "other",
        sensitivity: "private-couple",
      })
    ).id;
    const s = await snap(b);
    const redacted = s.objects.find((o) => o.id === secret)!;
    expect(redacted.title).toBe("Something shared between you");
    expect(redacted.body).toBeNull();
    expect(redacted.hidden).toBe(true);
    expect(JSON.stringify(s)).not.toContain("Private note fixture");
    expect(
      JSON.stringify(
        await as(b, "select api_detail($1,$2) as result", [secret, "object"]),
      ),
    ).toContain("Private note fixture");
    expect(
      await as(c, "select * from shared_objects where id=$1", [secret]),
    ).toHaveLength(0);
  });
  it("requires pilot flag AND both members to enable intimacy; revocation blocks detail and responses", async () => {
    const payload = {
      prompt: "Intimate fixture",
      domain: "intimacy",
      sensitivity: "explicit-intimate",
      prompt_source: "custom",
    };
    await expect(act(a, "question", payload)).rejects.toThrow();
    await db.exec("update private.features set intimacy_pilot=true");
    await act(a, "settings", { intimacy_enabled: true, faith_enabled: false });
    await expect(act(a, "question", payload)).rejects.toThrow();
    await act(b, "settings", { intimacy_enabled: true, faith_enabled: false });
    const intimate = (await act(a, "question", payload)).id;
    await act(b, "response", {
      id: intimate,
      state: "answered",
      answer: "Sensitive answer fixture",
    });
    expect(JSON.stringify(await snap(a))).not.toContain(
      "Sensitive answer fixture",
    );
    await act(a, "settings", { intimacy_enabled: false, faith_enabled: false });
    expect((await snap(b)).questions.some((q) => q.id === intimate)).toBe(
      false,
    );
    expect(
      (
        await as(b, "select api_detail($1,$2) as result", [
          intimate,
          "question",
        ])
      )[0],
    ).toEqual({ result: null });
    await expect(
      act(b, "response", { id: intimate, state: "answered", answer: "no" }),
    ).rejects.toThrow();
  });
  it("stores only structural telemetry and ordinary completion", async () => {
    const cols = await db.query<{ column_name: string }>(
      "select column_name from information_schema.columns where table_name='events'",
    );
    expect(cols.rows.map((r) => r.column_name)).toEqual([
      "id",
      "couple_space_id",
      "user_id",
      "name",
      "created_at",
    ]);
    await act(a, "status", { id: item, status: "done" });
    expect((await snap(b)).objects.find((o) => o.id === item)?.status).toBe(
      "done",
    );
  });
  it("leaving immediately revokes both members and allows a separate new home", async () => {
    await act(b, "leave", { confirm: "LEAVE" });
    expect((await snap(a)).space).toBeNull();
    expect((await snap(a)).objects).toHaveLength(0);
    expect(
      (await as(a, "select api_detail($1,$2) as result", [item, "object"]))[0],
    ).toEqual({ result: null });
    await expect(
      act(a, "reaction", { id: item, reaction_type: "love" }),
    ).rejects.toThrow();
    expect((await snap(c)).objects).toHaveLength(1);
    expect((await snap(c)).objects[0].title).toBe("Other home");
  });
});
