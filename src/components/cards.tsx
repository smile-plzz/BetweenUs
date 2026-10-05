"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Heart,
  LockKeyhole,
  Link as LinkIcon,
  Sparkles,
  Check,
  Minus,
  CircleHelp,
} from "lucide-react";
import type {
  Snapshot,
  SharedObject,
  QuestionCard,
  ReactionType,
} from "@/domain/model";
import { CategoryIcon, categoryLabels } from "./primitives";
import type { Act } from "./forms";
export function person(data: Snapshot, id: string) {
  return (
    data.members.find((m) => m.user_id === id)?.display_name || "Your partner"
  );
}
export const reactions: {
  value: ReactionType;
  label: string;
  icon: typeof Heart;
}[] = [
  { value: "interested", label: "Interested", icon: Check },
  { value: "love", label: "Love this", icon: Heart },
  { value: "maybe", label: "Maybe", icon: CircleHelp },
  { value: "not_for_me", label: "Not for me", icon: Minus },
];
export function ReactionBar({
  object,
  data,
  act,
  busy,
}: {
  object: SharedObject;
  data: Snapshot;
  act: Act;
  busy: boolean;
}) {
  const mine = object.reactions.find(
    (r) => r.user_id === data.user.id,
  )?.reaction_type;
  return (
    <div className="reaction-area">
      <div className="reactions">
        {reactions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            title={label}
            aria-label={label}
            aria-pressed={mine === value}
            disabled={busy}
            onClick={() => {
              void act({
                action: "reaction",
                id: object.id,
                reaction_type: mine === value ? "remove" : value,
              }).catch(() => {});
            }}
          >
            <Icon
              size={16}
              fill={
                value === "love" && mine === value ? "currentColor" : "none"
              }
            />
            <span>{label}</span>
          </button>
        ))}
      </div>
      {object.reactions.length > 0 && (
        <div className="reaction-signals">
          {object.reactions.map((r) => (
            <span key={r.user_id}>
              {person(data, r.user_id)} ·{" "}
              {reactions.find((v) => v.value === r.reaction_type)?.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
export function ObjectCard({
  object,
  data,
  open,
  act,
  busy,
  reason,
}: {
  object: SharedObject;
  data: Snapshot;
  open: () => void;
  act: Act;
  busy: boolean;
  reason?: string;
}) {
  return (
    <article className={`object-card category-${object.category}`}>
      <button
        className="card-open"
        onClick={open}
        aria-label={
          object.hidden ? "Open discreet shared item" : `Open ${object.title}`
        }
      >
        <div className="card-top">
          <span className="object-symbol">
            {object.hidden ? (
              <LockKeyhole size={21} strokeWidth={1.5} />
            ) : (
              <CategoryIcon category={object.category} />
            )}
          </span>
          <span className="kind-label">{categoryLabels[object.category]}</span>
          <ArrowUpRight className="card-arrow" size={18} />
        </div>
        <h3>{object.title}</h3>
        <p className="object-excerpt">
          {object.hidden
            ? "Open when you have a private moment."
            : object.body ||
              object.metadata.source ||
              "A possibility for the two of you."}
        </p>
        <div className="card-byline">
          <span className="mini-avatar">
            {person(data, object.created_by).slice(0, 1)}
          </span>
          <span>Left by {person(data, object.created_by)}</span>
          {object.status !== "saved" && (
            <span className="status-chip">{object.status}</span>
          )}
        </div>
      </button>
      {reason && (
        <p className="reason">
          <Sparkles size={13} />
          {reason}
        </p>
      )}
      {!object.hidden && (
        <ReactionBar object={object} data={data} act={act} busy={busy} />
      )}
    </article>
  );
}
export function ObjectDetail({
  object,
  data,
  act,
  busy,
  onDelete,
}: {
  object: SharedObject;
  data: Snapshot;
  act: Act;
  busy: boolean;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div>
      <div className="detail-meta">
        <span className="pill">{categoryLabels[object.category]}</span>
        <span>Left by {person(data, object.created_by)}</span>
      </div>
      <h3 className="detail-title">{object.title}</h3>
      {object.body && <p className="detail-text">{object.body}</p>}
      {object.source_url && (
        <a
          className="source-link"
          href={object.source_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkIcon size={16} />
          Open original source
          <ArrowUpRight size={16} />
        </a>
      )}
      {object.sensitivity === "explicit-intimate" && (
        <p className="notice small">
          Shared desires and past preferences never mean present consent. Talk
          together before acting.
        </p>
      )}
      <ReactionBar object={object} data={data} act={act} busy={busy} />
      {object.sensitivity !== "explicit-intimate" &&
        !["faith", "intimacy"].includes(object.category) && (
          <label className="status-field">
            Where this is now
            <select
              value={object.status}
              disabled={busy}
              onChange={(e) => {
                void act({
                  action: "status",
                  id: object.id,
                  status: e.target.value as SharedObject["status"],
                }).catch(() => {});
              }}
            >
              <option value="saved">Saved for later</option>
              <option value="considering">Considering together</option>
              <option value="done">We did this</option>
              <option value="archived">Put away</option>
            </select>
          </label>
        )}
      <p className="quiet detail-date">
        Saved{" "}
        {new Date(object.created_at).toLocaleDateString(undefined, {
          dateStyle: "medium",
        })}{" "}
        · {object.kind}
      </p>
      {object.created_by === data.user.id && (
        <div className="delete-area">
          <button
            className="text-button danger"
            onClick={() => setDeleting(!deleting)}
          >
            Delete my contribution
          </button>
          {deleting && (
            <div className="notice small">
              <p>
                This removes the item and its reactions from your shared space.
              </p>
              <button
                className="danger-button"
                disabled={busy}
                onClick={async () => {
                  try {
                    await act({ action: "delete_object", id: object.id });
                    onDelete();
                  } catch {}
                }}
              >
                Delete this item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export function QuestionPreview({
  question,
  data,
  open,
}: {
  question: QuestionCard;
  data: Snapshot;
  open: () => void;
}) {
  const myState = question.responses.find(
    (r) => r.user_id === data.user.id,
  )?.state;
  return (
    <button
      className={`question-preview ${question.sensitivity !== "ordinary" ? "discreet" : ""}`}
      onClick={open}
    >
      <div className="question-overline">
        <span>
          {question.hidden ? <LockKeyhole size={16} /> : <Sparkles size={16} />}
          A question in our room
        </span>
        <span>
          {question.domain === "relationship" ? "For us" : question.domain}
        </span>
      </div>
      <h3>{question.prompt}</h3>
      <div className="question-footer">
        <span>
          {myState === "answered"
            ? "Your shared answer is here"
            : myState === "passed"
              ? "You chose Pass"
              : myState === "not_now"
                ? "You chose Not now"
                : "Answer, Pass, Not now—or leave it for another day."}
        </span>
        <ArrowUpRight size={21} />
      </div>
    </button>
  );
}
export function QuestionDetail({
  question,
  data,
  act,
  busy,
  onArchive,
}: {
  question: QuestionCard;
  data: Snapshot;
  act: Act;
  busy: boolean;
  onArchive: () => void;
}) {
  const mine = question.responses.find((r) => r.user_id === data.user.id);
  const [answer, setAnswer] = useState(mine?.answer || "");
  return (
    <div>
      <div className="detail-meta">
        <span className="pill">{question.domain}</span>
        <span>Asked by {person(data, question.created_by)}</span>
      </div>
      <h3 className="detail-title question-title">{question.prompt}</h3>
      {question.domain === "intimacy" && (
        <p className="notice small">
          A fantasy, preference, or previous answer is never consent to sexual
          activity now or later.
        </p>
      )}
      <div className="shared-answers">
        {data.members.map((m) => {
          const r = question.responses.find((v) => v.user_id === m.user_id);
          return (
            <div key={m.user_id} className="shared-answer">
              <span className="answer-name">{m.display_name}</span>
              {r?.state === "answered" ? (
                <p>{r.answer}</p>
              ) : (
                <span className="quiet">
                  {r?.state === "passed"
                    ? "Pass"
                    : r?.state === "not_now"
                      ? "Not now"
                      : "No response shared"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {question.state === "open" ? (
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await act({
                  action: "response",
                  id: question.id,
                  state: "answered",
                  answer,
                });
              } catch {}
            }}
          >
            <label>
              {mine?.state === "answered"
                ? "Change your shared answer"
                : "Your answer"}
              <textarea
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={4000}
                placeholder="Share as much or as little as you want."
                required
              />
            </label>
            <p className="privacy-note">
              <LockKeyhole size={14} />
              Your submitted answer is visible to your partner.
            </p>
            <div className="response-actions">
              <button className="secondary" disabled={busy}>
                Share answer
              </button>
              <button
                type="button"
                disabled={busy}
                aria-pressed={mine?.state === "passed"}
                onClick={() => {
                  void act({
                    action: "response",
                    id: question.id,
                    state: "passed",
                    answer: "",
                  })
                    .then(() => setAnswer(""))
                    .catch(() => {});
                }}
              >
                Pass
              </button>
              <button
                type="button"
                disabled={busy}
                aria-pressed={mine?.state === "not_now"}
                onClick={() => {
                  void act({
                    action: "response",
                    id: question.id,
                    state: "not_now",
                    answer: "",
                  })
                    .then(() => setAnswer(""))
                    .catch(() => {});
                }}
              >
                Not now
              </button>
            </div>
          </form>
          <div className="inline-actions question-tools">
            {mine && (
              <button
                className="text-button"
                disabled={busy}
                onClick={() => {
                  void act({
                    action: "response",
                    id: question.id,
                    state: "unanswered",
                    answer: "",
                  })
                    .then(() => setAnswer(""))
                    .catch(() => {});
                }}
              >
                Withdraw my response
              </button>
            )}
            <button
              className="text-button"
              disabled={busy}
              onClick={async () => {
                try {
                  await act({ action: "archive_question", id: question.id });
                  onArchive();
                } catch {}
              }}
            >
              Put this card away
            </button>
          </div>
        </>
      ) : (
        <p className="quiet">
          This card has been put away. Your shared responses remain here.
        </p>
      )}
    </div>
  );
}
