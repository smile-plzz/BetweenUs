import type { Idea } from "./ideas";
import { starterIdeas, unsavedIdeas } from "./ideas";
import type { Snapshot } from "./model";
import { recommend, reasonText } from "./intelligence";
import { prompts } from "./prompts";

export type QuestionDraft = (typeof prompts)[number];
export interface HomeSuggestion {
  idea: Idea;
  reason: string;
  objectId?: string;
}

// Editorial links, not copied publisher text, trackers or claims about the couple.
export const readingAndVideos: Idea[] = [
  {
    id: "reading-awe-walk",
    title: "Notice a little more on your next walk",
    body: "Read Berkeley’s Awe Outing practice, then choose a familiar route together. Share one small thing each of you noticed.",
    intent: "do",
    source: "Greater Good in Action",
    source_url: "https://ggia.berkeley.edu/practice/awe_walk",
  },
  {
    id: "reading-three-good-things",
    title: "Share three small good things",
    body: "An optional reflection practice from Berkeley. Read it together and talk about a few moments you appreciated; there is no daily tracking or homework.",
    intent: "do",
    source: "Greater Good in Action",
    source_url: "https://ggia.berkeley.edu/practice/three-good-things",
  },
  {
    id: "video-good-life",
    title: "What makes a good life?",
    body: "Robert Waldinger’s TED talk about a long-running study of adult life. Watch together, then share a thought you want to keep.",
    intent: "watch",
    source: "TED",
    source_url:
      "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
  },
  {
    id: "video-something-new",
    title: "A small invitation to try something new",
    body: "Matt Cutts’s short TED talk. You could choose one small experiment together; no challenge, streak or commitment is required.",
    intent: "watch",
    source: "TED",
    source_url:
      "https://www.ted.com/talks/matt_cutts_try_something_new_for_30_days",
  },
];

function rotate<T>(items: T[], date: string, seed: string): T[] {
  if (!items.length) return [];
  let hash = 0;
  for (const char of `${date.slice(0, 10)}:${seed}`)
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const start = hash % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

export function homeSuggestions(data: Snapshot, catalogs: Idea[] = []) {
  const saved = data.objects.filter((o) => !o.hidden);
  const seed = data.space?.id ?? "";
  const activityIdeas = [
    ...new Map(
      ["do", "eat"]
        .flatMap((intent) =>
          [0, 1, 2].flatMap((day) =>
            starterIdeas(
              intent as "do" | "eat",
              new Date(
                Date.parse(data.server_time) + day * 86400000,
              ).toISOString(),
              seed,
            ),
          ),
        )
        .map((idea) => [idea.id, idea]),
    ).values(),
  ];
  const fromSaved = (categories: string[]): HomeSuggestion[] =>
    recommend(
      data.objects.filter((o) => categories.includes(o.category)),
      data.user.id,
      undefined,
      Date.parse(data.server_time),
    ).map(({ object, reasons }) => ({
      objectId: object.id,
      reason: reasons.map((r) => reasonText[r]).join(" · "),
      idea: {
        id: object.id,
        title: object.title,
        body: object.body
          ? object.body.length > 200
            ? `${object.body.slice(0, 197)}…`
            : object.body
          : "A possibility already in your shared space.",
        intent: object.category === "watch" ? "watch" : "do",
        source: "BetweenUs starters",
        source_url: object.source_url ?? "",
      },
    }));
  const fresh = (ideas: Idea[], reason: string): HomeSuggestion[] =>
    unsavedIdeas(ideas, saved).map((idea) => ({ idea, reason }));
  return {
    activities: [
      ...fromSaved(["do", "eat"]),
      ...fresh(activityIdeas, "A small activity to make your own"),
    ],
    media: [
      ...fromSaved(["watch"]),
      ...fresh(
        [...rotate(readingAndVideos, data.server_time, seed), ...catalogs],
        "A little reading or watching to explore together",
      ),
    ],
    questions: rotate(
      prompts.filter(
        (p) =>
          p.sensitivity === "ordinary" &&
          !data.questions.some((q) => q.prompt === p.prompt),
      ),
      data.server_time,
      seed,
    ).concat([
      {
        prompt: "What would you like to make room for together?",
        domain: "everyday",
        sensitivity: "ordinary",
      },
    ]),
    privateQuestions: prompts.filter(
      (p) => p.domain === "intimacy" && data.intimacy_active,
    ),
  };
}
