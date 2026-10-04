# Technical Direction

> This is architectural guidance for discovery. Technology choices should remain reversible until the V1 behavior is validated.

## Engineering objective

Build the smallest system that can reliably test pairing, capture, shared state, resurfacing and decision support while leaving room for later mobile integrations.

## Recommended shape

### Client
Mobile-first web/PWA for rapid iteration, with native/share-extension work introduced where needed to achieve genuinely low-friction capture.

A pure web app may be insufficient for the most important behavior if OS share-sheet capture is awkward. Treat capture ergonomics as a product requirement, not a framework preference.

### Backend
A shared backend is required early because the core unit is two users with synchronized state.

Capabilities:
- authentication;
- couple-space membership;
- relational/shared object storage;
- media metadata;
- reactions;
- event history;
- recommendation queries;
- optional realtime presence later.

### Database
A relational model is appropriate for early product state; PostgreSQL is a strong default.

## Conceptual data model

### User
- id
- display_name
- avatar
- created_at

### CoupleSpace
- id
- created_at
- state

### Membership
- couple_space_id
- user_id
- joined_at
- status

Constraint: active CoupleSpace has maximum two active members.

### Item
- id
- couple_space_id
- created_by
- type
- title
- note
- source_url
- source_type
- status (saved/considering/done/archived)
- created_at
- experienced_at

### ItemMetadata
Flexible type-specific metadata: location, price range, duration, media identifiers, etc. Avoid forcing every content type into columns prematurely.

### Reaction
- item_id
- user_id
- reaction/rating
- created_at / updated_at

Unique per relevant signal type/user/item.

### Experience
- item_id
- happened_at
- optional shared note/media

### Trace
For lightweight presence/expression objects with explicit retention rules.

### Goal
Later: purpose, target amount/value, progress semantics.

## Event model

Track product events needed for validation without creating surveillance analytics.

Useful events:
- item captured;
- capture source;
- extraction success/failure;
- partner reacted;
- item resurfaced;
- decision mode opened;
- candidate selected;
- item completed;
- return after inactivity.

Avoid collecting unrelated behavioral telemetry “just in case.”

## Content ingestion pipeline

1. Receive raw input.
2. Persist raw source immediately.
3. Return success to client.
4. Enrich asynchronously:
   - canonical URL;
   - Open Graph metadata;
   - content type;
   - image;
   - location/price only from trustworthy sources;
   - confidence/provenance.
5. Notify/update client silently.

**Persistence must precede enrichment.**

## Recommendation V1

Do not begin with an LLM-heavy architecture.

A transparent scoring model can combine:
- both users' reactions;
- saved-by-partner signal;
- category match;
- completion status;
- explicit constraints;
- recency/time context.

This is easier to debug and validate. AI can assist extraction, semantic retrieval and explanation after the core behavior works.

## Realtime

Realtime synchronization of saves/reactions is useful. Realtime broadcasting of user activity is a separate, higher-sensitivity feature and should not be accidentally enabled simply because the infrastructure supports it.

## External integrations

Potential later integrations:
- OS share extensions;
- maps/location;
- movie/media metadata;
- music;
- calendar;
- Wayfare;
- weather/events;
- optional AI providers.

Each integration should justify cost, privacy exposure and dependency risk.

## Engineering principles

- source provenance over guessed facts;
- graceful degradation;
- shared data exportability;
- minimal vendor lock-in during validation;
- secure defaults;
- no paid API dependency unless it materially validates the core hypothesis;
- feature flags for sensitive experiments;
- migration-friendly schema because taxonomy will change.
