# Trust, Consent & Privacy

## Why this is architecture, not compliance polish

BetweenUs can contain unusually sensitive relationship context: explicit sexual text/media, fantasies/preferences, faith reflections, private photos, location/presence, gift signals, financial goals, shared history and information about two people at once.

A breach or accidental disclosure here can be more harmful than losing an ordinary bookmark database. Trust therefore shapes the schema, authorization model, notifications, AI architecture, analytics and unpairing behavior from the first build.

## Shared-space contract

Pairing communicates:

> **Things you intentionally submit to this couple space are shared with your paired partner.**

There is currently no private vault inside the couple space. The UI must never create a false expectation that a submitted answer/item is visible only to its author.

This contract is about **visibility of submitted shared content**. It is not blanket permission for every capability the app could technically enable.

## Equal membership

Neither partner owns/administers the other. Both are members of the CoupleSpace.

Do not build:
- “primary partner” powers over the other account;
- one-sided monitoring settings;
- administrator access to the partner's personal account;
- asymmetrical ability to silently enable sensitive presence.

## Participation and current consent

Shared transparency and voluntary participation coexist.

For Question Cards and intimate interactions, a person can:
- Answer;
- Pass;
- choose Not now;
- leave the interaction unanswered;
- change a preference later.

No state should create punishment, guilt, repeated pressure, compatibility penalties or “convince your partner” mechanics.

A stored fantasy, kink, preference, previous sexual answer, prior participation or relationship status is **not current consent to sexual activity**.

## Capability-specific permission

Pairing alone does not authorize:
- continuous/live location;
- background activity broadcasting;
- explicit notification previews;
- explicit-media handling;
- calendar/email/account integrations;
- financial account access;
- third-party AI processing of sensitive raw content.

Higher-sensitivity capabilities need explicit, understandable and reversible controls.

## Sensitive-content classification

Every object that may contain sensitive content should support metadata such as:
- sensitivity class (ordinary / private-couple / explicit-intimate / location / financial / faith-sensitive where useful);
- preview policy;
- notification policy;
- retention policy;
- external-processing eligibility;
- media-download/cache policy.

Classification should default conservatively when explicit/intimate content is known.

## Intimate content

Before rich explicit-media support ships, define and test:
- secure transport and storage;
- strict CoupleSpace authorization;
- signed/short-lived media access where appropriate;
- discreet thumbnails/previews;
- screenshot/device-level limitations the product can and cannot guarantee;
- cache/temp-file behavior;
- export and backup behavior;
- deletion semantics;
- unpairing behavior;
- third-party processing boundaries;
- platform/legal requirements for applicable jurisdictions.

Do not promise that content cannot be copied by a paired recipient. The product can secure access; it cannot guarantee what another human does after legitimate viewing.

## Notifications are a data-leak surface

Support at least:
1. **Generic/discreet** — e.g. “Something is waiting in BetweenUs.”
2. **Normal preview** — safe non-sensitive context where enabled.
3. **No sensitive push content.**

Explicit sexual text/images and sensitive faith/personal content should never unexpectedly appear on a lock screen, widget, watch or shared device surface.

## Presence and location

Presence should be understandable and reversible. Higher-sensitivity presence must be visibly active.

If location is implemented later:
- default off;
- collect only for a clear feature purpose;
- prefer coarse/on-demand location when enough;
- make live sharing obvious;
- provide immediate pause/revocation;
- do not frame disabling it as suspicious;
- do not build “prove where you were” or retrospective partner-audit workflows.

## Faith data

Faith Together should not become a mechanism for religious surveillance.

Do not:
- compare prayer completion;
- notify one partner that the other missed worship;
- infer piety/religious status from activity;
- expose sensitive spiritual reflections outside the couple space;
- fabricate or silently alter Qur’an/hadith source material.

## AI and external processing

If third-party AI/services are introduced:
- document which data leaves BetweenUs and why;
- minimize payloads;
- avoid sending explicit media/intimate raw text by default;
- do not send sensitive content merely for speculative personalization;
- keep core storage/retrieval usable without AI;
- never use couple data to train external models without explicit informed permission;
- maintain provenance for extracted/generated metadata;
- separate verified religious source material from generated commentary.

## Authorization model — engineering requirement

Every couple-scoped read/write must verify active membership in the correct CoupleSpace. Client-side filtering is not authorization.

The database/API design should enforce:
- maximum two active members per CoupleSpace;
- no cross-couple object access;
- user can act only as themselves;
- membership state checked for sensitive reads/writes;
- sensitive media access scoped to active authorization;
- revoked/unpaired membership immediately blocks future sensitive access.

If PostgreSQL/RLS is used, these rules should be expressed in policies and tested, not merely documented in UI code.

## Analytics and logs

Validation requires instrumentation, but logs can become a shadow copy of sensitive relationship data.

Prefer events such as:
- `question_card_answered`;
- `item_captured`;
- `decision_candidate_selected`;

Avoid logging raw sexual answers, explicit prompt text, private notes, dua/reflection text, full source content or precise location into analytics/error systems unless strictly necessary and intentionally protected.

Production logs must not become an easier route to couple data than the application database.

## Unpairing / breakup — pre-production blocker

A couple product that models only happy continuation is incomplete. Before sensitive production use, decide:
- either person can independently leave;
- immediate revocation of presence/location and future couple-space access;
- what happens to shared objects;
- export rights;
- deletion rights;
- treatment of jointly enriched content;
- explicit/intimate media retention/deletion;
- pending notifications/jobs after unpairing;
- safety path where normal symmetry is inappropriate.

Until this policy is implemented, sensitive-data pilots should remain controlled and limited.

## Account/device recovery

Before sensitive production use, define:
- recovery when a device/account is lost;
- session revocation;
- authentication strength;
- whether app/device lock or biometric gate is offered;
- how recovery avoids accidentally granting a new device broad access without adequate verification.

## Ethical red lines

BetweenUs must not:
- secretly track a partner;
- score relationship health, sexual performance, libido or piety;
- shame inactivity or refusal;
- compare affection/contribution/worship competitively;
- expose couple data publicly by default;
- make permission withdrawal difficult;
- use jealousy, anxiety, sexual pressure or religious guilt as engagement mechanics;
- teach one partner how to overcome the other's refusal;
- sell sensitive relationship data or build advertising profiles from it.

## Pre-development vs. pre-production

### Required from first implementation
- CoupleSpace authorization;
- sensitivity metadata;
- discreet notification defaults;
- minimal/redacted analytics;
- feature flags for sensitive experiments;
- no raw sensitive data in routine telemetry;
- explicit participation states for Question Cards.

### Must be resolved before broad production launch
- complete unpairing/data lifecycle policy;
- explicit-media storage/export/deletion design;
- account/device recovery model;
- legal/platform review where required;
- external AI data-processing policy;
- location/presence revocation behavior if those features ship.
