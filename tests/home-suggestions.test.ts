import { describe, expect, it } from "vitest";
import type { Snapshot, SharedObject } from "../src/domain/model";
import {
  homeSuggestions,
  readingAndVideos,
} from "../src/domain/home-suggestions";
import { ideaCapture } from "../src/domain/ideas";
import { mutation } from "../src/domain/validation";
const base: Snapshot = {
  server_time: "2026-10-07T12:00:00Z",
  user: { id: "a", display_name: "A" },
  space: { id: "our-space", created_at: "2026-10-01" },
  members: [],
  objects: [],
  questions: [],
  intimacy_active: false,
  intimacy_available: true,
  faith_active: false,
};
const object = (values: Partial<SharedObject>): SharedObject => ({
  id: "saved",
  created_by: "b",
  created_at: "2026-10-06",
  kind: "idea",
  title: "An actual shared possibility",
  body: "Something real",
  source_url: null,
  category: "do",
  status: "saved",
  sensitivity: "ordinary",
  hidden: false,
  reactions: [],
  metadata: {},
  ...values,
});
describe("three useful home possibilities", () => {
  it("fills an empty home without saving history and keeps ordinary starters stable within a day", () => {
    const set = homeSuggestions(base);
    expect(set.activities.length).toBeGreaterThan(0);
    expect(set.media.length).toBeGreaterThan(0);
    expect(set.questions.length).toBeGreaterThan(0);
    expect(set.privateQuestions).toEqual([]);
    expect(base.objects).toEqual([]);
    expect(
      homeSuggestions({ ...base, server_time: "2026-10-07T23:00:00Z" }),
    ).toEqual(set);
    expect(
      homeSuggestions({ ...base, server_time: "2026-10-08T12:00:00Z" }).media,
    ).not.toEqual(set.media);
  });
  it("uses actual shared history first, with honest reasons and partner rejection respected", () => {
    const saved = object({});
    const data = {
      ...base,
      objects: [
        saved,
        object({
          id: "sensitive",
          sensitivity: "explicit-intimate",
          hidden: false,
        }),
        object({
          id: "declined",
          reactions: [{ user_id: "b", reaction_type: "not_for_me" }],
        }),
      ],
    };
    const set = homeSuggestions(data);
    expect(set.activities[0].objectId).toBe(saved.id);
    expect(set.activities[0].reason).toContain("Your partner saved this");
    expect(set.activities.map((x) => x.objectId)).not.toContain("sensitive");
    expect(set.activities.map((x) => x.objectId)).not.toContain("declined");
  });
  it("never reintroduces a previously saved or declined catalog URL under a new title", () => {
    const idea = readingAndVideos[0];
    const set = homeSuggestions(
      {
        ...base,
        objects: [
          object({
            title: "A different title",
            source_url: idea.source_url,
            status: "archived",
          }),
        ],
      },
      [idea],
    );
    expect(set.media.some((x) => x.idea.source_url === idea.source_url)).toBe(
      false,
    );
    for (const item of readingAndVideos) {
      expect(new URL(item.source_url).protocol).toBe("https:");
      expect(mutation.safeParse(ideaCapture(item)).success).toBe(true);
      expect(ideaCapture(item)).not.toHaveProperty("created_by");
    }
  });
  it("keeps intimate suggestions separate, only after the server-confirmed two-person gate", () => {
    expect(
      homeSuggestions({ ...base, intimacy_available: true }).privateQuestions,
    ).toEqual([]);
    const enabled = homeSuggestions({ ...base, intimacy_active: true });
    expect(enabled.privateQuestions.length).toBeGreaterThan(0);
    expect(enabled.questions.every((p) => p.sensitivity === "ordinary")).toBe(
      true,
    );
    expect(
      enabled.privateQuestions.every(
        (p) => p.sensitivity === "explicit-intimate",
      ),
    ).toBe(true);
    expect(
      homeSuggestions({ ...base, intimacy_active: false }).privateQuestions,
    ).toEqual([]);
  });
});
