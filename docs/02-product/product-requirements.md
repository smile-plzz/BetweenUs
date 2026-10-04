# Product Requirements Document — Concept v0.1

## Product
BetweenUs

## Stage
Discovery / behavioral validation

## Objective

Validate whether a paired couple will use a low-friction shared space to preserve casual “we should” ideas and later rely on that space to make real decisions.

## Target user

Initial target: two consenting adults in an established romantic relationship who already share digital content frequently and make recurring joint decisions about entertainment, food, activities and travel.

This target is deliberately narrower than “everyone in a relationship.”

## Primary problem

High-value shared ideas are lost inside tools optimized for chronological communication and content consumption. Existing organization methods require too much maintenance, while generic recommendation systems lack couple-specific context.

## Product hypothesis

If BetweenUs lets either partner capture something in seconds, preserves the shared context, and later resurfaces it when actionable, then the couple will begin treating the product as their durable shared memory and first stop for certain joint decisions.

## Primary success criterion

During a 30-day pilot, both partners repeatedly capture content without prompting and use previously captured content in at least one real joint decision.

The strongest qualitative signal is spontaneous use of language equivalent to **“put that in our app.”**

## Core entities

### Couple Space
A paired environment containing two member identities and all shared content.

### Item
A durable object captured or created in the space.

Possible types include place, movie/show, video, song, recipe/food, product, activity, game, book, trip idea, note, image, link and generic item.

### Source
Where an item originated: URL, share sheet, manual entry, image/screenshot, partner contribution, or later discovery engine.

### Signal
A lightweight expression by either partner: interested, not for me, love, maybe, rating, vote, etc. Exact vocabulary is a UX decision.

### Context
Metadata that makes an item actionable: category, location, distance, price/budget, duration, availability, mood, source evidence, timestamps.

### Experience
An item that moved from possibility into something the couple actually did/consumed.

### Trace
A lightweight sign of partner presence or expression in the shared home.

## Functional requirements — V1 candidate

### FR1 Pairing
- A user creates a couple space.
- The second user joins via an intentional invitation.
- The product clearly communicates that content added to the space is shared.
- Both members have equal membership status.

### FR2 Fast capture
- Accept a URL or manual item.
- Mobile share-sheet ingestion is a priority requirement for a real pilot.
- Capture succeeds even if metadata extraction fails.
- Required fields are minimized.
- The system may enrich category/title/preview automatically but must distinguish uncertain extraction.

### FR3 Shared collection
- Both partners see the same items.
- Items are searchable and filterable.
- Organization is primarily automatic.
- Source attribution is preserved.

### FR4 Partner signals
- Each partner can react independently.
- Both signals are visible in the shared space.
- Signals feed ranking/recommendations.
- No relationship score is derived from agreement/disagreement.

### FR5 Contextual resurfacing
- Surface older items based on category and simple context.
- Initial contexts may be user-selected (“watch something”, “eat/go out”, “do something”).
- Avoid excessive notifications.

### FR6 Decision mode
- User chooses an intent and optional constraints.
- System returns a small set of candidates, preferably 3–5.
- Candidates prioritize shared saved history before generic discovery.
- Explain why each candidate appears.
- Both partners can react/vote.

### FR7 Completion
- Mark an item as done/watched/visited/tried.
- Allow each partner to leave a lightweight post-experience rating/reaction.
- Preserve the item as shared history rather than deleting it.

### FR8 Return experience
- Returning after inactivity should summarize meaningful changes without an inbox metaphor or guilt mechanics.

## Post-V1 candidates

- proactive contextual recommendations;
- external discovery;
- real-time co-presence;
- playful gestures/pokes/kisses/taps;
- “leave something for you” objects;
- shared lists/groceries;
- shared goals and purpose funds;
- location-aware suggestions;
- consensual live location/presence;
- richer movie/media integration;
- recipes and meal decisions;
- product/gift recall;
- intimate shared-space features;
- Wayfare integration;
- calendar/free-time context;
- richer memory timeline.

## Non-functional requirements

### Privacy
Private by default. Shared content must not become publicly discoverable.

### Security
Sensitive relationship data, location and intimate content require security design beyond ordinary low-risk bookmarking applications.

### Responsiveness
Capture and reaction flows should feel immediate on mobile.

### Portability
Users should eventually be able to export shared data in ordinary formats.

### Explainability
Automated classification and recommendation should expose enough reasoning for users to understand important decisions.

### Graceful degradation
Core capture and retrieval should remain useful even when AI enrichment or external metadata providers fail.

## Explicit non-goals for V1

- full messaging;
- relationship counseling;
- relationship scoring;
- expense accounting;
- bank connections;
- continuous background location tracking;
- comprehensive social feed;
- autonomous planning/purchasing;
- attempting to replace Wayfare;
- building every content-category integration.

## Open requirement questions

See `docs/open-questions.md` for unresolved decisions rather than silently encoding assumptions into implementation.
