# V1 Scope

## V1 question

**Will two people form the habit of intentionally preserving “we should” ideas in a shared space because they trust that those ideas will become useful later?**

Everything in V1 should help answer this question.

## V1 user story

1. Partner A sees something worth doing/watching/eating/remembering.
2. They share it to BetweenUs in seconds.
3. Partner B sees it and optionally reacts.
4. Days/weeks later, the couple wants something to do.
5. BetweenUs surfaces a small relevant subset of saved items.
6. They choose one.
7. Afterward, the item becomes part of their shared history.

## Must have

### 1. Pairing
Two accounts enter one shared space through an explicit invite.

### 2. Quick capture
- paste URL;
- share-sheet target where technically feasible in pilot;
- quick manual text item;
- optional one-line context;
- save succeeds even when enrichment fails.

### 3. Shared collection
- cards/items visible to both;
- source + contributor;
- automatic/basic categories;
- search/filter;
- recent and saved views.

### 4. Independent reactions
Both users can signal interest. Keep the vocabulary extremely small in the first experiment.

Suggested prototype:
- ❤️ / Interested
- 🤷 / Maybe
- Pass

Exact labels require UX testing; emojis are illustrative, not final.

### 5. Decision entry points
At minimum:
- Watch something
- Eat / go somewhere
- Do something

Return only a few saved candidates.

### 6. Explain resurfacing
Examples:
- “She saved this 3 weeks ago.”
- “You both marked this interested.”
- “You haven't tried this yet.”

### 7. Completion
Mark watched/tried/visited/done and collect a lightweight rating from each person.

### 8. Simple return experience
A calm summary of meaningful changes since the last visit, not an unread inbox.

## Should have if inexpensive

- automatic Open Graph metadata;
- duplicate URL detection;
- basic price/distance fields for places;
- rough budget constraint;
- PWA/mobile-first behavior;
- export of couple-space data;
- simple “leave for you” trace as an experiment.

## Explicitly not V1

- full chat;
- live location;
- bank integration;
- expense accounting;
- large external recommendation engine;
- rich calendar integration;
- comprehensive household management;
- complex AI agent;
- relationship analytics;
- compatibility scoring;
- gamified streaks;
- sexual-content-specific feature suite;
- 3D room/avatar world;
- Wayfare migration.

These exclusions protect the experiment, not the long-term vision.

## V1 UX performance targets

These are hypotheses to test, not promises:

- common share-to-save flow: **≤ 5 seconds** after choosing BetweenUs;
- no mandatory categorization during capture;
- reaction: one tap;
- decision setup: preferably ≤ 3 inputs;
- default recommendation set: 3 candidates, expandable if desired.

## Exit criteria

Proceed toward broader product development if a 30-day pilot shows:

- both members contribute;
- capture continues after novelty week;
- saved items are resurfaced and acted upon;
- users return at decision moments without being prompted;
- qualitative evidence of shared ownership (“our app”, “save it there”);
- users ask for adjacent capabilities because the core behavior is useful, not because the prototype is empty.

If capture happens but resurfacing does not create decisions, improve retrieval/context before expanding features.

If only one partner contributes/uses the product, investigate two-person onboarding/value asymmetry before building more categories.

If neither partner remembers to capture, the share flow or underlying problem hypothesis is failing.
