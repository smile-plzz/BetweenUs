# Technical Direction

> Development-ready architectural guidance for the first validation build. Keep implementation reversible where evidence is weak; be strict where privacy/security is structural.

## Engineering objective

Build the smallest reliable system that supports the two validated product loops:

**Memory:** Capture → Remember → Understand → Resurface → Decide → Do → Learn

**Expression:** Express → Respond voluntarily → Understand → Shared context

The first system must support exactly-two pairing, synchronized shared state, capture, reactions, Question Cards, sensitivity/discretion, basic resurfacing and later decision ranking without requiring an AI-heavy architecture.

## Recommended repository shape

A pragmatic monorepo can evolve toward:

```text
apps/
  web/                 # mobile-first web/PWA
  api/                 # only if backend logic is not colocated/serverless
packages/
  domain/              # shared types, validation, state machines
  ui/                  # reusable UI primitives
  config/              # lint/ts/build config
  intelligence/        # deterministic ranking/enrichment interfaces
supabase/ or db/
  migrations/
  policies/
  seeds/
  tests/
docs/
```

Do not create services merely to look scalable. The early product benefits more from a coherent domain model and strong authorization than microservices.

## Client

Start mobile-first. A PWA/web implementation is efficient for product iteration, but capture ergonomics are a product requirement. If OS share-sheet friction prevents the desired habit, introduce a native wrapper/share extension rather than defending the web stack.

Core screens for the first vertical slice:
- authentication/pairing;
- Our Space;
- Our Things;
- quick capture;
- item detail/reaction;
- Question Card create/view/respond;
- minimal settings for privacy/discreet previews.

## Backend / platform

A shared backend is required immediately.

Capabilities:
- authentication;
- User/CoupleSpace/Membership authorization;
- relational object storage;
- Question Card state;
- reactions;
- enrichment jobs;
- realtime synchronization where useful;
- event instrumentation;
- media storage later;
- recommendation queries.

PostgreSQL is the default relational model. A platform such as Supabase is a reasonable implementation choice because auth, Postgres, RLS, storage and realtime align with the problem, but the domain model should not depend on provider-specific magic unnecessarily.

## Canonical domain model

### User
- `id`
- `display_name`
- `avatar_url`
- `created_at`

### CoupleSpace
- `id`
- `state` (active / unpairing / closed)
- `created_at`

### Membership
- `couple_space_id`
- `user_id`
- `status`
- `joined_at`
- `left_at`

Invariant: maximum two active memberships.

### SharedObject
Universal durable object for captured/shared material.
- `id`
- `couple_space_id`
- `created_by`
- `kind` (link, place, media, recipe, product, activity, note, faith_reference, intimate_idea, etc.)
- `title`
- `body/note`
- `source_url`
- `source_type`
- `status` (saved / considering / done / archived)
- `sensitivity_class`
- `preview_policy`
- `created_at`
- `experienced_at`

Do not create a separate table/product architecture for every category unless its behavior truly differs.

### ObjectMetadata
Flexible type-specific structured metadata with provenance/confidence where extracted: location, price range, duration, external IDs, etc.

### Reaction
- `object_id`
- `user_id`
- `reaction_type`
- `value`
- timestamps

Signals remain attributable; do not collapse them into one couple rating.

### QuestionCard
- `id`
- `couple_space_id`
- `created_by`
- `prompt_source` (custom / curated / system)
- `prompt_text`
- `domain` (everyday / playful / affection / intimacy / faith / decision / other)
- `sensitivity_class`
- `state` (shared / open / resolved / archived)
- `created_at`
- `resolved_at`

### QuestionResponse
- `question_card_id`
- `user_id`
- `state` (answered / passed / not_now)
- `answer_payload`
- `created_at`
- `updated_at`

No row is required for unanswered. This avoids treating non-response as a submitted decision.

### Trace
Short-lived shared presence/expression object:
- gesture;
- leave-for-you;
- room trace;
- retention/expiry;
- sensitivity.

### Experience
Optional ordinary-object completion/memory state. Do not automatically create sexual-performance or worship history.

### Goal
Later shared-living primitive for purpose funds/plans. Not required for initial vertical slice.

## Authorization / RLS

Authorization is a first-class deliverable.

For every couple-scoped table:
- reads require active membership in the row's CoupleSpace;
- writes require active membership and correct actor identity;
- users cannot spoof `created_by`/`user_id`;
- cross-couple access must fail even if an ID is guessed;
- unpaired/revoked membership must stop future sensitive reads immediately.

Write automated policy tests before adding explicit media/location.

## Content ingestion pipeline

