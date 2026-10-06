# BetweenUs V1 build report

## Delivery revision

- Repository: `smile-plzz/BetweenUs`
- Delivery branch: **main**
- Final application/engineering commit: **`aff503f318a7ea63034885f7473255fa02d7c6a0`**
- Foundation checkpoint: `4c31c908f5508f2fbe87e97fb040b4ec7103aac4`
- This report is a subsequent documentation-only commit. The exact delivery tip, including this report, is available with `git rev-parse origin/main` after fetching. Recording a report's own immutable Git SHA inside itself is circular; the application SHA above identifies the exact tested code.

The completed application is pushed directly to the default branch. Connected GitHub Git-data tools were used because the cloud shell could clone/fetch but had no push credential. Every published commit extends the existing branch without force pushing or replacing product documentation. Local unpublished checkpoint history was preserved in local session branches while the working `main` was synchronized to GitHub.

## What was implemented

A runnable, mobile-first private shared home. The source documents and canonical development handoff were read before implementation. The memory and expression loops share the same model; there is no chat, score, streak, inbox debt, surveillance surface, or separate private vault.

- Adult account declaration, signup/sign-in/sign-out, and profile completion.
- Create a CoupleSpace, accept the explicit shared-space contract, invite one person, and pair two real accounts. Invitations expire in 48 hours, are hashed at rest, single-use, revocable, and replaceable. Links use URL fragments; codes also work directly.
- Finite Our Space: three recent contributions, at most one recent relevant Question Card, one eligible older possibility, and Watch/Eat/Do entry points. Submitted participation fades from each person's Home, without removing shared context from Questions.
- URL, text/note, and generic idea capture; optional context/title/moment; source/contributor preservation; duplicate notice without destructive merging; persisted state before asynchronous local metadata work.
- Our Things: browse, search, category/state filters, attribution, details, independent Interested/Love/Maybe/Not for me reactions, lifecycle status, and contributor deletion. Completion is unavailable for sexual/faith objects.
- Custom and eight curated Question Cards across everyday, playful, relationship, adult intimacy, and optional faith. Answer, Pass, Not now, and unanswered remain independent per person. Submitted answers are shared immediately, attributable, revisable, and withdrawable. Either member can put a card away.
- Sensitive object/card metadata, generic collection previews, explicit authorized detail fetches, tab-hide dismissal, and removal of open intimate content when access is withdrawn.
- Installation-gated adult text plus both members' independent/reversible opt-in. Historical preferences never become current consent or ordinary recommendations.
- Optional Faith Together proof using personal dua/reflection questions and a shared-object category, with both opt-ins. No scripture/hadith generation, religious authority claims, worship tracking, or piety scoring.
- Deterministic resurfacing and Watch/Eat/Do decisions using only saved history. At most three candidates, real reason codes, respect for either person's negative reaction, and honest empty states. A selected possibility becomes Considering rather than falsely recording joint agreement/completion.
- Content-free structural validation events, CI, migrations, environment template, developer setup, architecture notes, and controlled-pilot operations.

## Architecture

One root Next.js 16.3.8 / React 19.3 / TypeScript application, Zod validation, CSS responsive design, and Lucide icons. Exact package versions and the npm lockfile are committed; Node 24 LTS is recommended.

`src/domain` contains reusable types, validation, privacy rules, prompts, and deterministic intelligence. `src/server` contains session validation, local/Supabase adapters, authenticated RPC, same-origin checks, and sanitized errors. API routes separate auth, shared snapshot/mutations, and explicitly opened details. UI components compose the same primitives across domains.

Hosted mode uses Supabase Auth/PostgreSQL/RLS through each person's verified session and a publishable key. It requires no service-role key. Local development uses disk-persistent **real PostgreSQL via PGlite**, the identical schema/policies, and a clearly separate server-only auth adapter with scrypt password hashing and opaque, hashed, expiring session tokens. It is not a static mock, simulated partner, or browser-local database. It is single-process development only and is blocked on Vercel.

Synchronization is authenticated, uncached visible-tab polling every four seconds, plus immediate mutation/return refresh. It does not broadcast presence. Enrichment uses `after()` only after capture commits and currently records URL hostname/provenance locally. Known media hosts receive conservative basic categories; no arbitrary URL scraping, Open Graph fetching, AI, or outside metadata service is required.

## Database summary

Production migration: `supabase/migrations/20261005075912_betweenus_foundation.sql`. `db/schema.sql` mirrors it; an automated consistency check prevents drift. `db/local-bootstrap.sql` supplies only the local auth shim and must not be applied to Supabase.

