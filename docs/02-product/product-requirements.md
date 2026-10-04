# Product Requirements Document — Concept v0.2

## Product
BetweenUs

## Stage
Discovery / behavioral validation

## Product definition
BetweenUs is a private digital home for exactly two consenting adults in a romantic relationship. It combines shared memory, presence and expression, intimacy and desire, shared decisions/discovery, and eventually shared living.

The initial validation wedge remains intentionally narrow, but product architecture must not treat intimacy as an unrelated future module.

## Objective
Validate whether a paired couple will use a low-friction shared space to preserve meaningful context, express themselves to each other, and later rely on that context for real shared moments and decisions.

## Target user
Two consenting adults in an established romantic relationship who already exchange digital content, preferences and ideas frequently and make recurring joint decisions.

## Primary problems
1. Meaningful shared ideas disappear in chronological communication tools.
2. Generic recommendation systems lack couple-specific context.
3. Many relationship signals—especially desire, fantasies, preferences and awkward-to-initiate questions—can be difficult to express naturally even when both partners want openness.
4. Existing tools tend to separate utility, affection and intimacy rather than treating them as dimensions of one shared life.

## Product hypothesis
If BetweenUs makes capture and expression extremely lightweight, preserves intentionally shared context, and resurfaces it when useful, the couple will begin treating it as a durable shared environment rather than another app they must maintain.

## Product pillars
1. **Shared Memory** — preserve things that matter and make them useful later.
2. **Presence & Expression** — create lightweight co-presence without rebuilding messaging.
3. **Intimacy & Desire** — help consenting adult partners express and understand sexual/romantic preferences, curiosity and desire without scoring or pressure.
4. **Shared Decisions & Discovery** — turn shared context into small actionable choices.
5. **Shared Living** — later support practical coordination, goals and money-as-enabler.

## Core entities
### Couple Space
A paired environment containing exactly two member identities and intentionally shared content.

### Item
A durable shared object: place, media, recipe, product, activity, note, image, link, intimate idea/content, etc.

### Question Card
A structured prompt placed into the shared space by a partner or suggested by the system. It supports attributable responses without creating a chat thread.

### Response
A participant state on a Question Card: answered, passed, not-now, or unanswered. Submitted answers are shared.

### Signal
A lightweight attributable expression such as interested, maybe, love, not-for-me, rating or vote.

### Context
Metadata that makes an object actionable: category, time, location, distance, price/budget, mood, source and timestamps.

### Experience
A possibility that became something the couple actually did or consumed.

### Trace
A lightweight sign of partner presence/expression in the shared home.

## Functional requirements — foundational

### FR1 Pairing
- One user creates a couple space and intentionally invites the second.
- Both are equal members.
- Onboarding clearly states that content intentionally submitted to the couple space is shared.
- Sensitive capabilities can require additional feature-level controls.

### FR2 Fast capture
- URL, manual item and mobile share-sheet ingestion.
- Save succeeds even when enrichment fails.
- Required fields are minimized.

### FR3 Shared collection
- Both partners see the same intentionally shared items.
- Organization is primarily automatic.
- Source/contributor attribution is preserved.

### FR4 Partner signals
- Each partner reacts independently.
- Both signals remain visible.
- Disagreement is valid data, not a relationship failure.
- No compatibility/relationship score is derived.

### FR5 Shared Question Cards
- Either partner can create a question and place it into the shared space.
- The system may offer optional prompt suggestions.
- Questions may be everyday, playful, romantic or sexual.
- A partner can answer, pass, choose Not now, or leave the card unanswered.
- Submitted answers are visible to both partners.
- The UI communicates the shared nature of an answer before submission.
- No penalty, guilt mechanic, streak loss or repeated pressure follows non-participation.
- The interaction must feel like an object in the shared room, not a conventional message thread.

Detailed spec: `docs/03-experience/shared-question-cards.md`.

### FR6 Intimacy & Desire
BetweenUs must support intimacy as a first-class product domain for consenting adult couples rather than burying it under a generic future-feature label.

The system should be capable of representing intentionally shared:
- sexual/romantic likes and dislikes;
- kinks, fetishes, fantasies and curiosities;
- boundaries and changing preferences;
- current desire/mood signals;
- intimate ideas/content;
- answers to intimate Question Cards;
- affectionate, flirtatious and playful gestures.

Requirements:
- intimate context remains attributable where relevant;
- preferences may evolve;
- historical preference is never treated as current consent;
- Pass, Not now and non-response are valid states;
- no sexual-frequency, libido, performance or compatibility scoring;
- notifications/previews support discretion;
- intimate data receives elevated security/privacy treatment.

### FR7 Contextual resurfacing
Surface older shared context based on intent and simple context without excessive notifications.

### FR8 Decision mode
- User chooses intent and optional constraints.
- System returns a small set, preferably 3–5.
- Shared history is prioritized before generic discovery.
- Explain why candidates appear.
- Both partners can react/vote.

### FR9 Completion / memory
- Mark ordinary items as done/watched/visited/tried.
- Collect lightweight post-experience reactions where useful.
- Do not automatically turn intimate interactions into a sexual-history/performance ledger.

### FR10 Return experience
Returning after inactivity should reveal a finite set of meaningful traces, not an inbox or guilt state.

## Validation sequencing
The first build does not need to implement the entire product vision simultaneously. However, architecture and UX language should recognize the five pillars from the start.

The initial pilot should validate two complementary behaviors:
1. **Capture loop:** capture → resurface → decide.
2. **Expression loop:** prompt/gesture → voluntary response → increased useful shared context.

This allows Shared Question Cards—including carefully scoped intimacy prompts—to be prototyped without building a comprehensive sexual feature suite.

## Post-initial-validation candidates
- proactive contextual recommendations;
- external discovery;
- richer real-time co-presence;
- customizable gestures;
- richer intimacy/desire exploration;
- shared lists/groceries;
- goals/purpose funds;
- location-aware suggestions and consensual live presence;
- richer media/recipe/product integrations;
- Wayfare integration;
- calendar/free-time context;
- richer memory timeline.

## Non-functional requirements
### Privacy & security
Private by default. Relationship, intimate and location data require a higher security posture than ordinary bookmarking data.

### Discretion
Sensitive content must not unexpectedly appear in lock-screen notifications, widgets or previews.

### Responsiveness
Capture, reaction, gestures and Question Card responses should feel immediate on mobile.

### Portability and deletion
Production design must define export, deletion and unpairing behavior, including sensitive shared data.

### Explainability
Automated classification/recommendation should provide useful reasoning and never claim certainty about a partner's current desire or consent.

### Graceful degradation
Core shared-space functions remain useful if AI/external metadata providers fail.

## Explicit non-goals
- full messaging;
- relationship counseling or health scoring;
- sexual compatibility scoring;
- coercive or persuasion mechanics;
- expense accounting;
- continuous covert location tracking;
- comprehensive social feed;
- autonomous sexual/relationship decision-making;
- replacing direct partner communication;
- attempting to replace Wayfare.

## Open requirement questions
See `docs/open-questions.md`. New implementation decisions should preserve the distinction between **shared transparency** and **mandatory participation**.