1. Client submits raw input.
2. Validate membership and persist SharedObject immediately.
3. Return success to client.
4. Enrich asynchronously:
   - canonical URL;
   - Open Graph metadata;
   - content type;
   - safe preview image;
   - location/price only from trustworthy evidence;
   - confidence + provenance.
5. Update object/realtime client.

**Persistence precedes enrichment.** AI failure must never lose a capture.

## Question Card state machine

```text
DRAFT (client/local optional)
  -> OPEN
      participant A/B independently: unanswered | answered | passed | not_now
  -> RESOLVED (explicit or policy-driven)
  -> ARCHIVED
```

The global card state must not overwrite participant state. Pass/Not now are valid outcomes, not errors. No automatic reminder loop should be coupled to the state machine.

## Sensitivity architecture

Do not bolt this on later. Shared objects/cards/traces should carry sensitivity/preview policy from the beginning.

At minimum distinguish:
- ordinary;
- private-couple;
- explicit-intimate;
- higher-sensitivity contextual classes as needed.

Sensitive payloads must be excluded/redacted from routine analytics and error logs. Notification rendering must consult sensitivity/preview policy.

## Event model for validation

Track behavior, not raw relationship content.

Useful events:
- `pair_invite_created`
- `pair_joined`
- `object_captured`
- `capture_enrichment_succeeded/failed`
- `reaction_set`
- `question_card_created`
- `question_card_answered/passed/not_now`
- `object_resurfaced`
- `decision_opened`
- `candidate_selected`
- `object_completed`
- `return_after_inactivity`

Properties should be structural (domain, source type, latency, sensitivity class where safe), not raw answer/note/explicit text.

## Realtime

Use realtime for shared-state synchronization (new object, reaction, card response) where it improves the room feeling. Realtime infrastructure does **not** imply broadcasting all user activity.

Live presence/location are separate higher-sensitivity product capabilities and should remain feature-flagged/off until designed.

## Recommendation V1

Start deterministic and explainable.

Candidate score can combine:
- explicit intent/category match;
- Partner A signal;
- Partner B signal;
- saved-by-partner signal;
- not-yet-completed;
- explicit time/budget/distance constraints;
- modest recency/context weighting.

Return a small set plus reason codes that UI can turn into plain explanations. Avoid LLM-generated ranking as the source of truth.

## Intelligence integration boundary

Define interfaces so AI providers can be swapped/disabled:
- `enrich(sharedObject)`
- `classify(sharedObject)`
- `semanticSearch(query, coupleSpace)`
- `suggestPrompts(context)`
- `explainRecommendation(reasonCodes)`

Sensitive-domain policy should run **before** an external provider call and decide whether content is eligible to leave the system.

Faith source retrieval should use a vetted/provenanced corpus, not unconstrained generation.

## Notifications

Notification payload generation is server-side policy, not arbitrary client text.

Rules:
- generic by default for sensitive objects/cards;
- never include explicit media in push payloads;
- respect user preview preference;
- no guilt/reminder loops for unanswered Question Cards;
- no partner worship-completion notifications.

## Testing priorities

### Domain tests
- maximum-two membership invariant;
- Question Card participant states;
- sensitivity/preview rules;
- ranking reason codes.

### Authorization tests
- member A/member B access works;
- unrelated user cannot read/write;
- spoofed actor IDs rejected;
- unpaired member loses access;
- sensitive media/object paths enforce membership.

### Product-flow tests
- capture succeeds when enrichment fails;
- two clients synchronize reaction/card changes;
- Pass/Not now never creates pressure/reminder state;
- sensitive notification is redacted;
- recommendation explanation matches actual reason codes.

## Deployment / environments

Use at least:
- local/dev;
- preview/staging;
- production/pilot.

Keep production/pilot data separate from development seeds. Never copy real intimate couple data into developer fixtures/logs.

## Immediate vertical slice

Build this end-to-end before broad feature work:

1. User A signs in and creates CoupleSpace.
2. A invites User B; B joins.
3. A captures a real URL/note.
4. B sees it and reacts.
5. A creates a Question Card.
6. B answers/passes/not-now; A sees the submitted state.
7. Both return to Our Space and see a finite composed state.
8. Basic analytics confirm flow without recording raw private content.

If this slice is not delightful/reliable, do not rescue it by adding finance, location, richer sex modules, faith modules, Wayfare, or a giant recommendation system.

## Engineering principles

- secure shared-state foundation before feature abundance;
- source provenance over guessed facts;
- persistence before enrichment;
- graceful degradation;
- privacy by data minimization;
- no raw sensitive telemetry;
- shared data exportability eventually;
- feature flags for sensitive experiments;
- migration-friendly schema;
- minimal vendor lock-in where practical;
- optimize for learning, not architectural theater.
