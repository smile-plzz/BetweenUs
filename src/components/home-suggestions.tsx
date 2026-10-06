"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Footprints,
  BookOpen,
  MessageCircle,
  Plus,
  RefreshCw,
  LockKeyhole,
} from "lucide-react";
import type { Snapshot } from "@/domain/model";
import type { Idea } from "@/domain/ideas";
import { ideaCapture } from "@/domain/ideas";
import {
  homeSuggestions,
  type HomeSuggestion,
  type QuestionDraft,
} from "@/domain/home-suggestions";
import type { useSpace } from "./use-space";
import { ReactionBar } from "./cards";

type Act = ReturnType<typeof useSpace>["act"];
export function HomeSuggestions({
  data,
  act,
  busy,
  open,
  onQuestion,
  onCapture,
}: {
  data: Snapshot;
  act: Act;
  busy: boolean;
  open: (type: "object" | "question", id: string) => void;
  onQuestion: (draft: QuestionDraft) => void;
  onCapture: () => void;
}) {
  const [catalogs, setCatalogs] = useState<Idea[]>([]);
  const [activityIndex, setActivityIndex] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const spaceId = data.space?.id;
  useEffect(() => {
    // One ordinary catalog request per mounted home, never on snapshot polling.
    const controller = new AbortController();
    void fetch("/api/home-suggestions", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const result = (await response.json()) as { ideas: Idea[] };
        if (!controller.signal.aborted) setCatalogs(result.ideas);
      })
      .catch(() => {
        /* The complete local home remains usable. */
      });
    return () => controller.abort();
  }, [spaceId]);
  const choices = homeSuggestions(data, catalogs);
  const activity =
    choices.activities[activityIndex % choices.activities.length];
  const media = choices.media[mediaIndex % choices.media.length];
  const question = choices.questions[questionIndex % choices.questions.length];
  async function save(choice: HomeSuggestion, suggested: boolean) {
    try {
      const capture = ideaCapture(choice.idea);
      await act({
        ...capture,
        body: `${suggested ? "A possibility I’d like to suggest to you.\n\n" : ""}${capture.body}`,
      });
      setNotice(
        suggested
          ? "Suggested in your shared space, with you as the contributor. Your partner can respond freely."
          : "Saved to your shared space, with you as the contributor.",
      );
    } catch {}
  }
  function possibility(
    choice: HomeSuggestion | undefined,
    slot: "activity" | "media",
  ) {
    const label = slot === "activity" ? "DO TOGETHER" : "WATCH OR READ";
    const Icon = slot === "activity" ? Footprints : BookOpen;
    return (
      <article
        className={`idea-card home-possibility ${slot}`}
        aria-label={
          slot === "activity"
            ? "Do together suggestion"
            : "Watch or read suggestion"
        }
      >
        <span className="suggestion-label">
          <Icon size={18} />
          {label}
        </span>
        <h3>
          {choice?.idea.title ??
            (slot === "activity"
              ? "Make room for a small adventure"
              : "Bring a story you already have")}
        </h3>
        <p>
          {choice?.idea.body ??
            "Choose something you both want to explore. You can always leave a new idea in your space."}
        </p>
        <p className="suggestion-reason">
          {choice?.reason ?? "A place to start together"}
        </p>
        {choice && (
          <>
            <div className="idea-source">
              {choice.objectId ? (
                <span>Already in your shared space</span>
              ) : choice.idea.source_url ? (
                <a
                  href={choice.idea.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {choice.idea.source}
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span>BetweenUs starter · not shared yet</span>
              )}
              {choice.idea.source === "TVMaze" && !choice.objectId && (
                <a
                  className="idea-license"
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-SA 4.0
                </a>
              )}
            </div>
            {choice.objectId &&
              data.objects.find((o) => o.id === choice.objectId) && (
                <ReactionBar
                  object={data.objects.find((o) => o.id === choice.objectId)!}
                  data={data}
                  act={act}
                  busy={busy}
                />
              )}
            <div className="suggestion-actions">
              {choice.objectId ? (
                <button
                  className="secondary"
                  onClick={() => open("object", choice.objectId!)}
                >
                  Open our saved idea
                  <ArrowUpRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={() => void save(choice, false)}
                  >
                    <Plus size={16} />
                    Save this idea
                  </button>
                  <button
                    className="text-button"
                    disabled={busy}
                    onClick={() => void save(choice, true)}
                  >
                    Suggest to my partner
                    <ArrowUpRight size={15} />
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {!choice && (
          <button className="secondary" onClick={onCapture}>
            Leave a new idea
            <Plus size={16} />
          </button>
        )}
        <button
          className="text-button suggestion-swap"
          onClick={() =>
            slot === "activity"
              ? setActivityIndex((i) => i + 1)
              : setMediaIndex((i) => i + 1)
          }
        >
          <RefreshCw size={14} />
          Something else
          <span className="sr-only">
            {" "}
            for {slot === "activity" ? "doing together" : "watching or reading"}
          </span>
        </button>
      </article>
    );
  }
  return (
    <section
      className="ideas-section home-suggestions"
      aria-label="Ideas to make your own"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">A LITTLE ROOM FOR TODAY</span>
          <h2>Three little possibilities.</h2>
        </div>
        <span className="suggestion-cadence">
          A fresh starting point each day
        </span>
      </div>
      <p className="ideas-intro">
        Something to do, something to discover, something to ask. Start with
        what’s yours, or try a new possibility.
      </p>
      <div className="ideas-grid">
        {possibility(activity, "activity")}
        {possibility(media, "media")}
        <article
          className="idea-card home-possibility connect"
          aria-label="Connect together suggestion"
        >
          <span className="suggestion-label">
            <MessageCircle size={18} />
            CONNECT TOGETHER
          </span>
          <h3>{question.prompt}</h3>
          <p>
            A little curiosity, without an obligation to answer. Edit the
            question before placing it in your space.
          </p>
          <p className="suggestion-reason">
            A conversation starter · not posted yet
          </p>
          <div className="idea-source">
            Answer, Pass, Not now, or leave it alone.
          </div>
          <button className="secondary" onClick={() => onQuestion(question)}>
            <Plus size={16} />
            Make a Question Card
          </button>
          {choices.privateQuestions.length > 0 && (
            <button
              className="text-button private-suggestion"
              onClick={() =>
                onQuestion(
                  choices.privateQuestions[
                    questionIndex % choices.privateQuestions.length
                  ],
                )
              }
            >
              <LockKeyhole size={14} />
              Open an intimacy question privately
            </button>
          )}
          <button
            className="text-button suggestion-swap"
            onClick={() => setQuestionIndex((i) => i + 1)}
          >
            <RefreshCw size={14} />
            Something else<span className="sr-only"> to ask each other</span>
          </button>
        </article>
      </div>
      {notice && (
        <p className="ideas-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
