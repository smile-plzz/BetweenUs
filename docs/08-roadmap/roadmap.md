# Roadmap

The roadmap is **evidence-gated, not date-gated**. The vision is intentionally broad; implementation should be disciplined.

## Phase 0 — Product definition **(complete enough to begin implementation)**
Established:
- digital-home thesis and product principles;
- two core loops: memory and expression;
- JTBD/behavior framing;
- PRD and feature map;
- Shared Question Cards;
- Intimacy & Desire principles;
- Islam-first Spiritual Intimacy / Faith Together model;
- trust/privacy boundaries;
- technical direction;
- validation plan;
- open questions and decision log.

Phase 0 does not mean every product-policy question is solved. It means the architecture is coherent enough to build the validation product without re-litigating the vision.

## Phase 1 — Foundation + Capture
**Goal:** prove saving is effortless enough to compete with “just send it in chat.”

Build:
- authentication;
- exactly-two pairing and CoupleSpace;
- shared object model;
- URL/manual capture;
- source preservation + asynchronous metadata;
- mobile-first Our Space / Our Things;
- reactions;
- basic filters/search;
- realtime shared-state sync;
- instrumentation;
- discreet notification foundation.

Exit: both members repeatedly capture real content and naturally retrieve it.

## Phase 1B — Expression primitive
Can be developed alongside late Phase 1 once pairing/shared state is stable.

Build:
- Question Card entity/state model;
- create/send/answer/pass/not-now/resolve;
- everyday and affectionate prompt categories;
- carefully scoped adult intimacy prompts behind appropriate controls;
- generic/discreet notifications;
- retention/memory controls.

Exit: cards create useful candid interaction without feeling like another inbox or messenger.

## Phase 2 — Memory activation + Decisions
**Goal:** prove stored context becomes action.

Build:
- resurfacing;
- semantic/basic search as justified;
- Watch/Eat/Do decision modes;
- finite ranked candidates;
- explanation layer;
- completion + ratings/memory;
- “While you were away.”

Exit: saved items influence real decisions.

## Phase 3 — Shared Presence
Experiments:
- leave something for you;
- lightweight affectionate/flirtatious gestures;
- shared-room presence;
- subtle traces;
- optional higher-sensitivity presence only after controls are proven.

Exit: presence creates closeness without pressure/noise.

## Phase 4 — Relationship dimensions
Expand validated primitives rather than creating mini-apps.

### Intimacy & Desire
- richer couple-controlled tone/intensity;
- preference/curiosity/boundary context;
- explicit Question Card decks;
- intimacy-aware suggestions with strict current-consent separation;
- strong accidental-exposure controls.

### Spiritual Intimacy / Faith Together
Islam-first validation:
- pray-together invitation;
- dua for us / dua for you;
- Qur'an/authenticated-hadith sharing with provenance;
- faith Question Cards;
- reflection/read-together objects;
- later Ramadan/Jumu'ah/charity/shared-practice moments.

No sexual performance analytics or religious performance analytics.

## Phase 5 — Contextual Intelligence
- semantic retrieval;
- richer preference learning from intentional shared signals;
- explainable external discovery;
- time/distance/rough-budget reasoning;
- contextual resurfacing;
- optional nudges;
- vetted retrieval for faith content rather than freeform fabrication.

Exit: recommendations are measurably more useful than manually browsing the collection.

## Phase 6 — Shared Living
Only after core use is established:
- grocery/shared lists;
- goals;
- trip/purpose funds;
- lightweight plans;
- calendar context;
- location-aware features with explicit controls.

## Phase 7 — Specialized integrations
Potential:
- Wayfare handoff/integration;
- richer media;
- food/recipe layer;
- gifts/wants;
- games/activities;
- seasonal relationship experiences.

## Development rule
A feature enters active development only if it either:
1. strengthens an already validated behavior;
2. is required infrastructure for a committed core primitive; or
3. tests a clearly stated new hypothesis.

“Couples might use this” is not sufficient prioritization evidence.

## Immediate build order
1. repo/app scaffold and environments;
2. auth + User/CoupleSpace/Membership;
3. shared object schema + RLS/authorization;
4. capture API/UI + enrichment job boundary;
5. Our Space / Our Things;
6. reactions + realtime shared state;
7. Question Card schema/state machine;
8. discreet notifications and sensitive-content metadata;
9. instrumentation for 30-day test;
10. resurfacing/decision prototype after real data begins accumulating.
