# Product Context

## Why this document exists

This is the narrative source of truth for BetweenUs. It records not only what the product may contain, but the reasoning that led to it so future design and engineering decisions do not accidentally turn the concept into a generic couples app.

## Origin

The idea grew out of a practical observation made while developing **Wayfare**, a two-person place-capture and trip-decision product: couples constantly discover things they may want to do later, but discovery happens in fragmented environments and rarely survives in a useful form.

The initial thought was broader trip organization. Discussion exposed a more fundamental behavior: two people continuously create tiny pieces of shared future context.

Examples include:

- “We should watch this.”
- “I want to go here.”
- “This restaurant looks good.”
- “Listen to this song.”
- “I love this dress.”
- “Try this recipe with me.”
- “This game looks fun.”
- “This is something I fantasize about.”
- a funny URL or Reel that matters only because one partner sent it to the other;
- a gift preference mentioned months before a birthday.

These fragments currently live in Messenger, Instagram, Facebook, YouTube, screenshots, browser tabs, notes, memory, and spoken conversation. Most are not important enough to formally plan at capture time, but some become highly valuable later.

That led to the central observation:

> **Conversations are chronological. Couple memory is contextual.**

A movie mentioned six months ago is valuable when the couple wants a movie tonight, not when it happens to be near the top of a message history. A restaurant becomes valuable when both are free, nearby and have a suitable budget. A product someone admired becomes valuable near a gift-giving moment.

## The product intent

BetweenUs is a **private digital home for exactly two people**. It should make two people function together more easily without turning the relationship into administration.

The home metaphor matters. A physical shared home is not primarily a database, communication channel, task manager, calendar or entertainment service. It is an environment in which many small parts of a shared life coexist. BetweenUs explores what the digital equivalent could be.

This means the product is allowed to contain different kinds of experiences—memories, movies, food, places, play, affection, lists, goals, trips and intimate expression—provided they feel like parts of one shared environment rather than unrelated mini-apps.

## The three fundamental jobs

### 1. Remember

Preserve meaningful fragments with almost no effort and make them retrievable by meaning and context rather than chronology.

### 2. Decide

Help the couple turn accumulated preferences into small, actionable choices: what to watch, where to eat, what to do tonight, where to travel, what fits a rough budget.

### 3. Do

Move from “someday” into an experience: choose the movie, visit the restaurant, cook the recipe, take the trip, play the game, work toward the shared goal.

A fourth emotional layer surrounds all three: **presence**. The space should feel inhabited by both people, not like a sterile shared database.

## Product tension: utility vs. emotional space

BetweenUs will fail if it becomes either extreme:

- **Pure utility:** a couples Trello board with chores, budgets and lists.
- **Pure sentiment:** hearts, streaks and relationship gimmicks without durable everyday usefulness.

The intended product lives between these extremes. Practical usefulness creates repeat behavior; emotional presence makes the shared space worth returning to.

## The room metaphor

The user described the product as “one room with two users.” This should guide experience design without forcing a literal 3D room UI.

A room implies:

- both people belong there equally;
- the other person can leave traces of their presence;
- objects can remain after the moment passes;
- some interactions are practical, some playful, some intimate;
- returning after time away should feel like seeing what changed, not clearing an inbox;
- shared context is ambient rather than buried behind messages.

Possible presence interactions include a kiss, tap, playful gesture, song, picture, note, or “something left for you.” These are expressions, not attempts to replace messaging.

## Why it is not a messenger

WhatsApp, Messenger and similar tools already solve synchronous/asynchronous conversation extremely well. Competing with them would destroy focus.

BetweenUs should accept that the couple will continue talking elsewhere. Its role is to retain and activate the parts of that communication that have durable value.

A successful behavior is not “let's move our conversation to BetweenUs.” It is:

> **“Put that in our app.”**

## Intelligence philosophy

