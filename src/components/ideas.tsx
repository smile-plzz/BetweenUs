"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Plus, Check, Sparkles } from "lucide-react";
import type { Snapshot } from "@/domain/model";
import {
  starterIdeas,
  ideaCapture,
  unsavedIdeas,
  type IdeaSet,
  type IdeaIntent,
} from "@/domain/ideas";
import type { useSpace } from "./use-space";
import { CategoryIcon } from "./primitives";

export function Ideas({
  data,
  act,
  busy,
  intent = "do",
  fresh = false,
}: {
  data: Snapshot;
  act: ReturnType<typeof useSpace>["act"];
  busy: boolean;
  intent?: IdeaIntent;
  fresh?: boolean;
}) {
  const [catalog, setCatalog] = useState<IdeaSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const fetching = useRef(false);
  const suggestions =
    catalog?.ideas ?? starterIdeas(intent, data.server_time, data.space?.id);
  const ideas = unsavedIdeas(
    suggestions,
    data.objects.filter((o) => !o.hidden),
  );
  async function findFresh() {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    setNotice("");
    try {
      const res = await fetch(`/api/ideas?intent=${intent}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const result = (await res.json()) as IdeaSet;
      setCatalog(result);
      setNotice(
        result.origin === "curated"
          ? "A few starter ideas. Fresh catalog results aren’t available for this moment."
          : "A few catalog possibilities. Nothing is added until you save it.",
      );
    } catch {
      setNotice(
        "Fresh ideas couldn’t be reached. Your starter ideas are still here.",
      );
    } finally {
      setLoading(false);
      fetching.current = false;
    }
  }
  return (
    <section className="ideas-section" aria-label="Ideas to make your own">
      <div className="section-heading">
        <div>
          <span className="eyebrow">A LITTLE INSPIRATION</span>
          <h2>Something to make your own.</h2>
        </div>
        {fresh && (
          <button
            className="text-button"
            disabled={loading}
            onClick={() => void findFresh()}
          >
            <Sparkles size={16} />
            {loading ? "Finding a few ideas…" : "Find fresh ideas"}
          </button>
        )}
      </div>
      <p className="ideas-intro">
        A few possibilities to start from. Save one if it feels like you two;
        your partner can respond in their own way.
      </p>
      {notice && (
        <p className="ideas-notice" role="status">
          {notice}
        </p>
      )}
      <div className="ideas-grid">
        {ideas.map((idea) => (
          <article className="idea-card" key={idea.id}>
            <span className="idea-symbol">
              <CategoryIcon category={idea.intent} />
            </span>
            <h3>{idea.title}</h3>
            <p>{idea.body}</p>
            <div className="idea-source">
              {idea.source_url ? (
                <a
                  href={idea.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {idea.source}
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span>BetweenUs starter · not shared yet</span>
              )}
              {idea.source === "TVMaze" && (
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
            <button
              className="secondary"
              disabled={busy}
              onClick={async () => {
                try {
                  await act(ideaCapture(idea));
                  setNotice(
                    "Saved to your shared space, with you as the contributor.",
                  );
                } catch {}
              }}
            >
              <Plus size={16} />
              Save this idea
            </button>
          </article>
        ))}
      </div>
      {!ideas.length && (
        <p className="ideas-notice">
          <Check size={16} /> These ideas are already in your space. Start with
          what you saved.
        </p>
      )}
    </section>
  );
}