| Entity | Purpose and invariant |
| --- | --- |
| profiles | Adult declaration and minimal attributable display name |
| couple_spaces / memberships | Equal members, one active space per person, locked database maximum of two |
| private.invites | Space-scoped hash, expiry, consumption, revocation |
| private.features | Operator-controlled intimacy pilot flag |
| shared_objects | Universal URL/note/idea, source, category/status, sensitivity, generated preview policy, provenance |
| reactions | Independent unique object/person signal |
| question_cards | Prompt/domain/source/sensitivity/card lifecycle |
| question_responses | Independent person/card state; absent row is unanswered; Pass/Not now cannot retain answers |
| events | Allowlisted event name, actor, space, timestamp; no raw content payload |

All exposed tables use RLS; anonymous default grants are explicitly revoked. Actor and parent-space checks apply to every write. Attribution and space IDs cannot be reassigned. Only tightly checked private pairing helpers have security-definer privilege; public application RPCs run as the caller. Either participant may close a space, immediately revoking both memberships and invitations. Closed records are retained without member access under the documented limited-pilot lifecycle.

## Completed flows and verification

The final application revision was fetched/pulled, re-read, and verified locally.

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, no errors/warnings |
| `npm run typecheck` | Passed |
| `npm test` | **23 passed**, two files; actual PostgreSQL policy/constraint tests plus domain/privacy/ranking/migration checks |
| `npm run test:e2e` | **Passed**; isolated server, desktop Partner A, mobile Partner B, unrelated signed-in C in a separate CoupleSpace |
| `npm run build` | Passed; final build had no compilation/tracing warnings |
| Production `next start` browser smoke | Passed: signup, space creation, capture, authenticated persisted retrieval, logout |
| Browser inspection | Auth/home render, no runtime errors or framework overlay, mobile page width fits viewport |
| Secret scan | No credential-pattern matches; only `.env.example` tracked, no local databases or real environment files |
| Git status | Clean at tested application revision; report committed/published afterward |

The browser journey verifies actual A/B invitation acceptance, capture from UI, synchronized independent reactions, Question Card creation and shared Answer/Pass/Not now transitions, search, factual recommendation reasons/selection, wrong-origin rejection, spoofed actor input rejection, guessed object access denial for C, sensitive redaction/detail access, and disappearance of an open intimate detail after opt-out. Database tests also cover anonymous denial, expiry/revocation/replay, privileged maximum-two enforcement, cross-space reads/writes, immutable attribution, response withdrawal/archive behavior, failed enrichment after persistence, structural telemetry, and revocation on closure.

Screenshots/traces contain synthetic development fixtures only and remain ignored local artifacts. No real couple data was used. GitHub CI is configured to run the checks; a remote CI outcome is not claimed in this report.

## Security and privacy measures

- Verified server identity and database authorization, not client filtering.
- Database parent locks/unique constraints and single-use hashed invitations.
- Strict Zod payloads reject actor fields; parameterized local SQL; no client-chosen auth identity.
- Same-origin JSON mutations, HttpOnly/SameSite sessions, secure production cookies, no-store authenticated responses, no-referrer/no-frame headers, and restrictive browser resource policy.
- Sensitive list payloads contain no titles, bodies, URLs, raw answers, or sensitive metadata. Explicit text requires flag plus both opt-ins through RLS.
- No outside AI, telemetry provider, push delivery, arbitrary URL fetching, rich media bucket, precise location, online/last-seen signal, or private-text error logging.
- Structural analytics cannot accept an arbitrary text/JSON payload.
- Local auth/data are excluded from deployment/Git and are not marketed as production security.
- Clear copying/screenshot/device limitations and controlled-pilot lifecycle/recovery procedures. No encryption-at-rest/E2EE or session-revocation guarantee beyond the actual provider/design is invented.

## Environment and deployment

**Hosted setup follow-up:** A dedicated free Supabase project (`vrvolqziqlzpwnncxysf`, Mumbai) has the foundation migration and passing hosted PostgreSQL role/RLS smoke checks. Intimacy remains disabled. The application is now deployed at **https://between-us-three-beta.vercel.app/** on Vercel Hobby. Browser-based CLI login provided access after plugin failures; missing production backend/origin variables were corrected and the tested source commit `1a149b485e3272c1e5562acf7efbff0ba069d7dc` was rebuilt as READY deployment `dpl_BR7jXSJCBvefxzNTSPqL5FXMbtVW`. The mobile signup screen renders without JavaScript errors; unauthenticated space access returns the expected 401, logout 200, and invalid login 400. Email delivery/callbacks and the complete hosted A/B/C browser journey remain pending. See [hosted deployment status](docs/06-engineering/hosted-deployment-status.md) for evidence, advisors, and remaining checks. The original delivery results above describe the original application revision; the follow-up also added the repeatable rollback-only SQL check and automated no-residue test (24 tests total).

