"use client";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Home,
  Layers2,
  MessageCircle,
  Sparkles,
  Settings2,
  Plus,
  ArrowRight,
  LogOut,
  Search,
  X,
  LockKeyhole,
  Check,
  ArrowUpRight,
} from "lucide-react";
import type {
  Snapshot,
  SharedObject,
  QuestionCard,
  Category,
} from "@/domain/model";
import { recommend, reasonText } from "@/domain/intelligence";
import {
  AuthForm,
  Pairing,
  Invite,
  CaptureForm,
  QuestionForm,
  Settings,
} from "./forms";
import {
  Modal,
  Empty,
  HomeSketch,
  CategoryIcon,
  categoryLabels,
} from "./primitives";
import {
  ObjectCard,
  ObjectDetail,
  QuestionPreview,
  QuestionDetail,
} from "./cards";
import { useSpace } from "./use-space";
import { Ideas } from "./ideas";
import { HomeSuggestions } from "./home-suggestions";
import { homeSuggestions, type QuestionDraft } from "@/domain/home-suggestions";
import type { IdeaIntent } from "@/domain/ideas";
type View = "home" | "things" | "questions" | "decide";
type Detail =
  | { type: "object"; item: SharedObject }
  | { type: "question"; item: QuestionCard };
const navigation: { id: View; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Our Space", icon: Home },
  { id: "things", label: "Our Things", icon: Layers2 },
  { id: "questions", label: "Questions", icon: MessageCircle },
  { id: "decide", label: "Decide Together", icon: Sparkles },
];
export function BetweenUs() {
  const { data, loaded, busy, error, offline, refresh, act, clearError } =
    useSpace();
  const [view, setView] = useState<View>("home"),
    [modal, setModal] = useState<"capture" | "question" | "settings" | null>(
      null,
    ),
    [detail, setDetail] = useState<Detail | null>(null),
    [opening, setOpening] = useState(false),
    [localError, setLocalError] = useState(""),
    [inviteToken, setInviteToken] = useState(""),
    [decisionIntent, setDecisionIntent] = useState<IdeaIntent>("watch");
  const [questionDraft, setQuestionDraft] = useState<
    QuestionDraft | undefined
  >();
  const detailRequest = useRef(0);
  const dismiss = useCallback(() => {
    detailRequest.current++;
    setDetail(null);
    setModal(null);
    setQuestionDraft(undefined);
    setOpening(false);
  }, []);
  useEffect(() => {
    const receiveInvite = () => {
      const token = new URLSearchParams(location.hash.slice(1)).get("invite");
      if (token && /^[a-f0-9]{64}$/.test(token)) setInviteToken(token);
    };
    receiveInvite();
    window.addEventListener("hashchange", receiveInvite);
    const hide = () => {
      if (document.visibilityState === "hidden") dismiss();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("hashchange", receiveInvite);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [dismiss]);
  async function open(type: "object" | "question", id: string) {
    const epoch = ++detailRequest.current;
    setOpening(true);
    setLocalError("");
    try {
      const res = await fetch(`/api/detail?type=${type}&id=${id}`, {
        cache: "no-store",
      });
      const item = await res.json();
      if (!res.ok) throw new Error(item.error);
      if (epoch === detailRequest.current)
        setDetail(
          type === "object"
            ? { type, item: item as SharedObject }
            : { type, item: item as QuestionCard },
        );
    } catch (e) {
      if (epoch === detailRequest.current) {
        setDetail(null);
        setLocalError(
          e instanceof Error ? e.message : "Could not open this item.",
        );
      }
    } finally {
      if (epoch === detailRequest.current) setOpening(false);
    }
  }
  async function detailAct(input: Parameters<typeof act>[0]) {
    const result = await act(input);
    if (detail && !["delete_object", "archive_question"].includes(input.action))
      await open(detail.type, detail.item.id);
    return result;
  }
  async function signOut() {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      if (!res.ok) throw new Error();
      dismiss();
      await refresh();
    } catch {
      setLocalError("Sign out could not be completed. Try again.");
    }
  }
  if (!loaded)
    return (
      <main className="loading-screen">
        <span className="wordmark">
          between<span>us</span>
          <i>✳</i>
        </span>
        <p>Opening the door…</p>
      </main>
    );
  const toast = error || localError;
  const toastNode = toast ? (
    <div className="toast" role="alert">
      <span>{toast}</span>
      <button
        className="icon-button"
        aria-label="Dismiss message"
        onClick={() => {
          clearError();
          setLocalError("");
        }}
      >
        <X size={18} />
      </button>
    </div>
  ) : null;
  if (!data)
    return (
      <>
        {offline ? (
          <main className="welcome">
            <h1>Your home is a moment away.</h1>
            <p>{error || "We couldn’t reach the shared space."}</p>
            <button className="primary" onClick={() => void refresh()}>
              Try again
            </button>
            <p className="quiet">
              If you are setting up this installation, follow the environment
              steps in the README.
            </p>
          </main>
        ) : (
          <AuthForm onDone={refresh} invitePresent={!!inviteToken} />
        )}{" "}
        {toastNode}
      </>
    );
  if (!data.user.display_name)
    return (
      <main className="welcome">
        <h1>A name for your place here.</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void act({
              action: "profile",
              display_name: String(new FormData(e.currentTarget).get("name")),
              adult: true,
            }).catch(() => {});
          }}
        >
          <label>
            Your name
            <input name="name" required maxLength={60} />
          </label>
          <label className="check-label">
            <input type="checkbox" required />I am 18 or older.
          </label>
          <button className="primary" disabled={busy}>
            Continue
          </button>
        </form>
        {toastNode}
      </main>
    );
  const closeModal = () => {
    setModal(null);
    setQuestionDraft(undefined);
  };
  const questionAllowed =
    !questionDraft ||
    questionDraft.domain !== "intimacy" ||
    data.intimacy_active;
  const visibleDetail =
    detail &&
    data.space &&
    (detail.type === "object"
      ? data.objects.some((o) => o.id === detail.item.id)
      : data.questions.some((q) => q.id === detail.item.id))
      ? detail
      : null;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="wordmark">
          between<span>us</span>
          <i>✳</i>
        </Link>
        <span className="sidebar-label">OUR LITTLE CORNER</span>
        <nav aria-label="Your shared space">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => {
                setView(id);
                dismiss();
              }}
              aria-current={view === id ? "page" : undefined}
            >
              <Icon size={21} strokeWidth={1.6} />
              <span>{label}</span>
              {view === id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            A little less searching.
            <br />A little more us.
          </p>
          <span className="sidebar-divider" />
          <button onClick={() => void signOut()}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <Link href="/" className="mobile-wordmark wordmark">
            between<span>us</span>
          </Link>
          <span className="topbar-note">
            <LockKeyhole size={14} />
            Just between you two
          </span>
          <div className="topbar-right">
            <div
              className="pair-avatars"
              aria-label={data.members.map((m) => m.display_name).join(" and ")}
            >
              {data.members.slice(0, 2).map((m) => (
                <span key={m.user_id} title={m.display_name}>
                  {m.display_name.slice(0, 1)}
                </span>
              ))}
              {data.members.length === 1 && (
                <span className="partner-placeholder">+</span>
              )}
            </div>
            <button
              className="icon-button"
              aria-label="Privacy and settings"
              onClick={() => setModal("settings")}
            >
              <Settings2 size={20} />
            </button>
          </div>
        </header>
        <main className="content" id="main-content">
          {offline && (
            <div className="connection-note">
              Your space isn’t connected right now. Your last shared view is
              here.{" "}
              <button className="text-button" onClick={() => void refresh()}>
                Reconnect
              </button>
            </div>
          )}
          {!data.space ? (
            <Pairing act={act} inviteToken={inviteToken} busy={busy} />
          ) : (
            <>
              {data.members.length === 1 && <Invite act={act} busy={busy} />}
              {view === "home" && (
                <HomeView
                  data={data}
                  act={act}
                  busy={busy}
                  open={open}
                  onCapture={() => setModal("capture")}
                  onQuestion={() => {
                    setQuestionDraft(undefined);
                    setModal("question");
                  }}
                  onSuggestedQuestion={(draft) => {
                    setQuestionDraft(draft);
                    setModal("question");
                  }}
                  navigate={setView}
                  decide={(intent) => {
                    setDecisionIntent(intent);
                    setView("decide");
                  }}
                />
              )}
              {view === "things" && (
                <Things
                  data={data}
                  act={act}
                  busy={busy}
                  open={open}
                  onCapture={() => setModal("capture")}
                />
              )}
              {view === "questions" && (
                <Questions
                  data={data}
                  open={open}
                  onQuestion={() => {
                    setQuestionDraft(undefined);
                    setModal("question");
                  }}
                />
              )}
              {view === "decide" && (
                <Decide
                  key={decisionIntent}
                  initialIntent={decisionIntent}
                  data={data}
                  act={act}
                  busy={busy}
                  open={open}
                  onCapture={() => setModal("capture")}
                />
              )}
            </>
          )}
        </main>
        <footer className="page-footer">
          Made from the things you share.<span>Private. Shared. Yours.</span>
        </footer>
      </div>
      {data.space && (
        <button
          className="capture-fab"
          aria-label="Save something"
          onClick={() => setModal("capture")}
        >
          <Plus size={22} />
          <span>Save something</span>
        </button>
      )}
      {modal && data.space && (modal !== "question" || questionAllowed) && (
        <Modal
          title={
            modal === "capture"
              ? "Something for us"
              : modal === "question"
                ? "A question for our room"
                : "Our boundaries"
          }
          onClose={dismiss}
        >
          {modal === "capture" ? (
            <CaptureForm
              data={data}
              act={act}
              busy={busy}
              onDone={closeModal}
            />
          ) : modal === "question" ? (
            <QuestionForm
              initial={questionDraft}
              data={data}
              act={act}
              busy={busy}
              onDone={closeModal}
            />
          ) : (
            <Settings
              data={data}
              act={act}
              busy={busy}
              onClose={closeModal}
              onSignOut={() => void signOut()}
            />
          )}
        </Modal>
      )}
      {visibleDetail && (
        <Modal
          title={
            visibleDetail.type === "object"
              ? "In our shared space"
              : "Between the two of you"
          }
          onClose={dismiss}
        >
          {visibleDetail.type === "object" ? (
            <ObjectDetail
              object={visibleDetail.item}
              data={data}
              act={detailAct}
              busy={busy}
              onDelete={dismiss}
            />
          ) : (
            <QuestionDetail
              key={visibleDetail.item.id}
              question={visibleDetail.item}
              data={data}
              act={detailAct}
              busy={busy}
              onArchive={dismiss}
            />
          )}
        </Modal>
      )}
      {opening && (
        <div className="opening-note" role="status">
          Opening your shared moment…
        </div>
      )}
      {toastNode}
    </div>
  );
}
function HomeView({
  data,
  act,
  busy,
  open,
  onCapture,
  onQuestion,
  onSuggestedQuestion,
  navigate,
  decide,
}: {
  data: Snapshot;
  act: ReturnType<typeof useSpace>["act"];
  busy: boolean;
  open: (type: "object" | "question", id: string) => void;
  onCapture: () => void;
  onQuestion: () => void;
  onSuggestedQuestion: (draft: QuestionDraft) => void;
  navigate: (view: View) => void;
  decide: (intent: IdeaIntent) => void;
}) {
  const suggestions = homeSuggestions(data);
  const featuredIds = new Set([
    suggestions.activities[0]?.objectId,
    suggestions.media[0]?.objectId,
  ]);
  const recent = data.objects
    .filter((o) => o.status !== "archived" && !featuredIds.has(o.id))
    .slice(0, 3);
  const candidate = recommend(
    data.objects,
    data.user.id,
    undefined,
    Date.parse(data.server_time),
  ).find(
    (c) =>
      !featuredIds.has(c.object.id) &&
      !recent.some((o) => o.id === c.object.id),
  );
  // A card is a voluntary object, not debt: answered/passed/not-now cards fade from Home.
  const question = data.questions.find(
    (q) =>
      q.state === "open" &&
      Date.parse(data.server_time) - Date.parse(q.created_at) < 7 * 86400000 &&
      !q.responses.some((r) => r.user_id === data.user.id),
  );
  const names = data.members.map((m) => m.display_name).join(" & ");
  return (
    <>
      <section className="home-hero">
        <div>
          <span className="eyebrow">{names} · OUR SPACE</span>
          <h1>
            A little of us,
            <br />
            all in one place.
          </h1>
          <p>
            The things we’d like to do. The thoughts we want to keep.
            <br className="desktop-break" /> A home for the little pieces of our
            life together.
          </p>
          <button className="text-button hero-action" onClick={onCapture}>
            Leave something here
            <ArrowRight size={18} />
          </button>
        </div>
        <HomeSketch />
      </section>
      <HomeSuggestions
        key={data.space?.id}
        data={data}
        act={act}
        busy={busy}
        open={open}
        onQuestion={onSuggestedQuestion}
        onCapture={onCapture}
      />
      {recent.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LITTLE POSSIBILITIES</span>
              <h2>Recently left here</h2>
            </div>
            <button className="text-button" onClick={() => navigate("things")}>
              All our things
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="object-grid">
            {recent.map((object) => (
              <ObjectCard
                key={object.id}
                object={object}
                data={data}
                open={() => open("object", object.id)}
                act={act}
                busy={busy}
              />
            ))}
          </div>
        </section>
      )}
      <section className="expression-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE CURIOSITY</span>
            <h2>Room for a question</h2>
          </div>
          <button className="text-button" onClick={onQuestion}>
            Ask something
            <Plus size={16} />
          </button>
        </div>
        {question ? (
          <QuestionPreview
            question={question}
            data={data}
            open={() => open("question", question.id)}
          />
        ) : (
          <button className="question-invitation" onClick={onQuestion}>
            <Sparkles size={25} strokeWidth={1.3} />
            <div>
              <h3>Something you’ve been meaning to ask?</h3>
              <p>Leave a question for the two of you. No hurry to answer.</p>
            </div>
            <ArrowUpRight size={22} />
          </button>
        )}
      </section>
      {candidate && (
        <section className="remember-section">
          <div>
            <span className="eyebrow">WORTH REMEMBERING</span>
            <h2>Still a lovely possibility.</h2>
            <p>{candidate.reasons.map((r) => reasonText[r]).join(" · ")}</p>
          </div>
          <button onClick={() => open("object", candidate.object.id)}>
            <CategoryIcon category={candidate.object.category} />
            <h3>{candidate.object.title}</h3>
            <ArrowRight size={20} />
          </button>
        </section>
      )}
      <section className="decide-home">
        <div>
          <span className="eyebrow">FROM “WE SHOULD” TO “LET’S”</span>
          <h2>A moment for the two of us?</h2>
          <p>Start with what’s already here.</p>
        </div>
        <div className="intent-shortcuts">
          {(["watch", "eat", "do"] as IdeaIntent[]).map((c) => (
            <button key={c} onClick={() => decide(c)}>
              <CategoryIcon category={c} />
              <span>
                {c === "watch"
                  ? "Watch something"
                  : c === "eat"
                    ? "Eat something"
                    : "Do something"}
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
function Things({
  data,
  act,
  busy,
  open,
  onCapture,
}: {
  data: Snapshot;
  act: ReturnType<typeof useSpace>["act"];
  busy: boolean;
  open: (type: "object" | "question", id: string) => void;
  onCapture: () => void;
}) {
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("all"),
    [status, setStatus] = useState("active"),
    [limit, setLimit] = useState(24);
  const results = data.objects.filter(
    (o) =>
      (category === "all" || o.category === category) &&
      (status === "all" ||
        (status === "active"
          ? o.status !== "archived"
          : o.status === status)) &&
      (!search ||
        [
          o.title,
          o.body,
          o.metadata.source,
          personName(data, o.created_by),
        ].some((s) => s?.toLowerCase().includes(search.toLowerCase()))),
  );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">THE THINGS THAT STAY</span>
        <h1>Our Things</h1>
        <p>A small piece of shared life, ready when it matters.</p>
      </div>
      <div className="collection-tools">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Search our things"
            value={search}
            placeholder="Find an idea, a thought, a person…"
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(24);
            }}
          />
        </label>
        <label className="sr-only" htmlFor="status-filter">
          Filter by state
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">In our space</option>
          <option value="saved">Saved for later</option>
          <option value="considering">Considering</option>
          <option value="done">We did this</option>
          <option value="archived">Put away</option>
          <option value="all">Everything</option>
        </select>
      </div>
      <div className="filter-chips" aria-label="Filter by moment">
        {[
          "all",
          "watch",
          "eat",
          "do",
          "want",
          "listen",
          "other",
          ...(data.faith_active ? ["faith"] : []),
          ...(data.intimacy_active ? ["intimacy"] : []),
        ].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setLimit(24);
            }}
          >
            {c === "all" ? "Everything" : categoryLabels[c as Category]}
          </button>
        ))}
      </div>
      {search && (
        <p className="quiet small">
          Discreet items are searchable by their contributor and category. Open
          them to read their content.
        </p>
      )}
      {results.length ? (
        <>
          <div className="object-grid collection-grid">
            {results.slice(0, limit).map((object) => (
              <ObjectCard
                key={object.id}
                object={object}
                data={data}
                open={() => open("object", object.id)}
                act={act}
                busy={busy}
              />
            ))}
          </div>
          {results.length > limit && (
            <button
              className="secondary more-button"
              onClick={() => setLimit(limit + 24)}
            >
              Show a few more
            </button>
          )}
        </>
      ) : (
        <Empty
          title={
            data.objects.length
              ? "Nothing in this corner yet."
              : "A place for our possibilities."
          }
          action={
            <button className="secondary" onClick={onCapture}>
              Save something
              <Plus size={16} />
            </button>
          }
        >
          {data.objects.length
            ? "Try a different word or moment, or leave something new here."
            : "Start with one real thing you’d like to remember together."}
        </Empty>
      )}
      {!data.objects.length && <Ideas data={data} act={act} busy={busy} />}
    </>
  );
}
function personName(data: Snapshot, id: string) {
  return data.members.find((m) => m.user_id === id)?.display_name || "";
}
function Questions({
  data,
  open,
  onQuestion,
}: {
  data: Snapshot;
  open: (type: "object" | "question", id: string) => void;
  onQuestion: () => void;
}) {
  const [archived, setArchived] = useState(false),
    [limit, setLimit] = useState(12);
  const questions = data.questions.filter(
    (q) => q.state === (archived ? "archived" : "open"),
  );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">CURIOSITY, WITHOUT A CLOCK</span>
        <h1>Between the two of us.</h1>
        <p>A question can stay here until it feels like the right moment.</p>
        <button className="secondary" onClick={onQuestion}>
          Leave a question
          <Plus size={17} />
        </button>
      </div>
      <div className="filter-chips">
        <button aria-pressed={!archived} onClick={() => setArchived(false)}>
          In our room
        </button>
        <button aria-pressed={archived} onClick={() => setArchived(true)}>
          Put away
        </button>
      </div>
      {questions.length ? (
        <div className="questions-list">
          {questions.slice(0, limit).map((question) => (
            <QuestionPreview
              key={question.id}
              question={question}
              data={data}
              open={() => open("question", question.id)}
            />
          ))}
          {questions.length > limit && (
            <button className="secondary" onClick={() => setLimit(limit + 12)}>
              Show a few more
            </button>
          )}
        </div>
      ) : (
        <Empty
          title="Room for a little curiosity."
          action={
            <button className="secondary" onClick={onQuestion}>
              Our first question
              <Plus size={17} />
            </button>
          }
        >
          Everyday, playful, or something more personal. Answer, Pass, Not now,
          and leaving it alone all belong here.
        </Empty>
      )}
    </>
  );
}
function Decide({
  data,
  act,
  busy,
  open,
  onCapture,
  initialIntent,
}: {
  data: Snapshot;
  initialIntent: IdeaIntent;
  act: ReturnType<typeof useSpace>["act"];
  busy: boolean;
  open: (type: "object" | "question", id: string) => void;
  onCapture: () => void;
}) {
  const [intent, setIntent] = useState<IdeaIntent>(initialIntent),
    [chosen, setChosen] = useState(""),
    [exploring, setExploring] = useState(false);
  const candidates = recommend(
    data.objects,
    data.user.id,
    intent,
    Date.parse(data.server_time),
  );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">LESS SEARCHING, MORE TOGETHER</span>
        <h1>What shall we do?</h1>
        <p>A few possibilities from the things you’ve actually shared.</p>
      </div>
      <div className="decision-intents">
        {(["watch", "eat", "do"] as IdeaIntent[]).map((c) => (
          <button
            key={c}
            aria-pressed={intent === c}
            onClick={() => {
              setIntent(c);
              setChosen("");
              setExploring(false);
            }}
          >
            <CategoryIcon category={c} />
            {c === "watch"
              ? "Watch something"
              : c === "eat"
                ? "Eat something"
                : "Do something"}
          </button>
        ))}
      </div>
      {chosen && (
        <div className="chosen-note" role="status">
          <Check size={19} />
          Left in “Considering” for both of you. Choose together, then go enjoy
          your time.
        </div>
      )}
      {candidates.length ? (
        <>
          <p className="decision-context">
            {candidates.length === 3
              ? "Three"
              : candidates.length === 2
                ? "Two"
                : "One"}{" "}
            saved {candidates.length === 1 ? "possibility" : "possibilities"}.
            No guesses about availability, price, or what either of you wants
            right now.
          </p>
          <div className="object-grid">
            {candidates.map(({ object, reasons }) => (
              <div key={object.id} className="candidate">
                <ObjectCard
                  object={object}
                  data={data}
                  open={() => open("object", object.id)}
                  act={act}
                  busy={busy}
                  reason={reasons.map((r) => reasonText[r]).join(" · ")}
                />
                <button
                  className="secondary full"
                  disabled={busy}
                  onClick={async () => {
                    try {
                      await act({ action: "decision_selected", id: object.id });
                      setChosen(object.id);
                    } catch {}
                  }}
                >
                  {chosen === object.id
                    ? "Considering together"
                    : "Let’s consider this"}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className="quiet decision-footnote">
            Either person’s “Not for me” keeps an item out of these suggestions.
            No answer or reaction is assumed.
          </p>
          <button
            className="text-button"
            onClick={() => setExploring(!exploring)}
            aria-expanded={exploring}
          >
            {exploring ? "Stay with our saved ideas" : "Explore something new"}
            <Sparkles size={16} />
          </button>
        </>
      ) : (
        <Empty
          title="Let’s start with something real."
          action={
            <button className="secondary" onClick={onCapture}>
              Save a{" "}
              {intent === "watch"
                ? "film"
                : intent === "eat"
                  ? "food idea"
                  : "possibility"}
              <Plus size={16} />
            </button>
          }
        >
          There aren’t enough saved{" "}
          {intent === "watch"
            ? "watch ideas"
            : intent === "eat"
              ? "food ideas"
              : "activities"}{" "}
          here yet. Choose a starter below, or save an idea of your own. As your
          collection grows, we’ll start from your shared history.
        </Empty>
      )}
      {(!candidates.length || exploring) && (
        <Ideas
          key={intent}
          data={data}
          act={act}
          busy={busy}
          intent={intent}
          fresh
        />
      )}
    </>
  );
}
