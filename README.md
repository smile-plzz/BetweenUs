# BetweenUs

> A private digital home for two people.

**Product concept:** BetweenUs helps a committed couple preserve the small things that matter, feel each other's presence, make decisions together, and turn scattered "we should do this" moments into shared experiences.

**Status:** Product discovery / concept validation (v0.1)

## North-star problem

Couples continuously exchange high-value fragments across chat, social feeds, links, screenshots, spoken conversations, and everyday life: a movie to watch, a restaurant to try, a dress someone loved, a recipe, a fantasy, a trip, a song, a gift hint, or simply a small gesture. Messaging is excellent for the moment but poor as durable couple memory. Search and recommendation products, meanwhile, know the internet better than they know *us*.

BetweenUs is intended to become the shared layer between those moments and future action.

> **Never lose a “we should do this” idea.**

The long-term vision is larger: a digital space built specifically for exactly two people—somewhere between shared memory, presence, decision support, discovery, play, and a lightweight household companion. It is deliberately **not another messenger, task manager, social network, surveillance tool, or financial auditor**.

## Core product loop

**Capture → Remember → Understand → Resurface → Decide → Do together → Learn**

The app should require less organization from the couple over time, not more. Intelligence exists to organize and resurface their shared context; it is not presented as a human-like third participant.

## Product pillars

1. **Shared memory** — preserve meaningful things without requiring database maintenance.
2. **Presence & expression** — lightweight ways to feel that the other person is in the shared digital home.
3. **Shared decisions** — reduce choice overload using both partners' actual history, reactions, context, time and rough budget.
4. **Discovery** — introduce a small number of relevant new possibilities and explain why they fit the couple.
5. **Living together** — gradually support lists, plans, goals and practical coordination without turning the relationship into project management.

## Important boundaries

- The space is designed for **exactly two paired users**.
- There is no product concept of separate private rooms. Content placed in BetweenUs belongs to the shared space, while authorship, reactions and individual preferences remain attributable when useful.
- The app is **not a secret keeper**. Surprises can be inspired by shared history but planned outside the shared space.
- Presence is consensual and symmetrical. Awareness must never silently become surveillance.
- Intelligence should feel like a smart environment, **not a personified butler, chatbot, gendered character, or third member of the relationship**.
- Discovery must reduce decision fatigue rather than create another infinite feed.
- Money is an **enabler for shared decisions and goals**, not a mechanism for policing who spent what or who owes whom.
- Intimate and sexual expression can be part of the couple's shared space, but it follows the same consent, safety and control principles as every other sensitive interaction.

## V1 thesis

The vision is intentionally broad; the first behavioral experiment is intentionally narrow.

We need to learn whether two people will naturally form the behavior:

> **“Put that in our app.”**

V1 should therefore prioritize frictionless capture, a useful shared collection, reactions, lightweight resurfacing, and a small decision experience before attempting the full digital-home vision.

## Documentation

Start with [Product Context](docs/00-product-overview/product-context.md), then read:

- [Vision](docs/00-product-overview/vision.md)
- [Problem & Opportunity](docs/00-product-overview/problem-opportunity.md)
- [Product Principles](docs/00-product-overview/product-principles.md)
- [Jobs to Be Done](docs/01-research/jobs-to-be-done.md)
- [Behavior & Relationship Psychology](docs/01-research/behavioral-psychology.md)
- [PRD](docs/02-product/product-requirements.md)
- [Feature Map](docs/02-product/feature-map.md)
- [V1 Scope](docs/02-product/v1-scope.md)
- [Experience Architecture](docs/03-experience/experience-architecture.md)
- [Intelligence Model](docs/04-intelligence/intelligence-model.md)
- [Trust, Consent & Privacy](docs/05-trust/trust-consent-privacy.md)
- [Technical Direction](docs/06-engineering/technical-direction.md)
- [30-Day Couple Test](docs/07-validation/30-day-couple-test.md)
- [Roadmap](docs/08-roadmap/roadmap.md)
- [Decision Log](docs/09-decisions/decision-log.md)
- [Open Questions](docs/open-questions.md)

## Relationship to Wayfare

[Wayfare](https://github.com/smile-plzz/wayfare) remains a separate product. Its place-capture and trip-decision concepts are highly relevant to BetweenUs and may later become a travel/places capability or integration, but BetweenUs must not collapse Wayfare into itself during early validation.

## Working rule

Every proposed feature should answer three questions before entering scope:

1. Does this help two people **remember, feel, decide, or do** something meaningful together?
2. Can it happen with less effort than the behavior it replaces?
3. Does it strengthen shared agency without creating obligation, surveillance, scorekeeping, or noise?

If not, it probably does not belong in BetweenUs.
