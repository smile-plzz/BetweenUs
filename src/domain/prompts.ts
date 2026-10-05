import type { Domain, Sensitivity } from "./model";
export const prompts: {
  prompt: string;
  domain: Domain;
  sensitivity: Sensitivity;
}[] = [
  {
    prompt: "What would make a quiet evening together feel good this week?",
    domain: "everyday",
    sensitivity: "ordinary",
  },
  {
    prompt: "If we could disappear for an afternoon, where would we go?",
    domain: "playful",
    sensitivity: "ordinary",
  },
  {
    prompt: "What is a small thing we do that you hope we keep doing?",
    domain: "relationship",
    sensitivity: "private-couple",
  },
  {
    prompt: "What is something you would like me to understand better?",
    domain: "relationship",
    sensitivity: "private-couple",
  },
  {
    prompt:
      "What kind of touch feels good to you, and what would you rather avoid?",
    domain: "intimacy",
    sensitivity: "explicit-intimate",
  },
  {
    prompt:
      "Is there a sexual fantasy you would enjoy talking about, without any expectation to try it?",
    domain: "intimacy",
    sensitivity: "explicit-intimate",
  },
  {
    prompt: "What helps you feel comfortable saying “not tonight” during sex?",
    domain: "intimacy",
    sensitivity: "explicit-intimate",
  },
  {
    prompt: "What should we make dua for together?",
    domain: "faith",
    sensitivity: "private-couple",
  },
];
