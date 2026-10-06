# Decision Log

This log captures decisions already made in product discovery so future work does not repeatedly reopen them without new evidence.

## D001 — BetweenUs is broader than Wayfare
**Decision:** Keep Wayfare separate. BetweenUs may eventually integrate/reuse its travel concepts.

## D002 — Product metaphor is a digital home for two
**Decision:** Use “private digital home/shared room” as the conceptual model. The room is emotional/architectural, not a requirement for literal 3D UI.

## D003 — Do not build another messenger
**Decision:** Messaging is not a core product goal. Preserve durable context and lightweight expression instead.

## D004 — Exactly two is a design primitive
**Decision:** Core product is for one paired couple, not groups.

## D005 — Shared space, not private silos
**Decision:** Content intentionally submitted to BetweenUs is shared and attributable. No separate secret “mine” vault is part of the current concept.

**Caveat:** feature-specific permission/participation remains necessary for sensitive presence, location and intimacy capabilities.

## D006 — Surprises happen outside the shared space
**Decision:** Do not add secret planning merely to support gifts/surprises.

## D007 — Intelligence is not personified
**Decision:** No named/gendered AI butler/third personality. Intelligence is environmental.

## D008 — North-star wedge
**Decision:** V1 centers on **“Never lose a ‘we should do this’ idea.”**

## D009 — Desired habit
**Decision:** Optimize for spontaneous **“Put that in our app.”** behavior.

## D010 — Discovery is finite
**Decision:** Recommendations should be a small explainable set, not an infinite feed.

## D011 — Return without guilt
**Decision:** After absence, show meaningful traces/changes rather than unread-count pressure or streak loss.

## D012 — Presence can be part of closeness
**Decision:** Explore co-presence and playful gestures, with mutual understandable controls rather than covert monitoring.

## D013 — Intimacy & Desire is a core relationship dimension
**Decision:** Romantic and sexual expression is a first-class product domain for consenting adult couples, not a novelty feature.

**Constraints:** no sexual-performance/libido/compatibility scoring; historical preferences/fantasies never imply present consent; participation can always be Answer / Pass / Not now / non-response.

## D014 — Money is decision support, not expense police
**Decision:** Explore rough budgets/shared purpose goals rather than contribution/debt policing.

## D015 — Vision and validation scope stay separate
**Decision:** The long-term product is a whole digital home, but development remains evidence-gated. Validate the wedge and expression primitive before implementing every domain.

## D016 — Shared Question Cards are a core interaction primitive
**Decision:** Structured questions can be placed in the shared room by either partner and, where appropriate, suggested by the system. They are “chatting without becoming chat.”

**Reason:** They support candid communication across everyday, emotional, sexual and spiritual contexts while preserving the product's non-messenger identity.

## D017 — Shared transparency does not mean mandatory participation
**Decision:** Submitted answers are visible in the shared space, but either partner can Answer, Pass, choose Not now or leave a card unanswered without penalty.

## D018 — Sexual tone may be unapologetically explicit
**Decision:** BetweenUs must not sanitize consensual adult sexual expression merely because the product also contains spiritual or everyday domains. Sexual tone may be romantic, playful, direct, explicit/raw or kinky according to couple/context preferences.

**Constraint:** explicit tone never weakens agency or creates consent assumptions.

## D019 — Whole relationship, not one tone
**Decision:** Product tone is contextual. Spiritual moments may be reverent, affection tender, daily life practical, play playful, and sexual moments explicit. One domain does not dictate another's emotional vocabulary.

## D020 — Spiritual intimacy belongs in the relationship model
**Decision:** Support optional shared spiritual companionship. Initial researched implementation is Islam-first: prayer-together invitations, duas, Qur'an/authenticated-hadith reflection, faith Question Cards and later shared/seasonal practices.

**Constraint:** no piety scoring, partner worship comparison, missed-prayer policing, inferred religiosity or fabricated religious sources.

## D021 — Faith Together is not a prayer-performance tracker
**Decision:** The core interaction is invitation, reflection, shared intention and companionship rather than monitoring whether the partner completed worship.

## D022 — Two core loops guide architecture
**Decision:** Memory loop = Capture → Remember → Understand → Resurface → Decide → Do Together → Learn. Expression loop = Express → Respond voluntarily → Understand each other → Create shared context.

## D023 — Sensitive domains reuse shared primitives where possible
**Decision:** Intimacy, faith, travel, media and other domains should reuse shared objects, Question Cards, traces, reactions and memory rather than becoming disconnected mini-apps.

## D024 — Religious source integrity is a product requirement
**Decision:** Qur'an/hadith content must preserve trustworthy provenance. Generative AI must not invent scripture/hadith or present unsupported religious rulings as authoritative.

## D025 — V1 uses a single Next.js application and shared PostgreSQL schema
**Decision:** Implement the vertical slice in one TypeScript application. Supabase is the hosted Auth/PostgreSQL boundary; a local PGlite PostgreSQL adapter exercises the identical policies without credentials. Local auth is explicitly development-only and blocked on Vercel.

## D026 — Synchronize shared state without broadcasting presence
**Decision:** V1 uses visible-tab polling every four seconds and immediate refresh after mutation/return. No online status, last seen, activity broadcast, or websocket presence is inferred. Realtime transport can be substituted later without changing the domain.

## D027 — Immediate attributable answers, revisable participation
**Decision:** Submitted answers are immediately shared. The sender can also answer. Each person can change Answer/Pass/Not now or withdraw their own response; no row is unanswered. Either can put a card away. A member's submitted state removes a card from their active Home surface, while Questions retains it. This is a reversible V1 choice for the open reveal/lifecycle questions.

## D028 — Controlled intimacy and optional faith use existing primitives
**Decision:** Explicit text requires an installation flag and both members' independent opt-in. Either withdrawal blocks explicit reads/writes. Faith Together also requires both opt-ins and ships only personal reflections/dua questions; no scripture corpus or worship tracking. Sensitive completion/performance history is not supported.

## D029 — Close-and-revoke lifecycle for the controlled pilot
**Decision:** Either member may close the space, immediately removing both memberships' access and revoking invites. Closed data is retained without member access until a verified operator deletion under the documented pilot procedure. Neither a new partner nor the original creator inherits access. Self-service export, permanent deletion, and account/device recovery remain requirements before broad production; this limited pilot policy does not erase those open questions.

## D030 — Local source preservation before provider enrichment
**Decision:** V1 asynchronously records known URL hostname/provenance after saving. Conservative known-host categories are available without manual classification; arbitrary URL scraping/Open Graph/LLM processing is deferred. No third party receives shared content, and metadata/recommendations do not fabricate price, location, availability, or preferences.

## D031 — Useful empty homes and finite public discovery
**Decision:** Following the owner's request for activity-filled empty states and dynamic free data, show three daily ordinary starter ideas and offer explicit, finite catalog exploration when saved history is insufficient or the pair asks for something new. TVMaze/Open Library adapters accept only fixed public queries, with provenance, response/time budgets and curated fallbacks. Existing shared history stays first; nothing becomes shared until a verified member saves it through the existing capture primitive. No personal/sensitive content or couple identity goes to providers. Food ideas remain curated because a development-only API key is not a dependable hosted integration boundary.
