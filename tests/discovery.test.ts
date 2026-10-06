import { describe, expect, it, vi } from "vitest";
import { starterIdeas, ideaCapture, unsavedIdeas } from "../src/domain/ideas";
import { mutation } from "../src/domain/validation";
import { catalogIdeas, discoverIdeas } from "../src/server/discovery";

const shows = [
  {
    show: {
      id: 768,
      name: "Planet Earth",
      type: "Documentary",
      url: "javascript:bad",
    },
  },
  { show: { id: 1, name: "A fictional show", type: "Scripted" } },
];
describe("finite, attributable discovery", () => {
  it("rotates three distinct local starter ideas without creating fake shared history", () => {
    const today = starterIdeas("do", "2026-10-06T12:00:00Z", "space");
    expect(today).toHaveLength(3);
    expect(new Set(today.map((i) => i.id)).size).toBe(3);
    expect(starterIdeas("do", "2026-10-06T20:00:00Z", "space")).toEqual(today);
    expect(starterIdeas("do", "2026-10-07", "space")).not.toEqual(today);
    for (const idea of today) {
      const capture = mutation.parse(ideaCapture(idea));
      expect(capture).toMatchObject({
        action: "capture",
        category: "do",
        sensitivity: "ordinary",
        kind: "idea",
      });
      expect(capture).not.toHaveProperty("created_by");
    }
  });
  it("constructs source URLs from validated IDs, filters documentary type, and preserves attribution", () => {
    const [idea] = catalogIdeas("watch", shows);
    expect(idea.source_url).toBe("https://www.tvmaze.com/shows/768");
    expect(catalogIdeas("watch", shows)).toHaveLength(1);
    expect(ideaCapture(idea)).toMatchObject({
      source_url: idea.source_url,
      kind: "url",
      category: "watch",
    });
    expect(idea.body).toContain("CC BY-SA");
    expect(() =>
      catalogIdeas("do", {
        works: [{ key: "https://evil.example", title: "Unsafe" }],
      }),
    ).toThrow();
    expect(() =>
      catalogIdeas("watch", [
        { show: { id: 1, name: "<script>bad</script>", type: "Documentary" } },
      ]),
    ).toThrow();
  });
  it("fetches only a fixed public query, with timeout, redirect blocking and caching", async () => {
    const fetcher = vi.fn(async () => Response.json(shows));
    const result = await discoverIdeas(
      "watch",
      new Date("2026-10-06"),
      fetcher,
      true,
    );
    expect(result.origin).toBe("public_catalog");
    expect(result.ideas).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.tvmaze.com/search/shows?q=planet%20earth",
      expect.objectContaining({
        redirect: "error",
        next: { revalidate: 21600 },
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );
    expect(
      unsavedIdeas(result.ideas, [
        { title: "Other title", source_url: result.ideas[0].source_url },
      ]),
    ).toEqual([]);
  });
  it("limits a validated book catalog to three choices and does not claim free borrowing", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        works: Array.from({ length: 8 }, (_, n) => ({
          key: `/works/OL${n + 1}W`,
          title: `Book ${n}`,
          authors: [{ name: "An author" }],
        })),
      }),
    );
    const result = await discoverIdeas(
      "do",
      new Date("2026-10-06"),
      fetcher,
      true,
    );
    expect(result.ideas).toHaveLength(3);
    expect(result.ideas[0].body).toContain("not guaranteed");
    expect(result.ideas[0].source_url).toMatch(
      /^https:\/\/openlibrary.org\/works\/OL[0-9]+W$/,
    );
  });
  it("provider outage, malformed data, and oversized responses all fall back without blocking capture", async () => {
    for (const fetcher of [
      async () => {
        throw new Error("offline");
      },
      async () => Response.json({ unexpected: true }),
      async () => new Response("x".repeat(128001)),
      async () => new Response("rate limited", { status: 429 }),
    ]) {
      const result = await discoverIdeas(
        "watch",
        new Date("2026-10-06"),
        fetcher,
        true,
      );
      expect(result.origin).toBe("curated");
      expect(result.ideas).toHaveLength(3);
      expect(mutation.safeParse(ideaCapture(result.ideas[0])).success).toBe(
        true,
      );
    }
  });
  it("curated-only mode and food ideas never contact a provider", async () => {
    const fetcher = vi.fn();
    expect((await discoverIdeas("do", new Date(), fetcher, false)).origin).toBe(
      "curated",
    );
    expect((await discoverIdeas("eat", new Date(), fetcher, true)).origin).toBe(
      "curated",
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});