The user initially described the desired intelligence as a “butler for two,” then deliberately rejected a personified assistant because a personality, gender or artificial social presence could feel like an unwanted third participant.

Therefore:

> **The house is smart; there is no digital roommate.**

Intelligence should:

- organize captured content;
- infer useful metadata where confidence is adequate;
- learn from saves, reactions, votes, decisions and completed experiences;
- resurface things when context makes them useful;
- explain recommendations in plain language;
- offer a small number of actionable choices;
- never require users to maintain an AI profile manually.

## Discovery philosophy

The product is not limited to stored memories. It may introduce restaurants, recipes, books, movies, activities or other possibilities that neither partner has saved.

However, discovery must be **finite and contextual**. Infinite feeds recreate the exact decision fatigue BetweenUs is meant to reduce.

A useful suggestion looks like:

> You both tend to like this kind of food, this place fits tonight's rough budget, and it is close enough to reach easily.

The explanation is part of the product. Recommendations should not feel arbitrary.

## Shared-space model

There is no conceptual “mine” and “yours” storage area inside BetweenUs. Once content is intentionally placed in the app, it enters the couple's shared space.

This does **not** mean erasing individuality. The system still needs to know:

- who contributed something;
- each person's reaction or rating;
- where preferences overlap or differ;
- who is currently present where relevant.

The distinction is between **individual signals** and **private silos**. The former are necessary; the latter contradict the current product concept.

## Surprise boundary

The shared-space rule means BetweenUs should not pretend to support secret planning inside the couple space. A partner can use shared history to learn what the other likes, then plan a surprise elsewhere. The app does not need to know every action taken because of its information.

## Presence and intimacy

The concept explicitly includes affectionate, playful, romantic and sexual expression between consenting adult partners. This is not treated as a novelty “spicy feature”; intimacy is one legitimate dimension of a shared relationship.

The design challenge is to enable expression without coercion, public exposure, accidental disclosure, manipulative engagement, or ambiguous consent.

Presence features should be **mutual, visible and controllable**. The product should never infer that relationship commitment equals permanent consent to every kind of presence or intimate interaction.

## Returning after absence

A key discussion scenario asked what should happen after someone has not opened the app for three days.

The answer should not be an inbox of guilt:

- no “17 missed things” pressure;
- no streak punishment;
- no relationship-health score.

Instead, returning should feel like walking back into a room and noticing traces:

- something the partner left;
- a couple of new “we should” ideas;
- an older item that has become timely;
- a shared goal or upcoming moment worth noticing.

**Curiosity, not obligation.**

## Money philosophy

A shared-finance idea surfaced during discovery. The initial framing of expense tracking was rejected in favor of decision support.

BetweenUs should use money to answer questions such as:

- What date ideas fit the amount we want to spend tonight?
- How close are we to our trip goal?
- Which saved activities fit this month's discretionary plan?

It should not default to:

- who owes whom;
- who spends more;
- partner scoring;
- judgmental budget warnings;
- financial surveillance.

**Money is an enabler, not an auditor.**

## Relationship with Wayfare

Wayfare remains independent. Its central mechanics—capture places, preserve source evidence, enrich with location/price/distance, and make contextual trip decisions—are a natural specialization of BetweenUs's broader capture-and-resurface loop.

Keeping it separate prevents two mistakes:

1. bloating BetweenUs V1 with mature travel requirements;
2. destroying Wayfare's ability to exist as a focused standalone product.

Later, BetweenUs can integrate with or reuse parts of Wayfare rather than absorbing it prematurely.

## What we are actually validating

The broad vision is a digital home for two. That is not the first hypothesis.

The first hypothesis is behavioral:

> If capture is nearly effortless and resurfacing is genuinely useful, two people will begin treating BetweenUs as the durable destination for things they may want to experience together later.

The strongest qualitative signal is spontaneous language such as:

> “Put that in our app.”

Only after that behavior exists should the product aggressively expand into the larger shared-life system.
