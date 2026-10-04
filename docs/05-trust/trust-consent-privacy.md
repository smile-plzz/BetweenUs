# Trust, Consent & Privacy

## Why this is product-critical

BetweenUs may eventually contain unusually sensitive context: location, preferences, gifts, private photos, intimate ideas, shared plans, financial goals and relationship history.

Trust cannot be a later compliance layer. It shapes the feature model.

## Shared-space contract

Pairing should communicate clearly:

> Things intentionally added to this space are shared with your paired partner.

There is currently no concept of private content *inside* the couple space. Users should never accidentally believe an item is private when it is shared.

## Equal membership

Neither partner should be positioned as the administrator/owner of the other person.

Production design must address:
- equal access to shared content;
- permission changes;
- leaving/unpairing;
- export;
- deletion;
- what happens to shared history after separation;
- safety situations where normal symmetry may no longer be appropriate.

These are unresolved product-policy questions, not implementation details.

## Consent is feature-specific

Joining a shared space is consent to the shared-space model. It is **not blanket consent** to:

- continuous live location;
- broadcasting current activity;
- exposing sensitive notification previews;
- intimate media;
- integrations with calendars/accounts;
- financial account access.

Higher-sensitivity capabilities need separate, understandable controls.

## Presence controls

Presence features should be:

- explicit;
- reversible;
- understandable;
- symmetrical by default;
- visibly active when sensitive.

Avoid covert/background monitoring patterns.

## Location

If implemented later:

- default off;
- clear reason for collection;
- prefer coarse/on-demand location when sufficient;
- make live sharing obvious;
- allow immediate pause;
- never frame disabling location as suspicious;
- do not build “prove where you were” workflows.

## Intimate content

If supported:

- private to the paired space;
- secure transport/storage;
- discreet previews;
- explicit content controls;
- careful handling of exports/backups;
- straightforward deletion;
- strong protection against accidental display.

A production implementation requires legal/safety review for applicable jurisdictions and platform policies.

## Notifications

Notifications are a privacy surface.

Users should be able to choose:
- full preview;
- generic “something was left for you”;
- no sensitive push content.

## AI/data usage

If third-party AI services are introduced:

- disclose what leaves the system;
- minimize transmitted data;
- avoid sending sensitive media/intimate text unless necessary and explicitly supported;
- provide non-AI fallback for core storage/retrieval;
- do not train external models on couple data without explicit informed permission.

## Breakup / unpairing is a first-class scenario

A couple product that only models happy continuation is incomplete.

Before production launch, define:

- whether each person can independently leave;
- immediate access changes;
- export rights;
- shared vs. contributed content ownership;
- deletion requests;
- safety escalation where one partner should not retain location/presence access.

This should be designed before sensitive features ship.

## Ethical red lines

BetweenUs must not:

- secretly track a partner;
- score relationship health from app behavior;
- shame a user for inactivity;
- compare affection/contribution volumes competitively;
- expose private couple data publicly by default;
- make consent difficult to withdraw;
- use jealousy/anxiety as an engagement mechanism.
