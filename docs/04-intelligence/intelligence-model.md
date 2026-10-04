# Intelligence Model

## Principle

**BetweenUs should be intelligent without becoming a character.**

There is no named assistant. Intelligence appears through organization, retrieval, ranking, explanation and timely resurfacing.

## Three engines

### 1. Memory Engine

Purpose: turn messy captured fragments into durable shared context.

Responsibilities:
- ingest URLs/text/images;
- preserve original source/evidence;
- extract title/preview/type;
- classify into useful views;
- detect duplicates;
- attach metadata;
- support semantic retrieval;
- preserve contributor and reactions;
- track lifecycle from idea to experience.

Rule: automatic extraction must never be required for successful saving.

### 2. Decision Engine

Purpose: reduce a large shared collection into a few actionable options.

Inputs may include:
- explicit intent (watch/eat/go/do);
- each partner's signals;
- mutual preference strength;
- whether an item is already completed;
- recency without over-weighting it;
- available time;
- rough budget;
- distance/travel time;
- mood/energy where explicitly provided;
- current location where consented;
- availability/context.

Output:
- 3–5 candidates;
- simple explanation per candidate;
- confidence/unknowns internally;
- ability to expand or adjust constraints.

### 3. Discovery Engine

Purpose: introduce a small number of new possibilities when shared history is insufficient or exploration is requested.

Discovery should learn from the couple but remain transparent about external vs. saved items.

It must not default to an infinite engagement feed.

## The “Us” model

Do not collapse two people into one vector/profile.

Conceptually maintain:

- Partner A preference signals;
- Partner B preference signals;
- intersection/compatibility for a specific item/context;
- uncertainty due to missing data.

A candidate can be useful even when only one person strongly wants it and the other is neutral. Ranking should not require identical taste.

## Explainability

Every meaningful recommendation should be expressible in human terms.

Examples:

- “You both marked this interested.”
- “She saved this a month ago and you liked two similar comedies.”
- “This is within the budget you set for tonight.”
- “It is close enough for the time you have.”
- “Neither of you has rated this category yet—this is an exploration pick.”

Avoid pseudo-scientific outputs such as “97% relationship compatibility.”

## Proactivity ladder

Do not begin with maximum proactivity.

### Level 0 — Retrieval
User searches/filters manually.

### Level 1 — On-demand intelligence
User asks “what should we watch?” and system ranks.

### Level 2 — In-app resurfacing
Home quietly surfaces something timely.

### Level 3 — Optional nudge
System suggests something when strong context exists, e.g. a weekend + saved nearby activity.

### Level 4 — Integrated context
Calendar/location/weather/budget context improves timing, with explicit permissions.

V1 should live mainly at Levels 0–2.

## Data minimization

The product can become extremely sensitive as it learns relationship preferences. Collect only what materially improves the shared experience.

Do not collect intimate, location, financial or behavioral data merely because it might someday improve a model.

## AI failure behavior

If classification fails:
- keep the item;
- label unknowns;
- allow correction;
- never fabricate price/location/source facts.

If recommendation confidence is weak:
- say why choices are limited;
- prefer saved evidence;
- ask for one useful constraint rather than hallucinate certainty.

## Long-term opportunity

With enough history, BetweenUs can become a form of **relationship-specific retrieval system**: not a model that claims to understand the relationship psychologically, but a system that remembers the couple's expressed preferences and shared experiences better than generic consumer software can.
