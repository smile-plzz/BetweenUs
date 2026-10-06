# BetweenUs

> **A private digital home for two.**

**Status:** Product definition frozen for the first development cycle. Validation remains evidence-gated.

BetweenUs is not a couples messenger, relationship quiz, task board, sex app, prayer tracker, travel planner, or expense ledger with romantic branding. It is the **shared digital environment of a couple**: a place where the fragments of their life together can remain, gain context, and become useful later.

A couple already creates this material every day: a Reel of a restaurant, a movie, a dress one partner likes, a song, a recipe, a sexual fantasy, a question they want to ask, a dua, a place to visit, a gift hint, a game, a rough date budget, or simply a small gesture. Today those fragments disappear into chronological chat, feeds, screenshots, browser tabs, memory, and specialized apps.

BetweenUs gives them somewhere to live **between the moment they are expressed and the moment they matter**.

## Run the V1

The runnable implementation is at the repository root. Product specifications below remain the source of truth. Implementation details: [V1 architecture](docs/06-engineering/v1-architecture.md), [pilot operations](docs/06-engineering/pilot-operations.md), and [build report](BUILD_REPORT.md).

Hosted test installation: **[between-us-three-beta.vercel.app](https://between-us-three-beta.vercel.app/)**. The dedicated free Supabase project is connected, and the production sign-in screen/API smoke checks pass. Email confirmation/delivery and the complete hosted two-account journey still need verification. See [hosted deployment status](docs/06-engineering/hosted-deployment-status.md) for evidence and remaining checks.

### Local development — no external credentials

Use Node 24 LTS (`nvm use`) and npm:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Create your account, accept the shared-space contract, create a space, and generate an invitation. Open a **separate browser profile or incognito window** for your partner; create a second account and join using the invitation link/code. Save a real URL, note, or idea, react independently, and place a Question Card. The home synchronizes while visible, normally within four seconds. Choose an optional moment during capture (Watch/Eat/Do), then use Decide Together. Known media hosts receive a conservative category without requiring manual organization.

An empty home now offers three ordinary activity starters you can make your own. **Save this idea** creates an attributable shared item; suggestions never pretend to be your history. Decide Together can fetch a few fresh documentary/reading ideas from free public TVMaze/Open Library APIs on request, with source links and offline fallbacks. Food ideas stay curated. Set optional `BETWEENUS_DISCOVERY=curated` to disable provider requests. See [starter/discovery architecture](docs/06-engineering/discovery-starters.md).

Local mode is a real server-side, disk-persistent PostgreSQL development path using PGlite and the same database policies as Supabase. It does not simulate another partner or use localStorage as the database. There is no preloaded couple history, default login, or secret. Data lives at `LOCAL_DATABASE_PATH` (default `.local/betweenus`), which is excluded from Git/deployment. Run **one server per local database**. Local auth has no email verification/recovery and must not be used for live intimate data or deployed to Vercel.

To enable the controlled adult-text demonstration locally, set `ENABLE_INTIMACY_PILOT=true`, restart, and have **both** members independently opt in under Privacy and settings. Either can turn it off. Private/intimate previews remain generic until explicitly opened. Faith Together similarly requires both opt-ins and offers personal reflection/dua questions without scripture generation or worship tracking.

The app asks for explicit backend configuration; it never silently changes databases if credentials are missing. If local data was created with an earlier development schema, stop the server and explicitly erase only disposable development data with:

```bash
npm run db:reset -- --confirm
```

This command uses the default `.local/betweenus` unless `LOCAL_DATABASE_PATH` is supplied in the shell. It does not load `.env.local`. Never reset a database containing real pilot data.

### Supabase / hosted pilot

1. Create a **dedicated** Supabase project. Apply `supabase/migrations/20261005075912_betweenus_foundation.sql` using the SQL editor, or `npx supabase link --project-ref YOUR_PROJECT_REF` followed by `npx supabase db push`. The mirror `db/schema.sql` is for local testing; do not apply both copies. `db/local-bootstrap.sql` is local-only and must never be applied to Supabase.
2. Set `BETWEENUS_BACKEND=supabase`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and exact `APP_ORIGIN` in `.env.local` or your hosting environment. Use the publishable/legacy anon key; **no service-role key is needed or accepted by the application**.
3. Set Supabase's site URL to the application origin and allow `https://YOUR_HOST/auth/callback` (or `http://localhost:3000/auth/callback` for development). Keep email confirmation enabled; configure SMTP. Set Auth's password minimum to 12 and review rate limits/session policy. Verify email, then sign in. If a confirmation doesn't exchange a session, sign in after confirming; profile completion is supported.
4. Run `npx supabase db advisors --linked --type all` and repeat the A/B/C authorization flow against the hosted project. The migration revokes default anonymous grants and defines explicit authenticated access. The private helper schema must **not** be added to Data API exposed schemas.
5. Keep intimate text disabled until the controlled-pilot trust/recovery review is complete. For Supabase, the authoritative installation flag is in `private.features`; see [pilot operations](docs/06-engineering/pilot-operations.md). `ENABLE_INTIMACY_PILOT` configures only the local adapter.

Optional full local Supabase: `npx supabase start` requires Docker; the committed configuration applies the same migration, uses no preloaded couple data, and sets Auth callbacks/password length. Switch the application to Supabase mode using the local API URL/publishable key. This path was prepared but not exercised during this build.

### Verification

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Domain/authorization tests run actual in-memory PostgreSQL and need no credentials. The Playwright test starts an isolated local server on port **3100**, creates separate A/B/C accounts, uses desktop/mobile browsers, and verifies the complete journey, access denial, and sensitive access withdrawal. It never reuses your regular server or hosted database. Its `.local/e2e-*` databases and screenshots/traces are disposable, ignored development artifacts. On Linux CI, use `npx playwright install --with-deps chromium`. CI runs lint, types, tests, build, and the browser journey.

### Deployment

Import this repository into Vercel as a Next.js project at the root. Build: `npm run build`. Set the Supabase environment variables above for each environment; use separate databases for development, preview, and pilot. Set the exact public HTTPS `APP_ORIGIN` for the deployment and add the matching Auth callback URL. A missing configuration fails clearly rather than creating a demo backend. Local mode is rejected on Vercel. No external AI, storage bucket, push service, or paid metadata API is needed.

Self-hosted build: `npm run build`, then `npm run start`. Production requires HTTPS and the Supabase backend. The successful local build establishes deployment compatibility; a hosted deployment/email-delivery test requires your project credentials.

**Current boundary:** this is a coherent controlled-pilot V1. Leaving closes the space and immediately revokes both memberships; retained closed data, manual deletion/export, account recovery, backup retention, and explicit-media safeguards still need the documented production lifecycle work before a broad sensitive launch.

## The product thesis

> **Conversations are chronological. Couple memory is contextual.**

The strongest initial promise is:

> **Never lose a “we should do this” idea.**

The strongest desired habit is:

> **“Put that in our app.”**

But the larger thesis is a digital home: two people should be able to **remember, feel, express, understand, decide, and do** things together without turning their relationship into administration.

## Two core loops

### Memory loop
**Capture → Remember → Understand → Resurface → Decide → Do together → Learn**

Something encountered casually today becomes useful at the right future moment.

### Expression loop
**Express → Respond voluntarily → Understand each other → Create shared context**

A question, desire, gesture, reflection, or preference can live in the shared space without requiring BetweenUs to become another chat app.

These loops share one object/context model. Domains should reuse the same primitives instead of becoming disconnected mini-apps.

## Product dimensions

### Shared Memory
Frictionless capture from the places where life already happens. Preserve source, contributor and meaning; organize later.

### Presence & Expression
The home should feel inhabited. Reactions, traces, “leave something for you,” playful gestures and Question Cards create lightweight co-presence without rebuilding messaging.

### Intimacy & Desire
Consensual adult sexual expression is a first-class part of the relationship, not a novelty tab. BetweenUs can support fantasies, kinks, fetishes, preferences, boundaries, candid questions and explicitly sexual expression. Tone may be romantic, playful, direct, raw or kinky according to the couple and context. The existence of a faith experience must never sanitize consensual sexual language.

Shared transparency does not mean compulsory participation. **Answer, Pass, Not now, and non-response are legitimate states.** A stored fantasy, preference, kink or previous answer never means present consent.

### Spiritual Intimacy / Faith Together
For couples who enable it, spiritual life can also inhabit the home. The first researched model is Islam: pray-together invitations, shared duas, Qur’an/authenticated-hadith reflections, faith Question Cards and later Ramadan/other shared spiritual moments.

This is companionship, not religious surveillance: **no piety score, prayer-performance comparison, missed-prayer policing, or AI judgment of religiosity.** Religious source material requires provenance; generative AI must not fabricate scripture or hadith.

See [Spiritual Intimacy — Islam](docs/03-experience/spiritual-intimacy-islam.md).

### Shared Decisions & Discovery
When the couple wants to watch, eat, go or do something, BetweenUs should use their actual shared history and current constraints to offer a **small, explainable set** rather than another infinite feed.

### Shared Living
Lists, goals, rough budgets, plans, travel and other practical coordination can grow around the validated core. Money is an enabler of experiences, not a mechanism for policing contribution.

## The shared-space contract

BetweenUs is designed for **exactly two paired consenting adults**.

There is no private “mine” vault inside the current couple-space concept. Things intentionally submitted to the space are shared; authorship and each person’s signals remain attributable. This creates an **Us layer without pretending two people are identical**.

Some capabilities are more sensitive than ordinary shared objects. Pairing is not blanket authorization for live location, explicit-media handling, account integrations, notification exposure, or other high-sensitivity capabilities. Those require their own understandable controls.

Surprises are planned elsewhere. BetweenUs can remember what a partner likes without pretending a shared home can also be a secret planning room.

## Shared Question Cards

Question Cards are a core primitive: **chatting without becoming chat**.

Either partner can place a question into the shared room. The system may also suggest a relevant prompt. Questions can be everyday, playful, emotional, sexual, spiritual, or decision-oriented. Submitted answers are visible and attributable. Participation remains voluntary.

Question Cards should never create inbox debt, unanswered-count guilt, read-receipt pressure, compatibility scoring, sexual pressure, or religious pressure.

See [Shared Question Cards](docs/03-experience/shared-question-cards.md).

## Intelligence philosophy

> **The house is smart; there is no digital roommate.**

AI is infrastructure, not a third personality in the relationship. Intelligence should organize, retrieve, rank, explain, detect patterns in intentionally shared signals, and resurface context at useful moments.

It should not claim psychological certainty about the relationship, infer current sexual consent, judge faith, or fabricate facts. When confidence is low, preserve the source and expose uncertainty.

## Tone architecture

BetweenUs does **not** have one emotional tone.

The same home can be practical while planning groceries, tender while sharing affection, irreverent while playing, unapologetically explicit during consensual sexual interaction, and reverent during spiritual moments. One domain must not moralize or sanitize another.

Tone follows **context + couple preference**, while agency and discretion remain global product requirements.

## What V1 actually proves

The vision is broad. The first development cycle is not.

V1 tests two behaviors:

1. **Memory:** Will both partners naturally capture real things because they trust BetweenUs to make them useful later?
2. **Expression:** Will lightweight shared interactions—especially Question Cards—make the space feel inhabited and useful without becoming messaging or obligation?

The first build therefore prioritizes pairing, a shared backend, frictionless capture, Our Space / Our Things, reactions, Question Cards, discreet sensitive-content handling, basic resurfacing and a small decision experience.

It explicitly does **not** need full chat, continuous location, bank connections, a giant kink taxonomy, sexual-performance analytics, worship tracking, a 3D room, an infinite discovery feed, or the complete shared-living ecosystem.

## Development doctrine

- Build the wedge before the world.
- Save first; enrich second.
- Reuse primitives across domains.
- Finite choices beat infinite feeds.
- Resurface; do not nag.
- Presence must not become surveillance.
- Intimacy is legitimate; refusal/non-participation is legitimate.
- Faith supports companionship; it does not quantify piety.
- Money enables shared life; it does not audit the relationship.
- Success can mean **less screen time** because the couple decided and went to do something together.

## Documentation map

### Product source of truth
- [Product Context](docs/00-product-overview/product-context.md) — origin and reasoning.
- [Vision](docs/00-product-overview/vision.md) — destination and anti-vision.
- [Problem & Opportunity](docs/00-product-overview/problem-opportunity.md) — problem structure and strategic opportunity.
- [Product Principles](docs/00-product-overview/product-principles.md) — constraints for future decisions.

### User / behavior model
- [Jobs to Be Done](docs/01-research/jobs-to-be-done.md)
- [Behavior & Relationship Psychology](docs/01-research/behavioral-psychology.md)

### Product specification
- [PRD](docs/02-product/product-requirements.md)
- [Feature Map](docs/02-product/feature-map.md)
- [V1 Scope](docs/02-product/v1-scope.md)

### Experience specifications
- [Experience Architecture](docs/03-experience/experience-architecture.md)
- [Shared Question Cards](docs/03-experience/shared-question-cards.md)
- [Spiritual Intimacy — Islam](docs/03-experience/spiritual-intimacy-islam.md)

### Intelligence / trust / engineering
- [Intelligence Model](docs/04-intelligence/intelligence-model.md)
- [Trust, Consent & Privacy](docs/05-trust/trust-consent-privacy.md)
- [Technical Direction](docs/06-engineering/technical-direction.md)

### Execution and learning
- [30-Day Couple Test](docs/07-validation/30-day-couple-test.md)
- [Roadmap](docs/08-roadmap/roadmap.md)
- [Decision Log](docs/09-decisions/decision-log.md)
- [Development Handoff](docs/10-development/development-handoff.md) — canonical build order, epics and pilot definition of done.
- [Open Questions](docs/open-questions.md)

## Relationship to Wayfare

Wayfare remains a separate product. Its place-capture and trip-decision mechanics are a natural specialization of the BetweenUs memory/decision model, but merging the products now would weaken both. Integration or shared primitives can be revisited after BetweenUs validates its own behavior.

## Feature test

Before adding anything, ask:

1. Does it help the couple **remember, feel, express, understand, decide, or do** something meaningful together?
2. Is it easier than the behavior it replaces?
3. Does it strengthen shared agency without creating obligation, surveillance, scorekeeping, or noise?
4. Can it reuse an existing BetweenUs primitive rather than becoming another mini-app?
5. What hypothesis does building it test?

If those answers are weak, it does not belong in the active build.
