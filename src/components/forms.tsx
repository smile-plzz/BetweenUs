"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Copy,
  Check,
  LockKeyhole,
  Mail,
  Heart,
  Plus,
} from "lucide-react";
import type { Snapshot, Sensitivity, Category, Domain } from "@/domain/model";
import type { Mutation } from "@/domain/validation";
import { prompts } from "@/domain/prompts";
import { HomeSketch } from "./primitives";
export type Act = (input: Mutation) => Promise<Record<string, string>>;
export function AuthForm({
  onDone,
  invitePresent,
}: {
  onDone: () => Promise<void>;
  invitePresent: boolean;
}) {
  const [signup, setSignup] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [confirmation, setConfirmation] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: signup ? "signup" : "login",
          email: f.get("email"),
          password: f.get("password"),
          ...(signup
            ? { display_name: f.get("name"), adult: f.get("adult") === "on" }
            : {}),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      if (result.confirmation) setConfirmation(true);
      else await onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-layout">
      <div className="auth-story">
        <Link className="wordmark" href="/">
          between<span>us</span>
          <i>✳</i>
        </Link>
        <div>
          <span className="eyebrow">A PRIVATE DIGITAL HOME FOR TWO</span>
          <h1>
            A place for
            <br />
            our kind of life.
          </h1>
          <p>
            The little ideas. The things worth remembering.
            <br />
            The questions that bring us closer.
            <br />
            Somewhere for all of it to stay.
          </p>
          <HomeSketch />
        </div>
        <span className="quiet">Two people. One shared space.</span>
      </div>
      <section className="auth-form">
        <span className="small-icon">
          <LockKeyhole size={20} />
        </span>
        <h2>
          {invitePresent
            ? "Someone has made room for you."
            : signup
              ? "Make a little space for us."
              : "Welcome home."}
        </h2>
        <p>
          {invitePresent
            ? "Create an account or sign in to accept your invitation."
            : "Start small. Leave something meaningful here."}
        </p>
        {confirmation ? (
          <div className="notice">
            <Mail size={25} />
            <h3>Check your email.</h3>
            <p>
              Confirm your account, then come back and sign in. Keep your
              partner’s invitation if you have one.
            </p>
            <button
              onClick={() => {
                setConfirmation(false);
                setSignup(false);
              }}
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            {signup && (
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="given-name"
                  maxLength={60}
                  required
                  placeholder="What should we call you?"
                />
              </label>
            )}
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                minLength={12}
                maxLength={128}
                required
                placeholder="At least 12 characters"
              />
            </label>
            {signup && (
              <label className="check-label">
                <input name="adult" type="checkbox" required />I am 18 or older.
                BetweenUs is for two consenting adults.
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary full" disabled={busy}>
              {busy
                ? "Opening the door…"
                : signup
                  ? "Create my account"
                  : "Sign in"}
              <ArrowRight size={18} />
            </button>
            <p className="switch-auth">
              {signup ? "Already have an account?" : "New to BetweenUs?"}{" "}
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSignup(!signup);
                  setError("");
                }}
              >
                {signup ? "Sign in" : "Create an account"}
              </button>
            </p>
          </form>
        )}
        <p className="privacy-note">
          <LockKeyhole size={14} />
          Private to your paired space. Shared things stay attributable.
        </p>
      </section>
    </main>
  );
}
export function Pairing({
  act,
  inviteToken,
  busy,
}: {
  act: Act;
  inviteToken: string;
  busy: boolean;
}) {
  const [mode, setMode] = useState<"create" | "join">(
    inviteToken ? "join" : "create",
  );
  return (
    <section className="pairing welcome">
      <span className="eyebrow">JUST THE TWO OF YOU</span>
      <h1>
        Every home starts
        <br />
        with an open door.
      </h1>
      <p>Create your shared space, or step into the one your partner made.</p>
      <div className="segmented">
        <button
          aria-pressed={mode === "create"}
          onClick={() => setMode("create")}
        >
          Create our space
        </button>
        <button aria-pressed={mode === "join"} onClick={() => setMode("join")}>
          Join my partner
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          void act(
            mode === "create"
              ? { action: "create_space", accepted: true }
              : {
                  action: "join",
                  token: String(f.get("token")).trim(),
                  accepted: true,
                },
          ).catch(() => {});
        }}
      >
        {mode === "join" && (
          <label>
            Invitation code
            <input
              name="token"
              defaultValue={inviteToken}
              required
              pattern="[a-f0-9]{64}"
              placeholder="Paste the code your partner shared"
            />
          </label>
        )}
        <div className="shared-contract">
          <LockKeyhole size={20} />
          <p>
            Things you intentionally submit here—including answers—are shared
            with your paired partner. Both of you belong equally. There is no
            private vault inside this space.
          </p>
        </div>
        <label className="check-label">
          <input type="checkbox" required />I understand and accept our
          shared-space contract.
        </label>
        <button className="primary full" disabled={busy}>
          {mode === "create" ? "Create our space" : "Accept invitation"}
          <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}
