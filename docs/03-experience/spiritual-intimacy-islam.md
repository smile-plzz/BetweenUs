# Spiritual Intimacy — Islam

## Product thesis
For a Muslim couple, shared life can include worship, remembrance, dua, learning and helping one another grow closer to Allah. BetweenUs should support that dimension as **spiritual intimacy**, not turn worship into productivity analytics.

Islamic marriage is described in Qur'an 30:21 through tranquillity, affection and mercy between spouses. Islamic sources also contain an explicitly shared worship pattern: a husband and wife waking and praying at night together are praised among those who remember Allah (Sunan Abi Dawud 1451/1309). These sources support a product direction centered on **invitation, companionship and remembrance**, rather than monitoring religious performance.

This document defines a product experience, not religious rulings. Religious content surfaced by the product must preserve its source/reference and should use a vetted corpus rather than unconstrained AI generation.

## Core job
> Help us bring faith into our shared life together without turning either partner into the other's religious supervisor.

## Experience principles

### Together, not tracked
The strongest interaction is not “Did your partner pray?” It is “Would you like to pray together?”

### Invitation, not enforcement
Either partner can invite the other into a spiritual moment. An invitation may be accepted, declined, postponed or ignored without relationship scoring or guilt mechanics.

### Shared remembrance
The couple can leave Qur'an passages, authenticated hadith, duas, reflections and reminders in the same digital home where they leave songs, date ideas and other meaningful objects.

### Faith is not a leaderboard
No piety score, prayer completion comparison, spouse ranking, streak competition, missed-prayer shaming or “your partner prayed more than you” analytics.

### Source integrity
BetweenUs must distinguish scripture/hadith from product copy or AI-generated explanation. Qur'an and hadith content should display reference/source metadata. AI should not invent verses, hadith, fatwas or religious rulings.

## Core experiences

### 1. Pray Together invitation
A lightweight shared-room action:

**“Pray together?”** → select relevant prayer/spiritual moment → partner sees invitation → **Join / Later / Pass**.

If both join and are physically together, the app gets out of the way. It does not need to verify that prayer happened.

The value is coordinating a shared act of worship, not recording compliance.

### 2. Leave a spiritual reflection
A partner can leave:
- a Qur'an ayah;
- an authenticated hadith;
- a dua;
- a short personal reflection;
- a reminder relevant to marriage, mercy, patience, gratitude or affection.

This should feel like leaving something meaningful in the shared home, not forwarding generic religious content into another feed.

### 3. Shared dua space
A couple can intentionally save duas for their relationship, family, future, health, work, parents, children or other hopes.

Potential interaction:
- add a dua/intention;
- react or add “Ameen”;
- revisit at meaningful moments;
- optionally mark a personal note/reflection later.

Do not gamify number of duas or imply divine outcomes from app behavior.

### 4. Faith Question Cards
Reuse the Shared Question Card primitive:
- “What are you most grateful to Allah for this week?”
- “What should we make dua for together?”
- “Is there an Islamic habit you'd like us to encourage in each other?”
- “What does a peaceful Muslim home look like to you?”

Answer / Pass / Not now remain valid states.

### 5. Couple learning
A finite, curated surface for learning together:
- Qur'anic passages about spouses/family;
- authenticated hadith relevant to marriage and character;
- short trusted explanations;
- something one partner intentionally saved for the other;
- a “read together later” state.

Avoid an infinite engagement feed.

### 6. Ramadan and meaningful seasons
Later expansion can create contextual shared experiences around Ramadan and other meaningful Islamic periods:
- iftar/suhoor coordination;
- shared dua/reflection;
- Qur'an reading intentions;
- charity intentions/goals;
- Taraweeh/Qiyam invitations.

Again, coordination and companionship—not competitive worship analytics.

## Salah: what the product should and should not do

### Good
- local prayer-time awareness if enabled;
- “Invite partner to pray Maghrib together”;
- gentle shared intention;
- one partner leaving a prayer invitation in the room;
- optional reminder requested by the couple;
- supporting praying together when physically co-located.

### Avoid
- mandatory five-prayer checklists visible as partner performance;
- “She missed Fajr” alerts;
- prayer percentage comparisons;
- piety streaks;
- assumptions about why someone did not pray;
- public/social worship metrics;
- treating menstruation, illness, travel or other religious circumstances as something the app should infer or judge.

## Relationship to intimacy
BetweenUs uses intimacy broadly: being known, sharing attention, affection, desire, vulnerability, values and meaning. Sexual intimacy and spiritual intimacy are different experiences, but both belong naturally inside the same shared home.

The product should not artificially mix sexual content and religious content in a single recommendation/card. Contextual separation and respectful presentation matter even though both are parts of the relationship.

## Intelligence behavior
AI may:
- retrieve relevant vetted content from an approved source corpus;
- help find a previously saved ayah/hadith/reflection;
- suggest a gentle spiritual prompt based on explicit user intent;
- organize shared reflections;
- explain why a saved item is resurfacing.

AI must not:
- fabricate Qur'an/hadith quotations or references;
- issue confident religious rulings from generated text;
- judge either partner's religiosity;
- infer sin, faith level or religious status from app activity;
- pressure a partner to worship;
- claim that completing an app action earns a particular spiritual reward unless accurately sourced and contextually appropriate.

## Content architecture
Suggested shared object types:
- `quran_reference`
- `hadith_reference`
- `dua`
- `reflection`
- `prayer_invitation`
- `faith_question_card`
- `learning_item`
- `shared_intention`

Religious source objects should store source identifier/reference, language/translation metadata, and provenance.

## Notifications
Preferred:
- “A prayer invitation is waiting in BetweenUs.”
- “Your partner left a reflection for you.”

Avoid:
- “Your partner is waiting for you to pray.”
- “Don't break your prayer streak.”
- “Your partner completed more prayers this week.”

## Validation questions
- Does “pray together” feel warmer/more useful than a shared prayer tracker?
- Do couples voluntarily share duas, ayat or hadith with each other inside BetweenUs?
- Does spiritual content feel naturally integrated into the digital-home concept?
- Do users want prayer-time awareness without completion tracking?
- Which spiritual interactions feel supportive versus supervisory?
- Is source attribution clear enough that users distinguish Islamic source material from app-generated commentary?

## Product rule
> **BetweenUs may help partners invite, remember, learn and worship together. It should never quantify who is the better Muslim.**

## Initial source grounding
- Qur'an 30:21: spouses, tranquillity, affection and mercy.
- Sunan Abi Dawud 1451 / 1309: spouses praying two rak'ahs together at night and being recorded among those who remember Allah.

These sources ground the concept of shared spiritual life; they do not imply that every proposed app feature is itself a religious prescription.