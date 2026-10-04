# Experience Architecture

## Experience goal

BetweenUs should feel like **entering a shared place**, not opening a productivity dashboard.

The room metaphor is emotional and architectural, not necessarily graphical. V1 should avoid expensive literalism such as 3D rooms unless later research demonstrates value.

## Proposed top-level model

### Home / Our Space
The living surface. Shows a deliberately small set of meaningful current objects:

- partner presence/trace where appropriate;
- something left for you;
- a few recent shared captures;
- one timely resurfaced idea;
- quick “What should we…?” entry points;
- shared goal/upcoming moment if relevant.

Home must not become a feed.

### Our Things
The durable shared collection. Search/filter by type and state.

Possible views:
- Watch
- Eat
- Go
- Do
- Want
- Listen/Read
- Travel
- Everything

These should remain views over one object model rather than isolated feature silos.

### Decide
Intent-first decision surface:

> What should we do right now?

Select intent + minimal constraints → receive 3–5 explainable candidates → react/vote → choose.

### Memories / Done
Things that became experiences. This is where utility gradually becomes relationship history.

## Onboarding

### Objective
Reach a meaningful paired state before either user is asked to configure a large profile.

### Suggested flow

1. **Promise** — “A private digital home for the two of you.”
2. **Create identity** — minimal profile.
3. **Create space** — no complex customization.
4. **Invite partner** — link/code/deep link.
5. **Partner explicitly accepts shared-space premise.**
6. **First joint action** — save/react to 1–3 real things rather than fill preference forms.
7. **Teach capture** — show how to share something from another app.

Avoid onboarding questionnaires such as “choose 20 favorite cuisines” until evidence shows they outperform organic learning.

## Capture journey

### Ideal
Social/media app → Share → BetweenUs → optional short note → Save.

The item appears in the shared space immediately. Metadata enrichment may continue asynchronously.

### Principle
**Save first, understand second.**

Never reject a meaningful item because extraction failed.

## Partner reaction journey

Partner opens the app and sees a new object in context, not merely “1 notification.” They can react in one tap. Their response improves future resurfacing.

No requirement to reply with text.

## Decision journey example: tired Thursday night

Context: both are home after work, tired, and do not want to browse.

1. Open BetweenUs.
2. Tap **Watch something**.
3. Optionally choose “easy/funny” or available time.
4. System offers three choices:
   - one saved by Partner A;
   - one saved by Partner B;
   - eventually one external discovery.
5. Each option explains why it fits.
6. Both react; overlap is visually clear.
7. Choose and leave the app.

The product wins when screen time ends quickly.

## Return journey after three days

Avoid:

> 14 missed updates

Prefer a composed return state:

> While you were away

- **Something was left for you**
- **2 new ideas joined your space**
- **This old idea might fit this weekend**

The page should feel finite. Once seen, the user is caught up.

## Presence journey

Presence should be layered by sensitivity.

### Low sensitivity
- partner is currently in the shared space;
- partner reacted to the same object;
- playful tap/kiss/gesture.

### Higher sensitivity
- what the partner is currently viewing;
- live location;
- intimate activity/content context.

Higher-sensitivity presence requires explicit design, consent controls and testing. Do not infer permission from pairing alone.

## “Leave something for you”

A useful primitive for emotional presence.

The object could be:
- photo;
- song;
- short note;
- saved item;
- affectionate/playful gesture;
- intimate content where mutually enabled.

This should feel like leaving something in the room, not sending another chat message.

## Information hierarchy

Every shared item should be understandable through five layers:

1. **What is it?** title/type/preview.
2. **Why is it here?** who saved it + optional note/source.
3. **What do we think?** each person's signal.
4. **Can we act on it?** price/time/location/availability where relevant.
5. **What happened?** saved → considered → chosen → experienced + later rating/memory.

## Notification philosophy

Notify only when immediacy has value.

Candidate notifications:
- partner intentionally left something specifically for you;
- partner invites/accepts pairing;
- explicit synchronous interaction;
- time-sensitive shared plan.

Prefer in-app resurfacing for ordinary captures and recommendations. Do not convert every save/reaction into a push notification.

## Accessibility and discretion

Because the app may contain intimate or sensitive couple content:

- notification text must support discreet mode;
- lock-screen previews should be controllable;
- images should not unexpectedly appear in widgets/previews;
- core navigation must remain accessible without relying only on color/emojis;
- motion/playful interactions should respect reduced-motion preferences.