export function Invite({ act, busy }: { act: Act; busy: boolean }) {
  const [token, setToken] = useState(""),
    [copied, setCopied] = useState(false);
  async function create() {
    try {
      setToken((await act({ action: "invite" })).token);
      setCopied(false);
    } catch {}
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/#invite=${token}`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <section className="invite-banner">
      <span className="small-icon">
        <Heart size={22} />
      </span>
      <div>
        <h3>A little room for your person.</h3>
        <p>
          Send an invitation. You can already save something for them to find.
        </p>
        {token && (
          <div className="invite-content">
            <label>
              Invitation code
              <input
                value={token}
                readOnly
                onFocus={(e) => e.target.select()}
              />
            </label>
            <div className="inline-actions">
              <button onClick={copy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                {copied ? "Copied" : "Copy invite link"}
              </button>
              <button
                className="text-button"
                disabled={busy}
                onClick={async () => {
                  try {
                    await act({ action: "revoke_invite" });
                    setToken("");
                  } catch {}
                }}
              >
                Revoke
              </button>
            </div>
            <small>
              One use · Expires in 48 hours. A new invitation replaces the old
              one.
            </small>
          </div>
        )}
      </div>
      <button className="secondary" onClick={create} disabled={busy}>
        {token ? "Replace invitation" : "Invite my partner"}
        <Plus size={16} />
      </button>
    </section>
  );
}
function SafetySelect({
  value,
  onChange,
  available,
}: {
  value: Sensitivity;
  onChange: (v: Sensitivity) => void;
  available: boolean;
}) {
  return (
    <label>
      Discretion
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Sensitivity)}
      >
        <option value="ordinary">Ordinary · visible in our home</option>
        <option value="private-couple">
          Private couple · discreet preview
        </option>
        {available && (
          <option value="explicit-intimate">Intimate · discreet preview</option>
        )}
      </select>
    </label>
  );
}
// External permission withdrawal closes the form permanently. A synchronous
// render guard hides its fields before the queued dismissal runs.
function useIntimateDraftAccess(
  active: boolean,
  intimate: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    let cancelled = false;
    if (intimate && !active)
      queueMicrotask(() => {
        if (!cancelled) onClose();
      });
    return () => {
      cancelled = true;
    };
  }, [active, intimate, onClose]);
  return intimate && !active;
}
export function CaptureForm({
  data,
  act,
  busy,
  onDone,
}: {
  data: Snapshot;
  act: Act;
  busy: boolean;
  onDone: () => void;
}) {
  const [category, setCategory] = useState<Category>("other"),
    [sensitivity, setSensitivity] = useState<Sensitivity>("ordinary");
  const [raw, setRaw] = useState("");
  const revoked = useIntimateDraftAccess(
    data.intimacy_active,
    sensitivity === "explicit-intimate" || category === "intimacy",
    onDone,
  );
  if (revoked)
    return (
      <p className="notice" role="status">
        This intimate draft is closed because participation is off.
      </p>
    );
  const duplicate = data.objects.some(
    (o) => o.source_url === raw.trim() && raw.trim().startsWith("http"),
  );
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget),
          raw = String(f.get("raw")).trim(),
          context = String(f.get("context") || "").trim();
        let url = "";
        try {
          const u = new URL(raw);
          if (["http:", "https:"].includes(u.protocol)) url = raw;
        } catch {}
        const title =
          String(f.get("title") || "").trim() ||
          (url ? new URL(url).hostname : raw.split("\n")[0]).slice(0, 180);
        try {
          await act({
            action: "capture",
            title,
            body: url
              ? context
              : [raw, context].filter(Boolean).join("\n\n").slice(0, 4000),
            source_url: url,
            kind: url ? "url" : f.get("kind") === "idea" ? "idea" : "note",
            category,
            sensitivity,
          });
          onDone();
        } catch {}
      }}
    >
      <p className="form-intro">
        “We should…” starts here. Save it now; make sense of it later.
      </p>
      <label>
        Link or idea
        <textarea
          name="raw"
          autoFocus
          required
          maxLength={4000}
          rows={4}
          placeholder="Paste a link, leave a thought, or save an idea for the two of you."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </label>
      {duplicate && (
        <p className="notice small">
          This link is already in your space. You can save it again with new
          context; the original stays.
        </p>
      )}
      <label>
        A little context <span className="optional">optional</span>
        <input
          name="context"
          maxLength={1000}
          placeholder="Why this made you think of us…"
        />
      </label>
      <details>
        <summary>
          A title, kind, or moment <span className="optional">optional</span>
        </summary>
        <div className="details-fields">
          <label>
            Title
            <input
              name="title"
              maxLength={180}
              placeholder="Give it a name, if you like"
            />
          </label>
          <label>
            Kind
            <select name="kind">
              <option value="note">Note / text</option>
              <option value="idea">Shared idea</option>
            </select>
          </label>
          <label>
            A moment for this
            <select
              value={category}
              onChange={(e) => {
                const c = e.target.value as Category;
                setCategory(c);
                if (c === "intimacy") setSensitivity("explicit-intimate");
                else if (c === "faith") setSensitivity("private-couple");
              }}
            >
              <option value="other">Let it just be an idea</option>
              <option value="watch">Watch something</option>
              <option value="eat">Eat something</option>
              <option value="do">Do something</option>
              <option value="want">Something we like</option>
              <option value="listen">Listen / Read</option>
              {data.faith_active && (
                <option value="faith">Faith Together</option>
              )}
              {data.intimacy_active && (
                <option value="intimacy">Intimacy</option>
              )}
            </select>
          </label>
        </div>
      </details>
      <SafetySelect
        value={sensitivity}
        onChange={setSensitivity}
        available={data.intimacy_active}
      />
      <p className="privacy-note">
        <LockKeyhole size={14} />
        Saved to your shared space. Your partner can open it.
      </p>
      <button className="primary full" disabled={busy}>
        {busy ? "Saving…" : "Leave it in our space"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
export function QuestionForm({
  initial,
  data,
  act,
  busy,
  onDone,
}: {
  data: Snapshot;
  act: Act;
  busy: boolean;
  onDone: () => void;
  initial?: (typeof prompts)[number];
}) {
  const [domain, setDomain] = useState<Domain>(initial?.domain ?? "everyday"),
    [sensitivity, setSensitivity] = useState<Sensitivity>(
      initial?.sensitivity ?? "ordinary",
    ),
    [prompt, setPrompt] = useState(initial?.prompt ?? ""),
    [source, setSource] = useState<"custom" | "curated">(
      initial ? "curated" : "custom",
    );
  const revoked = useIntimateDraftAccess(
    data.intimacy_active,
    sensitivity === "explicit-intimate" || domain === "intimacy",
    onDone,
  );
  if (revoked)
    return (
      <p className="notice" role="status">
        This private question is unavailable because intimacy participation is
        off.
      </p>
    );
  const availablePrompts = prompts.filter(
    (p) =>
      (p.domain !== "intimacy" || data.intimacy_active) &&
      (p.domain !== "faith" || data.faith_active),
  );
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await act({
            action: "question",
            prompt,
            domain,
            sensitivity,
            prompt_source: source,
          });
          onDone();
        } catch {}
      }}
    >
      <p className="form-intro">
        Leave a little curiosity in the room. Either of you can answer, pass,
        choose Not now, or leave it alone.
      </p>
      <label>
        Your question
        <textarea
          autoFocus
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setSource("custom");
          }}
          required
          maxLength={1000}
          rows={3}
          placeholder="Something you’ve been meaning to ask…"
        />
      </label>
      <div className="field-row">
        <label>
          Kind of question
          <select
            value={domain}
            onChange={(e) => {
              const v = e.target.value as Domain;
              setDomain(v);
              if (v === "intimacy") setSensitivity("explicit-intimate");
              else if (v === "faith" || v === "relationship")
                setSensitivity("private-couple");
            }}
          >
            <option value="everyday">Everyday</option>
            <option value="playful">Playful</option>
            <option value="relationship">Relationship</option>
            {data.intimacy_active && <option value="intimacy">Intimacy</option>}
            {data.faith_active && <option value="faith">Faith Together</option>}
          </select>
        </label>
        <SafetySelect
          value={sensitivity}
          onChange={setSensitivity}
          available={data.intimacy_active}
        />
      </div>
      <details className="prompt-library">
        <summary>A few questions to start with</summary>
        <div className="prompt-list">
          {availablePrompts.map((p) => (
            <button
              type="button"
              key={p.prompt}
              onClick={() => {
                setPrompt(p.prompt);
                setDomain(p.domain);
                setSensitivity(p.sensitivity);
                setSource("curated");
              }}
            >
              <span>{p.domain}</span>
              {p.prompt}
            </button>
          ))}
        </div>
      </details>
      {domain === "intimacy" && (
        <p className="notice small">
          A fantasy or past answer never means consent now. Pass and Not now are
          always welcome.
        </p>
      )}
      <p className="privacy-note">
        <LockKeyhole size={14} />
        Submitted answers will be visible to both of you.
      </p>
      <button className="primary full" disabled={busy}>
        {busy ? "Placing it…" : "Place the question"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
export function Settings({
  data,
  act,
  busy,
  onClose,
  onSignOut,
}: {
  data: Snapshot;
  act: Act;
  busy: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const me = data.members.find((m) => m.user_id === data.user.id);
  const [intimacy, setIntimacy] = useState(me?.intimacy_enabled || false),
    [faith, setFaith] = useState(me?.faith_enabled || false),
    [leave, setLeave] = useState(false);
  return (
    <div>
      <p className="form-intro">
        You both belong equally. Choose which kinds of shared moments you’re
        comfortable opening.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await act({
              action: "settings",
              intimacy_enabled: intimacy,
              faith_enabled: faith,
            });
            onClose();
          } catch {}
        }}
      >
        <div className="setting-block">
          <h3>Discreet by design</h3>
          <p>
            Private and intimate items show a generic preview until you open
            them. Sensitive details close when you switch away. No push
            notifications, outside AI, or activity broadcasting are enabled.
          </p>
        </div>
        <div className="setting-block">
          <label className="check-label">
            <input
              type="checkbox"
              checked={intimacy}
              disabled={!data.intimacy_available}
              onChange={(e) => setIntimacy(e.target.checked)}
            />
            Intimacy & desire
          </label>
          <p>
            Adult text and questions, only after both of you opt in. You can
            turn this off at any time. Shared preferences never mean current
            sexual consent.
          </p>
          {!data.intimacy_available && (
            <small>
              This controlled-pilot feature is off for this installation.
            </small>
          )}
        </div>
        <div className="setting-block">
          <label className="check-label">
            <input
              type="checkbox"
              checked={faith}
              onChange={(e) => setFaith(e.target.checked)}
            />
            Faith Together
          </label>
          <p>
            Optional shared reflections and dua questions, after both of you opt
            in. Companionship, without worship tracking.
          </p>
        </div>
        <button className="primary full" disabled={busy}>
          Save my choices
        </button>
      </form>
      <div className="setting-block">
        <h3>Your account</h3>
        <p>
          Signed in as {data.user.display_name}. Signing out leaves your shared
          space intact.
        </p>
        <button className="text-button" onClick={onSignOut}>
          Sign out of this device
        </button>
      </div>
      <div className="setting-block">
        <h3>Leaving this space</h3>
        <p>
          Either person can close this home. Both accounts immediately lose
          access. Stored content is retained without member access for this
          controlled pilot; export and permanent deletion require the documented
          operator process.
        </p>
        <button className="text-button danger" onClick={() => setLeave(!leave)}>
          Leave and close this space
        </button>
        {leave && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await act({ action: "leave", confirm: "LEAVE" });
                onClose();
              } catch {}
            }}
          >
            <label>
              Type LEAVE to confirm
              <input required pattern="LEAVE" placeholder="LEAVE" />
            </label>
            <button className="danger-button" disabled={busy}>
              Close our space for both of us
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
