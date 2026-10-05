import type { SharedObject, Category } from "./model";
export type Reason =
  | "intent_match"
  | "both_positive"
  | "partner_saved"
  | "still_to_try"
  | "recent_save";
export const reasonText: Record<Reason, string> = {
  intent_match: "Saved for this kind of moment",
  both_positive: "You both liked this",
  partner_saved: "Your partner saved this",
  still_to_try: "Still something to try together",
  recent_save: "A recent shared idea",
};
export function recommend(
  objects: SharedObject[],
  userId: string,
  intent?: Category,
  now = Date.now(),
) {
  return objects
    .filter(
      (o) =>
        !o.hidden &&
        o.sensitivity === "ordinary" &&
        o.category !== "faith" &&
        o.category !== "intimacy" &&
        ["saved", "considering"].includes(o.status) &&
        (!intent || o.category === intent) &&
        !o.reactions.some((r) => r.reaction_type === "not_for_me"),
    )
    .map((object) => {
      const reasons: Reason[] = ["still_to_try"];
      let score = 1;
      if (intent) {
        reasons.push("intent_match");
        score += 3;
      }
      if (
        new Set(
          object.reactions
            .filter((r) => ["love", "interested"].includes(r.reaction_type))
            .map((r) => r.user_id),
        ).size === 2
      ) {
        reasons.push("both_positive");
        score += 5;
      }
      if (object.created_by !== userId) {
        reasons.push("partner_saved");
        score += 2;
      }
      if (now - Date.parse(object.created_at) < 7 * 86400000) {
        reasons.push("recent_save");
        score += 0.5;
      }
      return { object, reasons, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.object.created_at.localeCompare(b.object.created_at) ||
        a.object.id.localeCompare(b.object.id),
    )
    .slice(0, 3);
}
// Local metadata never fetches a URL or sends raw content to a provider.
export async function enrichLocally(sourceUrl: string) {
  if (!sourceUrl) return { enrichment: "not_needed" };
  const url = new URL(sourceUrl);
  return {
    source: url.hostname,
    confidence: 1,
    enrichment: "source_preserved",
  };
}

// Known-source evidence only. Unknown links stay unclassified; no content inference.
export function classifySource(sourceUrl: string): Category {
  if (!sourceUrl) return "other";
  let host: string;
  try {
    host = new URL(sourceUrl).hostname.toLowerCase();
  } catch {
    return "other";
  }
  const matches = (domain: string) =>
    host === domain || host.endsWith("." + domain);
  if (
    [
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "netflix.com",
      "imdb.com",
      "letterboxd.com",
    ].some(matches)
  )
    return "watch";
  if (["spotify.com", "soundcloud.com", "goodreads.com"].some(matches))
    return "listen";
  return "other";
}
