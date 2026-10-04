# Intelligence Model

## Principle

> **The house is smart; there is no digital roommate.**

BetweenUs intelligence is environmental infrastructure. There is no named/gendered assistant and no artificial third participant in the relationship. Intelligence appears through organization, retrieval, ranking, explanation, prompt selection and timely resurfacing.

The model should know **what the couple intentionally taught the home**, not pretend to psychologically know the couple.

## Four engines

### 1. Memory Engine
Purpose: turn messy shared fragments into durable context.

Responsibilities:
- ingest URLs/text/images and structured shared objects;
- preserve source/evidence before enrichment;
- extract title/preview/type;
- classify into useful views;
- detect duplicates;
- attach metadata with provenance/confidence;
- support semantic retrieval;
- preserve contributor and independent reactions;
- track ordinary lifecycle from possibility to experience;
- apply sensitivity/retention metadata where relevant.

**Rule:** saving never depends on successful extraction or AI.

### 2. Expression Engine
Purpose: help the shared space support lightweight communication without becoming chat.

Responsibilities:
- suggest optional Question Cards/prompts;
- match prompt domain and tone to explicitly enabled context;
- remember voluntarily submitted answers where retention is appropriate;
- avoid repeatedly surfacing passed/ignored prompts;
- support affectionate/playful/intimate/spiritual contexts without flattening them into one voice;
- never turn participation volume into relationship scoring.

For sexual context, the engine may use intentionally shared preferences to make a prompt relevant, but it must never infer current consent or provide pressure tactics. For faith context, it may retrieve vetted material but must not judge religiosity or fabricate scripture/hadith.

### 3. Decision Engine
Purpose: reduce shared history into a few actionable options.

Inputs may include:
- explicit intent (watch/eat/go/do/etc.);
- Partner A signals;
- Partner B signals;
- overlap/disagreement;
- saved-by-partner signal;
- completion state;
- time;
- rough budget;
- distance/travel time;
- mood/energy when explicitly provided;
- current/coarse location when explicitly enabled;
- source confidence/availability.

Output:
- usually 3–5 candidates;
- plain-language reason per candidate;
- internal confidence/unknowns;
- ability to adjust one useful constraint or expand results.

### 4. Discovery Engine
Purpose: introduce a small number of new possibilities when the shared collection is insufficient or exploration is explicitly wanted.

Rules:
- shared history normally outranks generic discovery;
- clearly distinguish saved vs. externally discovered options;
- use finite recommendation sets, not an engagement feed;
- explain why a new item plausibly fits;
- respect sensitive-domain boundaries.

## The Us model

Do **not** collapse the couple into one preference vector.

Maintain conceptually:
- Partner A's attributable signals;
- Partner B's attributable signals;
- shared/overlap signals for a specific object or context;
- disagreement;
- unknown/unexplored state;
- time/version where preferences can change.

The useful output is an **Us layer**, not an assertion that both people have identical tastes.

A candidate may be excellent when one partner is enthusiastic and the other neutral. A mutual match should not require symmetry.

## Context and tone model

Tone is contextual, not global. The system can be:
- practical for planning;
- warm/tender for affection;
- playful for gestures/games;
- explicit/raw where the couple has enabled and used sexual context;
- reverent for faith experiences.

Never let one domain's tone leak into another. In particular, faith does not sanitize sexual language, and sexual context must never contaminate spiritual/general recommendations.

## Explainability

Every meaningful recommendation should be expressible in human terms.

Good examples:
- “You both marked this interested.”
- “Your partner saved this and you liked two similar comedies.”
- “It fits the budget you set for tonight.”
- “It is close enough for the time you have.”
- “You have not explored this category together yet—this is an exploration pick.”

Avoid pseudo-authority such as “97% relationship compatibility,” “your partner secretly wants…,” or “the app knows she will like this.”

## Proactivity ladder

### Level 0 — Retrieval
Manual search/filter.

### Level 1 — On-demand intelligence
The couple asks for a decision or retrieval.

### Level 2 — In-app resurfacing
Home quietly surfaces something timely.

### Level 3 — Optional nudge
A strong contextual signal creates a restrained notification/in-app suggestion.

### Level 4 — Integrated context
Calendar/location/weather/budget and other sources improve timing with explicit permissions.

V1 should live mainly at Levels 0–2.

## Sensitive-domain rules

### Sexual / intimate
- do not infer current consent from preference/history;
- do not generate persuasion strategies for overcoming refusal;
- do not score libido, performance or compatibility;
- treat explicit content/text as highly sensitive for storage, previews and third-party processing;
- prefer user-authored/shared context over speculative inference.

### Faith
- retrieve from vetted/provenanced source material;
- never fabricate Qur’an/hadith quotations/references;
- do not generate piety scores or infer faith level;
- do not interpret missed/non-participation as a moral or relationship signal;
- distinguish source text from product/AI explanation.

### Location / presence
- use only enabled data at the granularity needed;
- do not infer suspicious meaning from absence or disabled sharing;
- do not create proof-of-location workflows.

### Finance
- use rough budget/purpose context to support choices;
- do not infer fairness, contribution quality or relationship effort from spending.

## Data minimization

Collect only information that materially supports a chosen shared experience. BetweenUs can become unusually sensitive; “might be useful to AI later” is not sufficient justification.

Sensitive raw text/media should not automatically be sent to external AI providers. Core storage, retrieval and user-authored Question Cards must work without AI.

## Failure behavior

If extraction fails:
- keep the item;
- preserve source;
- mark unknowns;
- allow correction;
- never fabricate location/price/source facts.

If recommendation confidence is weak:
- say why choices are limited;
- prefer known shared evidence;
- ask for one useful constraint;
- do not manufacture certainty.

If faith-source retrieval is uncertain:
- do not present generated religious text as authoritative;
- surface only verified source material or clearly label non-authoritative commentary.

## V1 implementation stance

Do not begin with an LLM-heavy architecture. Start with deterministic/shared-state primitives and transparent ranking. Use AI selectively for enrichment, semantic retrieval, categorization and explanation after the core behavior works.

The durable advantage is not “having AI.” It is building a **relationship-specific retrieval and decision system from intentionally shared context**.
