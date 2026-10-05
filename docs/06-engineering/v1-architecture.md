# Implemented V1 architecture

Read `technical-direction.md` and the canonical `../10-development/development-handoff.md` first. This describes the implementation, not a replacement product vision.

## One application, two deployment paths

The root is a Next.js App Router application with TypeScript, React, Zod, and a small CSS system. There are no extra services or domain-specific mini-apps. Use Node 24 LTS and the committed lockfile.

- **Supabase:** real Auth, PostgreSQL, RLS, and authenticated RPC. Every request validates the session through `auth.getUser()`. Requests to the database use the person's session and publishable key, never a service-role key. Server routes refresh cookies. Static HTML contains no couple content.
- **Local development:** PGlite runs actual PostgreSQL with the same schema, grants, constraints, RLS policies, and RPC functions. A small local-only auth adapter issues opaque, hashed, expiring sessions after scrypt password verification. Identity is set server-side in a transaction; requests cannot supply an actor. Disk state persists under `.local/`. This is a single-process development path, not production auth or an in-browser simulation, and is blocked on Vercel.

`BETWEENUS_BACKEND` is mandatory; a configuration error never silently falls back to another database. The SQL migration is generated with the Supabase CLI. `db/schema.sql` mirrors the initial migration for local initialization and testing. An automated check keeps the two identical. For future releases, add migrations rather than rewriting one already applied to a shared database. The initial local adapter expects this V1 schema; future local upgrade orchestration is a follow-up task. Disposable databases from earlier development snapshots must be reset explicitly.

## Boundaries

- `src/domain/`: domain types, strict input validation, participant response semantics, privacy policy, a finite prompt set, and deterministic recommendation reason codes.
- `src/server/`: validated session identity, provider adapter, database RPC boundary, same-origin mutation checks, and content-free errors.
- `src/app/api/`: authentication, shared-space mutations/snapshot, and explicitly opened details.
- `src/components/`: mobile shared home, collection, capture, reactions, questions, privacy controls, and decisions.
- `supabase/migrations/`: production SQL history; `supabase/config.toml` supports optional local Supabase.
- `tests/`: actual PostgreSQL authorization/domain tests and a three-account browser journey.

## Shared data and authorization

`profiles`, `couple_spaces`, and `memberships` form the foundation. A partial unique index permits one active space per person. A database trigger locks the parent space before checking that no more than two active members exist. Pairing also locks the actor and space; invite consumption is serialized, single-use, space-scoped, and expires after 48 hours. Only a SHA-256 hash of the 256-bit invitation token is stored. Replacement/revocation invalidates previous invites. Invite links use a URL fragment, which is not sent in HTTP requests; the code also works without a link.

`shared_objects` preserves source, title/body, contributor, timestamps, kind, category, status, sensitivity, generated preview policy, and structured metadata. URL, note, and generic idea share one architecture. URL duplicates keep each contribution/source rather than destructively merging. Reactions use `(object_id, user_id)` as their key and remain independent and reversible.

`question_cards` and `question_responses` keep card lifecycle separate from participant state. No row means unanswered. Answer, Pass, and Not now use one response row per person; Pass/Not now clear the answer. A participant can revise or withdraw their own response. Submitted answers appear immediately and are attributable. Either member can put a card away. No response timer or reminder job exists. On Home, at most one recent card is shown, and a member's submitted state removes it from their own active home surface. Questions remain retrievable.

All exposed tables have RLS. A/B are allowed, C is denied, parent object checks apply to reactions/responses, and actor identity is checked on every write. Anonymous table/RPC grants are revoked explicitly, including Supabase's default grants. Immutable attribution/space IDs cannot be updated by application roles. Membership writes are unavailable to clients; narrow private security-definer pairing helpers exist only because onboarding needs to add a membership before member RLS can apply. They use a fixed empty search path, checked `auth.uid()`, contract/adult confirmation, locks, and restricted execute grants. Public RPC functions run as the authenticated caller. This is tested using `SET LOCAL ROLE authenticated`, not the owner role.

## Synchronization and save-first behavior

Two clients synchronize by reloading an authenticated, uncached snapshot every four seconds while visible, plus immediately after changes and on returning to the tab. This V1 deliberately uses polling rather than broadcasting presence or maintaining a websocket subscription. No online/last-seen/read-receipt signal is collected. Home has a fixed budget: three recent objects, one Question Card, one eligible resurfaced item, and three decision shortcuts.

Capture commits before `next/server`'s `after()` runs metadata work. The current provider extracts only the URL hostname locally; it never fetches arbitrary URLs, exposes IPs to saved hosts, performs Open Graph scraping, or sends content to AI. Failure cannot roll back capture. Metadata is marked with its source/confidence. Known media hosts get conservative basic categories without mandatory manual organization; other content stays `other` unless the contributor chooses a moment. Price, distance, availability, and compatibility are never guessed.

Recommendations use stored category, independent positive/negative reactions, contributor, recency, and unfinished state. They return at most three with reason codes and exclude any “Not for me,” completed/archived item, and all sensitive/intimate/faith objects from ordinary Watch/Eat/Do decisions. Candidate selection means “considering,” not an assertion that both people agreed or did the activity.

## Discretion and optional domains

`ordinary`, `private-couple`, and `explicit-intimate` apply across objects/cards. The collection RPC redacts sensitive titles, bodies, links, metadata, prompts, and answer payloads. Details require a separate authorized fetch after deliberate opening. Tab hiding dismisses open detail/draft surfaces; revoked access removes open sensitive content after the next synchronization. Auth failure clears the shared view. This does not guarantee protection from screenshots, browser history inspection, a compromised device, or a recipient copying legitimately viewed content.

Intimacy text is gated by an installation-level flag and both members' independent opt-in. Either person can withdraw; explicit rows become inaccessible through RLS. Intimacy category/cards always require explicit sensitivity. Source content is not automatically scanned: contributors must choose the appropriate discretion level for custom content. No explicit media, sensitive push payload, third-party AI, sexual completion history, or performance analytics exists.

Faith Together is optional and requires both opt-ins. The proof is a small personal dua/reflection Question Card and shared-object category, with Answer/Pass/Not now. No Qur'an/hadith corpus is shipped, so there are no fabricated quotations or unsupported religious authority claims. Neither faith nor sexual objects support completion tracking.

`events` stores only an allowlisted structural event name, actor, space, and timestamp. There is no arbitrary JSON payload column. No external analytics or exception SDK is installed. Database constraint/error detail is never copied into routine logs. There are no push notifications or external previews of couple content. A generic server privacy helper is prepared for a future notification boundary; shipping a delivery provider needs a fresh policy review.

## Lifecycle decision for the controlled pilot

Either member can close the space, immediately marking both memberships left, disabling optional capabilities, closing the space, and revoking invitations. Neither can access the old home or transfer it to a new partner. Accounts remain usable for a new home. Stored records are retained but inaccessible to members. Contributors can delete their own objects while paired. Permanent shared-data deletion/export and account recovery require the controlled-pilot operator procedure in `pilot-operations.md`; they are not self-service features. This is a limited pilot decision, not resolution of the repository's broad-production lifecycle questions.

## Verification limits

The same PostgreSQL policies and three-account browser flow are verified locally. A hosted Supabase project, email delivery/confirmation, Supabase security advisors, and Vercel deployment require operator credentials and remain separately verifiable. Build compatibility is established; a deployment is not claimed. Before broader sensitive use, finish self-service lifecycle, recovery/session revocation, production rate limits, backup retention, and provider-specific security verification.
