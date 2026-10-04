# Shared Question Cards

## Product idea
Shared Question Cards are a lightweight interaction primitive for BetweenUs: one partner places a question into the couple's shared space and both partners can respond without opening a conventional chat thread.

The goal is **chatting without becoming a chat app**. Questions create small moments of curiosity, play, honesty, affection, planning, and intimacy inside the digital home.

## Why this belongs in BetweenUs
Normal messaging optimizes for a chronological stream. BetweenUs should optimize for the relationship's shared context. A useful question should therefore feel like an object placed in the room rather than another message buried in a feed.

Question Cards support three product goals:

1. **Expression** — make it easier to ask something that might otherwise feel awkward or easy to postpone.
2. **Presence** — give the shared home something the couple can interact with together or asynchronously.
3. **Learning** — answered questions gradually create useful, intentionally shared relationship context that can improve future suggestions and resurfacing.

## Shared-space rule
BetweenUs has no hidden answer layer for this mechanic. If a partner chooses to answer a Shared Question Card, that answer becomes part of the shared space and is attributable to the person who answered it.

Participation remains voluntary. A person can:

- answer;
- pass;
- choose **Not now**;
- leave the card unanswered.

Passing or not answering must not create penalties, streak loss, guilt copy, repeated pressure, compatibility scoring, or negative relationship analytics.

**Transparency applies to participation that is intentionally submitted; it does not turn non-participation into an obligation.**

## Core interaction
### 1. Create or choose a question
A partner can:
- write their own question;
- choose a prompt suggested by BetweenUs;
- resurface a question the couple previously saved for later.

### 2. Place it in the shared room
The card appears as a shared object, not as a DM. The other partner can notice it while visiting the home or receive a deliberately lightweight notification depending on notification settings.

### 3. Respond
Each partner can answer, pass, or select Not now. The UI should make all three actions feel normal rather than presenting Answer as the only successful state.

### 4. Reveal the shared state
Submitted answers are visible to both partners. The card can show who answered what and whether the other partner has not yet participated.

### 5. Resolve naturally
A card does not need a formal completion ceremony. It can remain briefly in the live room, become part of shared memory when valuable, or fade from the active surface.

## Intimacy & Desire use case
Question Cards are especially important to the Intimacy & Desire pillar because they provide structure without requiring a separate private profile or a conventional chat conversation.

Examples of *categories* include:
- current mood and desire;
- things each partner enjoys;
- curiosities and fantasies;
- boundaries and dislikes;
- affectionate preferences;
- playful hypothetical questions;
- what each person wants from an intimate evening.

The product should not assume that an answer about a preference, fantasy, or past experience is consent to an activity now or later. Current willingness must remain expressible independently.

### Design principle
> BetweenUs can make desire easier to express while making Pass and Not now equally legitimate interactions.

## Non-intimate use cases
This primitive should remain useful across the whole relationship:
- "What should we do Friday?"
- "Which of these places should we try next?"
- "What movie mood are you in tonight?"
- "Where should our next short trip be?"
- "What's something you want us to make more time for?"
- playful couple questions and memory prompts.

This prevents the mechanic from becoming a disconnected sexual questionnaire system. It is a relationship primitive whose intimacy use case is particularly valuable.

## UX character
Question Cards should feel:
- immediate;
- visually distinct from chat bubbles;
- low effort;
- playful when appropriate;
- candid;
- easy to ignore without consequence;
- naturally embedded in the shared-room metaphor.

Avoid:
- inbox counts;
- read receipts designed to pressure response;
- "waiting for your partner" guilt language;
- answer streaks;
- response-time comparisons;
- compatibility scores derived from sexual answers;
- automatically treating unanswered prompts as disagreement.

## Suggested card states
`DRAFT -> SHARED -> OPEN -> RESPONDED/PASSED/NOT_NOW -> RESOLVED`

Because there are two participants, response state should be stored per participant rather than forcing one global answer state.

## Preliminary data model
A future implementation may represent a card with:

- `card_id`
- `couple_space_id`
- `prompt_id` or custom prompt text
- `category`
- `created_by`
- `created_at`
- `responses[]`
  - participant
  - state: answered | passed | not_now
  - answer payload
  - submitted_at
- `active_room_state`
- `memory_eligibility`
- `resolved_at`

Sensitive intimate responses require the same high-trust security posture as other intimate content in BetweenUs. Product documentation should define retention, deletion, export, device privacy, notification redaction, and encryption requirements before implementation.

## Intelligence behavior
AI may help select or phrase prompts based only on context the couple intentionally created in BetweenUs. It should not impersonate either partner or claim certainty about what someone wants.

Good behavior:
- suggest a relevant question;
- vary prompt intensity based on couple-selected preferences;
- avoid repeatedly surfacing passed prompts;
- learn which question categories generate voluntary engagement;
- use answered cards as shared context where appropriate.

Bad behavior:
- "Your partner secretly wants...";
- inferring consent from an old answer;
- escalating sexual intensity automatically;
- interpreting Pass as reluctance that should be overcome;
- generating pressure tactics.

## Product hypothesis
**If BetweenUs provides lightweight shared questions that are easier than starting a deliberate conversation, couples will use them to express things they otherwise postpone, while the shared space becomes more personally useful over time.**

## Validation questions
During prototype testing, measure and interview around:
- Do partners voluntarily send cards to each other?
- Are custom questions or suggested prompts more valuable?
- Does the interaction feel meaningfully different from sending a message?
- Do users understand that answers are shared before submitting?
- Is Pass/Not now comfortable enough to use?
- Which categories create repeat use without notification pressure?
- Do answered cards improve later decisions or recommendations?

## Open design decisions
Do not prematurely lock these:
- whether both answers appear immediately or the card visually reveals them after both have responded;
- whether a sender can answer their own card before or after sending;
- whether question cards can contain polls, sliders, images, links, or multi-select responses;
- how long unanswered cards remain prominent;
- which answered cards become durable shared memory versus ephemeral room traces;
- how explicit content is hidden in lock-screen notifications and app previews;
- whether couples can create reusable custom prompt decks.

## Relationship to the broader product
Shared Question Cards connect several BetweenUs pillars:

**Presence -> Expression -> Shared understanding -> Memory -> Better decisions/discovery**

They should therefore be designed as a reusable core interaction primitive, not as a one-off feature page or a replacement for messaging.