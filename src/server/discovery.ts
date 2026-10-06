import { z } from "zod";
import {
  starterIdeas,
  type Idea,
  type IdeaIntent,
  type IdeaSet,
} from "@/domain/ideas";

const text = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .refine((v) => !/[<>\u0000-\u001f]/.test(v));
const shows = z
  .array(
    z.object({
      show: z.object({
        id: z.number().int().positive(),
        name: text,
        type: z.string(),
      }),
    }),
  )
  .max(100);
const books = z.object({
  works: z
    .array(
      z.object({
        key: z.string().regex(/^\/works\/OL[0-9]+W$/),
        title: text,
        authors: z
          .array(z.object({ name: text }))
          .max(20)
          .optional(),
      }),
    )
    .max(100),
});

// Fixed public catalog requests. No URLs, names, IDs, preferences or couple text from clients.
const endpoints = {
  watch: "https://api.tvmaze.com/search/shows?q=planet%20earth",
  do: "https://openlibrary.org/subjects/classic_literature.json?limit=18",
} as const;
type CatalogFetch = (
  url: string,
  init: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;

async function boundedJson(response: Response) {
  if (!response.ok || !response.body) throw new Error("Catalog unavailable");
  const reader = response.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 128_000) throw new Error("Catalog exceeds budget");
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    await reader.cancel();
  }
}

export function catalogIdeas(intent: "watch" | "do", data: unknown): Idea[] {
  if (intent === "watch")
    return shows
      .parse(data)
      .filter(({ show }) => show.type === "Documentary")
      .map(({ show }) => ({
        id: `tvmaze-${show.id}`,
        title: show.name,
        body: "A nature-documentary catalog suggestion. Check the description, age rating and current viewing availability together. TVMaze data: CC BY-SA.",
        intent,
        source: "TVMaze",
        source_url: `https://www.tvmaze.com/shows/${show.id}`,
      }));
  return books.parse(data).works.map((book) => ({
    id: `openlibrary-${book.key.split("/").pop()}`,
    title: `Read a little: ${book.title}`.slice(0, 180),
    body: `${book.authors?.[0] ? `By ${book.authors[0].name}. ` : ""}Choose a few pages to read side by side. This is a book-catalog suggestion; a free copy or borrowing availability is not guaranteed.`,
    intent,
    source: "Open Library",
    source_url: `https://openlibrary.org${book.key}`,
  }));
}

export async function discoverIdeas(
  intent: IdeaIntent,
  now = new Date(),
  fetcher: CatalogFetch = fetch,
  enabled = process.env.BETWEENUS_DISCOVERY !== "curated",
): Promise<IdeaSet> {
  const checked_at = now.toISOString();
  if (enabled && intent !== "eat") {
    try {
      const response = await fetcher(endpoints[intent], {
        signal: AbortSignal.timeout(4000),
        redirect: "error",
        next: { revalidate: 21600 },
        headers: {
          Accept: "application/json",
          "User-Agent":
            "BetweenUs/1.0 (+https://github.com/smile-plzz/BetweenUs)",
        },
      });
      const all = catalogIdeas(intent, await boundedJson(response));
      const unique = [...new Map(all.map((idea) => [idea.id, idea])).values()];
      if (unique.length) {
        const offset = Math.floor(now.getTime() / 86400000) % unique.length;
        const ideas = Array.from(
          { length: Math.min(3, unique.length) },
          (_, i) => unique[(offset + i) % unique.length],
        );
        return { ideas, origin: "public_catalog", checked_at };
      }
    } catch {
      /* Quiet, content-free failure: starter ideas and capture still work. */
    }
  }
  return {
    ideas: starterIdeas(intent, checked_at),
    origin: "curated",
    checked_at,
  };
}
