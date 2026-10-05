import { describe, it, expect } from "vitest";
import {
  recommend,
  reasonText,
  enrichLocally,
  classifySource,
} from "../src/domain/intelligence";
import {
  preview,
  externalProcessingAllowed,
  responsePayload,
} from "../src/domain/privacy";
import { mutation } from "../src/domain/validation";
import type { SharedObject } from "../src/domain/model";
const now = Date.parse("2026-10-05T12:00:00Z");
function item(id: string, patch: Partial<SharedObject> = {}): SharedObject {
  return {
    id,
    created_by: "A",
    created_at: "2026-09-01T12:00:00Z",
    kind: "idea",
    title: "A saved possibility",
    body: null,
    source_url: null,
    category: "watch",
    status: "saved",
    sensitivity: "ordinary",
    hidden: false,
    reactions: [],
    metadata: {},
    ...patch,
  };
}
describe("finite, factual recommendations", () => {
  it("classifies only known source hosts without fetching or guessing facts", () => {
    expect(classifySource("https://www.youtube.com/watch?v=film")).toBe(
      "watch",
    );
    expect(classifySource("https://open.spotify.com/track/song")).toBe(
      "listen",
    );
    expect(classifySource("https://youtube.com.attacker.test/path")).toBe(
      "other",
    );
    expect(classifySource("https://example.com/restaurant")).toBe("other");
  });
  it("ranks mutual signals and a partner save without collapsing individual reactions", () => {
    const mutual = item("mutual", {
      created_by: "B",
      reactions: [
        { user_id: "A", reaction_type: "love" },
        { user_id: "B", reaction_type: "interested" },
      ],
    });
    const ranked = recommend([item("neutral"), mutual], "A", "watch", now);
    expect(ranked[0].object.id).toBe("mutual");
    expect(ranked[0].reasons).toEqual([
      "still_to_try",
      "intent_match",
      "both_positive",
      "partner_saved",
    ]);
    expect(ranked[1].reasons).not.toContain("both_positive");
    for (const reason of ranked[0].reasons)
      expect(reasonText[reason]).toBeTruthy();
  });
  it("never recommends declined, completed, hidden, intimate, faith, or mismatched objects", () => {
    const objects = [
      item("done", { status: "done" }),
      item("no", {
        reactions: [{ user_id: "B", reaction_type: "not_for_me" }],
      }),
      item("intimate", { sensitivity: "explicit-intimate" }),
      item("faith", { category: "faith" }),
      item("hidden", { hidden: true }),
      item("food", { category: "eat" }),
      item("ordinary"),
    ];
    expect(
      recommend(objects, "A", "watch", now).map((x) => x.object.id),
    ).toEqual(["ordinary"]);
  });
  it("returns at most three, deterministic ties, and gracefully returns empty", () => {
    expect(
      recommend(
        ["d", "b", "c", "a"].map((id) => item(id)),
        "A",
        "watch",
        now,
      ).map((x) => x.object.id),
    ).toEqual(["a", "b", "c"]);
    expect(recommend([], "A", "watch", now)).toEqual([]);
  });
  it("only uses recency when supported by the stored timestamp", () => {
    const recent = item("recent", { created_at: "2026-10-04T12:00:00Z" });
    expect(
      recommend([recent, item("old")], "A", "watch", now)[0].reasons,
    ).toContain("recent_save");
    expect(
      recommend([item("old")], "A", "watch", now)[0].reasons,
    ).not.toContain("recent_save");
  });
});
describe("discretion and validation", () => {
  it("redacts every notification and every sensitive collection preview", () => {
    for (const sensitivity of [
      "ordinary",
      "private-couple",
      "explicit-intimate",
    ] as const) {
      expect(
        preview(sensitivity, "private fixture", "notification"),
      ).not.toContain("private fixture");
      expect(externalProcessingAllowed(sensitivity)).toBe(
        sensitivity === "ordinary",
      );
    }
    expect(
      preview("explicit-intimate", "private fixture", "collection"),
    ).not.toContain("private fixture");
    expect(preview("ordinary", "a film", "collection")).toBe("a film");
  });
  it("Pass and Not now remove answer text and no response is a real absence", () => {
    expect(responsePayload("answered", "  A walk  ")).toBe("A walk");
    expect(responsePayload("passed", "old text")).toBeNull();
    expect(responsePayload("not_now", "old text")).toBeNull();
  });
  it("rejects spoofed actor fields, unsafe protocols, and blank answers", () => {
    expect(
      mutation.safeParse({
        action: "capture",
        title: "thing",
        kind: "url",
        source_url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
    expect(
      mutation.safeParse({
        action: "capture",
        title: "thing",
        kind: "idea",
        created_by: "partner",
      }).success,
    ).toBe(false);
    expect(
      mutation.safeParse({
        action: "response",
        id: "00000000-0000-4000-8000-000000000001",
        state: "answered",
        answer: " ",
      }).success,
    ).toBe(false);
  });
  it("enrichment preserves a source without fetching it", async () => {
    expect(await enrichLocally("https://example.com/thing")).toEqual({
      source: "example.com",
      confidence: 1,
      enrichment: "source_preserved",
    });
    await expect(enrichLocally("bad url")).rejects.toThrow();
  });
});

describe("migration consistency", () => {
  it("runs the same SQL in development and the production migration", async () => {
    const { readFile } = await import("node:fs/promises");
    const schema = await readFile("db/schema.sql", "utf8");
    const migration = await readFile(
      "supabase/migrations/20261005075912_betweenus_foundation.sql",
      "utf8",
    );
    expect(migration).toBe(schema);
  });
});
