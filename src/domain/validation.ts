import { z } from "zod";
const id = z.uuid();
const sensitivity = z.enum(["ordinary", "private-couple", "explicit-intimate"]);
const category = z.enum([
  "other",
  "watch",
  "eat",
  "do",
  "want",
  "listen",
  "faith",
  "intimacy",
]);
const domain = z.enum([
  "everyday",
  "playful",
  "relationship",
  "intimacy",
  "faith",
]);
const safeUrl = z
  .string()
  .max(2048)
  .refine((v) => {
    if (!v) return true;
    try {
      return ["https:", "http:"].includes(new URL(v).protocol);
    } catch {
      return false;
    }
  }, "Use an http or https link.");
export const mutation = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("profile"),
      display_name: z.string().trim().min(1).max(60),
      adult: z.literal(true),
    })
    .strict(),
  z
    .object({ action: z.literal("create_space"), accepted: z.literal(true) })
    .strict(),
  z.object({ action: z.literal("invite") }).strict(),
  z.object({ action: z.literal("revoke_invite") }).strict(),
  z
    .object({
      action: z.literal("join"),
      token: z.string().regex(/^[a-f0-9]{64}$/),
      accepted: z.literal(true),
    })
    .strict(),
  z
    .object({
      action: z.literal("capture"),
      title: z.string().trim().min(1).max(180),
      body: z.string().max(4000).default(""),
      source_url: safeUrl.default(""),
      kind: z.enum(["url", "note", "idea"]),
      category: category.default("other"),
      sensitivity: sensitivity.default("ordinary"),
    })
    .strict(),
  z
    .object({
      action: z.literal("reaction"),
      id,
      reaction_type: z.enum([
        "interested",
        "love",
        "maybe",
        "not_for_me",
        "remove",
      ]),
    })
    .strict(),
  z
    .object({
      action: z.literal("status"),
      id,
      status: z.enum(["saved", "considering", "done", "archived"]),
    })
    .strict(),
  z.object({ action: z.literal("delete_object"), id }).strict(),
  z
    .object({
      action: z.literal("question"),
      prompt: z.string().trim().min(1).max(1000),
      domain,
      sensitivity,
      prompt_source: z.enum(["custom", "curated"]),
    })
    .strict(),
  z
    .object({
      action: z.literal("response"),
      id,
      state: z.enum(["answered", "passed", "not_now", "unanswered"]),
      answer: z.string().max(4000).default(""),
    })
    .strict()
    .refine(
      (v) => v.state !== "answered" || v.answer.trim().length > 0,
      "Write an answer, or choose Pass / Not now.",
    ),
  z.object({ action: z.literal("archive_question"), id }).strict(),
  z
    .object({
      action: z.literal("settings"),
      intimacy_enabled: z.boolean(),
      faith_enabled: z.boolean(),
    })
    .strict(),
  z
    .object({ action: z.literal("leave"), confirm: z.literal("LEAVE") })
    .strict(),
  z.object({ action: z.literal("decision_selected"), id }).strict(),
]);
export type Mutation = z.infer<typeof mutation>;
export const authInput = z
  .object({
    action: z.enum(["signup", "login", "logout"]),
    email: z.email().max(254).optional(),
    password: z.string().min(12).max(128).optional(),
    display_name: z.string().trim().min(1).max(60).optional(),
    adult: z.boolean().optional(),
  })
  .strict();
