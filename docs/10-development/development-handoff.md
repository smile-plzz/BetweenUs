# Development Handoff

## Purpose

This is the bridge from product discovery to implementation. It does not replace the product documentation; it converts the agreed intent into a build order and definition of done.

## What is frozen for the first development cycle

Do not reopen these without new evidence:
- exactly two active members per CoupleSpace;
- digital-home/shared-space metaphor;
- not a general messenger;
- no private content silo inside the current shared-space concept;
- intelligence is environmental, not a third persona;
- memory + expression are the two core loops;
- Question Cards are a core primitive;
- Intimacy & Desire is a legitimate first-class relationship dimension;
- explicit sexual tone can coexist with reverent spiritual tone;
- participation remains voluntary and past preference never equals current consent;
- Faith Together is companionship, not piety tracking;
- discovery is finite/explainable;
- money is decision support, not partner accounting;
- Wayfare stays separate;
- V1 validates behavior before ecosystem expansion.

See `docs/09-decisions/decision-log.md` for the full rationale.

## Development objective

Deliver a private pilot where two adults can pair, inhabit the same shared space, capture something meaningful, react to it, ask/answer a Question Card, return later, and see useful shared context—without exposing sensitive content or requiring AI to make the core flow work.

## Epic 1 — Couple foundation

### Stories
- As Partner A, I can create a CoupleSpace and invite exactly one partner.
- As Partner B, I can accept and enter the same shared space.
- As either member, I see the same shared objects while my actions remain attributable to me.
- An unrelated account cannot access the space even with guessed IDs.

### Acceptance criteria
- maximum two active memberships enforced server/database-side;
- invite is single-space scoped and expires/revokes appropriately;
- authorization tests cover cross-couple access;
- shared-space contract shown during pairing;
- sensitive capabilities are not silently enabled by pairing.

## Epic 2 — Shared memory / capture

### Stories
- I can paste/save a URL or short text in seconds.
- Save succeeds even if enrichment fails.
- My partner sees the item and who saved it.
- Either of us can react independently.
- We can retrieve recent/shared items without maintaining folders.

### Acceptance criteria
- object persists before enrichment;
- source preserved;
- basic metadata enrichment asynchronous;
- duplicate handling does not destroy source evidence;
- reaction is one low-friction action;
- capture/reaction sync between both clients;
- no raw note/content in routine analytics.

## Epic 3 — Our Space

### Stories
- Opening BetweenUs feels like entering a finite shared place, not an inbox/feed.
- I can see a few meaningful current objects/traces.
- Returning after absence does not make me feel behind.

### Acceptance criteria
- Home composition has a finite item budget;
- no infinite feed;
- no unread-count guilt/streak loss;
- “while you were away” can summarize structural changes without exposing sensitive text in unsafe contexts;
- empty/new states lead to a useful first shared action.

## Epic 4 — Shared Question Cards

### Stories
- Either partner can write a question and place it in Our Space.
- I can Answer, Pass, choose Not now, or leave it alone.
- Submitted answers are visible to both and attributable.
- The mechanic works for ordinary/playful prompts and can safely support a scoped adult-intimacy domain.

### Acceptance criteria
- response state is per participant;
- unanswered is not stored as rejection;
- no automatic guilt/reminder loop;
- shared visibility is clear before answer submission;
- sensitivity metadata controls notification preview;
- raw answers excluded from analytics/error logs;
- domain/tone are metadata, not separate chat systems.

## Epic 5 — Trust/discretion foundation

### Stories
- Sensitive content does not unexpectedly appear on my lock screen.
- Couple data is inaccessible outside the paired space.
- The system can distinguish ordinary from explicit-sensitive objects/cards.

### Acceptance criteria
- RLS/server authorization tests pass;
- sensitive notification defaults are generic;
- sensitive data is redacted from telemetry;
- feature flags exist for explicit-intimacy experiments;
- no external AI receives sensitive raw content by default;
- documented limitations are not marketed as guarantees.

## Epic 6 — Basic resurfacing / decision proof

Start after enough real captures exist.

### Stories
- When we want something to watch/eat/do, we can ask BetweenUs before searching from zero.
- We receive a few candidates from our own history.
- Each candidate explains why it fits.

### Acceptance criteria
- default result set finite (target 3);
- deterministic ranking/reason codes;
- shared history preferred to external discovery;
- constraints can include only what is actually known/provided;
- no fabricated location/price facts.

## Domain expansions after the vertical slice

### Intimacy & Desire
Use the existing Question Card/shared-object/sensitivity primitives. Do not build a parallel sex app. Expand tone controls, prompt libraries, preference context and explicit shared objects only after the base flow/security is stable.

### Faith Together — Islam-first
Use Question Cards/shared objects/invitations. First candidate flow: **Pray together?** plus shared dua/reflection. Use verified/provenanced religious content. Do not build prayer-performance analytics.

### Presence
Start with low-sensitivity gestures/traces. Live location/current-activity broadcasting remains later and separately permissioned.

### Shared Living / Finance / Wayfare
Not part of the first vertical slice.

## Definition of done for first pilot

The build is pilot-ready when:
- two real accounts pair successfully;
- both can capture/react from separate devices;
- Question Cards work end-to-end;
- sensitivity/notification rules are enforced;
- unauthorized cross-couple access is tested and blocked;
- core flows work when enrichment/AI is unavailable;
- telemetry measures structural events without raw private content;
- no critical flow depends on a giant settings/profile questionnaire;
- the team can run the 30-day test described in `docs/07-validation/30-day-couple-test.md`.

## Do not build yet

- full messenger;
- continuous location;
- bank/account aggregation;
- relationship/compatibility/libido/piety scores;
- giant kink taxonomy;
- sexual-performance history;
- prayer-completion comparison;
- infinite recommendation feed;
- 3D/avatar room;
- comprehensive household suite;
- autonomous relationship agent;
- Wayfare merge.

## Build-order checklist

1. scaffold app/environment;
2. auth;
3. User/CoupleSpace/Membership schema + policies;
4. pairing flow;
5. SharedObject + capture;
6. Our Things + reactions;
7. Our Space composition;
8. QuestionCard + QuestionResponse state machine;
9. sensitivity/preview/notification policy;
10. validation telemetry;
11. controlled two-person pilot;
12. resurfacing + first decision mode using accumulated real data.

## Final implementation test

At every pull request ask:

> **Does this make the shared home more useful or more alive without adding maintenance, pressure, surveillance, or unnecessary complexity?**

If not, it should not enter the first development cycle.