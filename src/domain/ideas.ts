import type { Mutation } from "./validation";

export type IdeaIntent = "watch" | "eat" | "do";
export interface Idea {
  id: string;
  title: string;
  body: string;
  intent: IdeaIntent;
  source: "BetweenUs starters" | "TVMaze" | "Open Library";
  source_url: string;
}
export interface IdeaSet {
  ideas: Idea[];
  origin: "public_catalog" | "curated";
  checked_at: string;
}

const starters: Record<IdeaIntent, [string, string][]> = {
  do: [
    [
      "Take a little photo walk",
      "Choose a familiar route. Each find three small things you would normally walk past, then show each other your photos.",
    ],
    [
      "Make a tiny listening session",
      "Each choose two songs. Put the phones down while they play, and share what you like about them.",
    ],
    [
      "Draw the same ordinary thing",
      "Pick a mug, a plant, or the view from your window. Take ten minutes to sketch it; skill is optional.",
    ],
    [
      "Read a few pages side by side",
      "Bring a book you already have. Read a little, then share a line that stayed with you.",
    ],
    [
      "Try a game from your shelf",
      "Choose a game you already own, or play a simple word game. Keep the evening as short or long as you want.",
    ],
    [
      "Make a small memory page",
      "Choose one photo or moment you both want to keep. Add a sentence from each of you about what you remember.",
    ],
    [
      "Visit a corner you keep passing",
      "Pick a nearby place you have wanted to explore. Check opening times and accessibility before going.",
    ],
    [
      "Swap a skill for half an hour",
      "Each offer to teach one small thing: a drawing trick, a phrase, a recipe step, or a simple repair.",
    ],
  ],
  eat: [
    [
      "Build your own picnic at home",
      "Choose a few things you already enjoy. Lay them out somewhere different and leave the dishes until later.",
    ],
    [
      "Cook one familiar dish together",
      "One person prepares, the other cooks; swap whenever you like. Start with ingredients and a recipe you trust.",
    ],
    [
      "Have a soup and stories evening",
      "Make or choose a soup you both want, then share one small story from your week.",
    ],
    [
      "Make breakfast at a different hour",
      "Choose your own breakfast favorites and make them together. Check ingredients against your dietary needs.",
    ],
    [
      "Try a toppings table",
      "Prepare a simple base you both enjoy and a few toppings. Each make a different version to taste.",
    ],
    [
      "Recreate a meal you remember",
      "Choose a meal from a place or moment that mattered to you. Use a reliable recipe and adapt it together.",
    ],
  ],
  watch: [
    [
      "Return to a film you already love",
      "Each suggest a favorite, then agree on one. Check where it is available before settling in.",
    ],
    [
      "Watch a short nature documentary",
      "Choose a nature story you both want to see. Afterwards, share one thing you noticed.",
    ],
    [
      "Make a short-film evening",
      "Each choose one short film from a source you trust. Leave room to stop after the first one.",
    ],
    [
      "Choose a film by its soundtrack",
      "Start with a soundtrack or composer you enjoy, then find a film together. Availability is yours to check.",
    ],
    [
      "Watch the first episode, then decide",
      "Choose a series you are both curious about. One episode is enough to decide whether to keep it.",
    ],
    [
      "Pick a story from another place",
      "Choose a subtitled film or documentary you both want to explore. Let curiosity guide the choice.",
    ],
  ],
};

/** Daily, finite starter set. A seed stays local; it is never sent to providers. */
export function starterIdeas(
  intent: IdeaIntent,
  date: string,
  seed = "",
): Idea[] {
  let hash = 0;
  for (const char of `${date.slice(0, 10)}:${seed}`)
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const list = starters[intent];
  return [0, 1, 2].map((offset) => {
    const index = (hash + offset) % list.length;
    const [title, body] = list[index];
    return {
      id: `starter-${intent}-${index}`,
      title,
      body,
      intent,
      source: "BetweenUs starters",
      source_url: "",
    };
  });
}

export function ideaCapture(idea: Idea): Mutation {
  return {
    action: "capture",
    title: idea.title,
    body: `${idea.body}\n\nIdea source: ${idea.source}.`,
    source_url: idea.source_url,
    kind: idea.source_url ? "url" : "idea",
    category: idea.intent,
    sensitivity: "ordinary",
  };
}

export function unsavedIdeas(
  ideas: Idea[],
  saved: { title: string; source_url: string | null }[],
) {
  return ideas.filter(
    (idea) =>
      !saved.some(
        (item) =>
          item.title === idea.title ||
          (idea.source_url && item.source_url === idea.source_url),
      ),
  );
}