The fastest local run needs no third-party credentials:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Use two browser profiles, create actual accounts, pair, and start with real ordinary captures. Local reset is explicit and restricted to `.local`; never erase real pilot data. Browser tests start their own fresh `.local/e2e-*` database/server on port 3100 and never reuse a hosted installation.

| Variable | When needed |
| --- | --- |
| BETWEENUS_BACKEND | Required: `local` development or `supabase` hosted pilot |
| LOCAL_DATABASE_PATH | Optional local path, default `.local/betweenus` |
| ENABLE_INTIMACY_PILOT | Local-only flag, default false; still requires both opt-ins |
| SUPABASE_URL | Hosted mode project API URL |
| SUPABASE_PUBLISHABLE_KEY | Hosted mode publishable/legacy anon key; never service-role |
| APP_ORIGIN | Exact browser origin; HTTPS deployment origin in production |

For a hosted pilot, apply the migration once to a dedicated Supabase project, configure verified-email Auth/SMTP, password length/rate limits, site URL and `/auth/callback` allowlist, and repeat provider-level authorization checks/advisors. Supabase's `private.features` is the hosted intimacy flag and defaults off. Import the root into Vercel as Next.js, set the hosted environment, and build with `npm run build`. Keep preview/test/pilot databases separate. Full steps are in README and the architecture/pilot documents.

During the original V1 build, no Supabase project credentials or deployment identity were available. A real hosted project, SMTP confirmation/recovery, Supabase advisors, optional full local Supabase Docker stack, and Vercel deployment were **prepared but not exercised in that run**. The hosted follow-up above records subsequent Supabase provisioning/advisors/role checks; actual Auth/email/browser deployment checks remain pending. Local success is not presented as a hosted-security/deployment guarantee.

## Known limitations and deliberate deferrals

- This is a controlled-pilot V1, not authorization for a broad intimate-data launch. Self-service export/permanent shared deletion, account recovery/device session management, backup retention guarantees, and broader lifecycle/legal review remain.
- Local auth is development only; production uses Supabase. The local schema initializer is V1-specific; future migration upgrade orchestration is still needed.
- Polling rather than websocket transport; remote changes may take four seconds to appear. No offline capture queue or installable native share extension.
- Custom-content sensitivity is chosen by the contributor; there is no automated explicit-content detector. Discreet previews cannot prevent copying by an authorized recipient or protect a compromised device.
- Snapshot retrieval currently suits pilot-size collections; server search/pagination and large-scale performance work are deferred.
- Conservative host classification only. Other items need an optional contributor-selected moment before Watch/Eat/Do can use them. No price/location/time/availability facts are fabricated.
- No external discovery, semantic/LLM search, Open Graph/image enrichment, or advanced preference inference.
- No rich explicit media, automatic sexual/worship completion records, full religious subsystem, prayer-time calculation, notification delivery, gestures/live presence, general chat, finance/bank links, continuous location, Wayfare merge, social feed, or premature services.

## Recommended next ten engineering tasks

1. Configure a dedicated Supabase pilot and Vercel preview; verify email callbacks, schema/grants, advisors, two-device sync, and A/B/C authorization with real provider sessions.
2. Finish the shared-data lifecycle agreement and self-service leave/export/delete paths, including explicit content, backups, and safety exceptions.
3. Implement verified account recovery, device/session listing/revocation, and stricter sensitive-operation session freshness before uncontrolled sensitive use.
4. Add production request/abuse rate limits and content-free operational error codes/metrics; keep raw relationship content excluded.
5. Run the documented 30-day two-person test and collect separate interviews about capture, return, decision usefulness, and voluntary participation.
6. Add server pagination/search and indexed query projections before collections grow beyond the pilot; keep the Home budget finite.
7. Introduce local schema migration orchestration and verify upgrades against existing synthetic fixtures alongside hosted migration checks.
8. Improve share-to-save ergonomics with a carefully scoped PWA/native share target when pilot evidence identifies friction, without caching sensitive data indiscriminately.
9. Add retryable provenance-aware enrichment only if useful, with SSRF protections and sensitivity policy before external processing; preserve save-first independence.
10. Evaluate realtime transport and richer resurfacing from observed pilot behavior, while preserving agency, finite choices, contextual separation, and no presence surveillance.

## Product/engineering review

The implemented objects make the shared home useful without a librarian, a chat inbox, or a relationship score. Attribution preserves two people rather than collapsing them into one taste. Question Cards add voluntary expression; sensitive/faith contexts reuse the same architecture with stronger boundaries. The home is finite and decisions can end in leaving the app together. Broader systems were deliberately deferred so the core vertical slice remains runnable and understandable.
