# Small beginnings and optional discovery

The owner requested useful activity suggestions for otherwise empty homes and dynamic free API data after hosting was restored. This adds the small Discovery Engine already described in the intelligence model; it does not prepopulate a couple's actual history.

## Product behavior

- New/empty Our Space and Our Things display up to three starter activities. Twenty deliberately small ordinary starters span Watch, Eat and Do. A deterministic date/space seed rotates the set daily without notifications, countdowns or pressure.
- Decide Together still ranks saved history first. An empty intent offers starters; a pair with saved candidates can explicitly choose **Explore something new**.
- **Find fresh ideas** requests up to three public catalog suggestions. Results replace the finite panel; there is no pagination, automatic provider refresh, feed or infinite scrolling.
- **Save this idea** reuses normal capture. The contributor is the authenticated person, not a system or simulated partner. Source URL and credit are preserved; a partner can independently react. Nothing is stored before that action.
- Already-saved visible titles/URLs are omitted from the starter panel. Saving and ordinary capture remain available during external loading/failure. An exhausted panel suggests returning to saved history.

## Integrations

| Intent | Source | Request and limits |
| --- | --- | --- |
| Watch | [TVMaze public API](https://www.tvmaze.com/api) | Fixed public `planet earth` search, documentary type only. Credit/source links and [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) attribution retained. No claim about streaming availability, price or age suitability. |
| Do | [Open Library public API](https://openlibrary.org/developers/api) | At most 18 classic-literature records, reduced to three reading-together suggestions. Original work URL and first author when present. No claim that a book is free to read or available to borrow. |
| Eat | BetweenUs starters | Small cooking/meal ideas; no fabricated recipe, dietary suitability, halal claim, price or restaurant availability. |

Both integrated APIs currently require no key for these public requests. Respect provider usage/attribution terms before a larger launch. Open Library explicitly discourages using its API as bulk/high-traffic commercial infrastructure; this is a cached, on-demand small pilot lookup. TheMealDB was evaluated but its test key is described for development/educational use, so it is not used for this hosted installation.

Operator switch: `BETWEENUS_DISCOVERY=curated` disables external catalog requests. The default `public` enables them only when a signed-in member asks for fresh ideas. It adds no required credential or paid service.

## Privacy and failure handling

`GET /api/ideas?intent=watch|eat|do` requires verified identity and a currently active CoupleSpace through the existing server/RLS snapshot. Only that strict, ordinary intent is accepted. The endpoint accepts no URL, actor, couple ID, search term, location, sensitive domain or personal preference. Provider requests use fixed public URLs and a generic application User-Agent; no couple context, answers, notes or IDs are sent.

All fetches are server-side; the browser loads no provider images/scripts/trackers. Responses are generic text/IDs, schema-validated, deduplicated, and returned with the normal authenticated no-store response policy. Source links are constructed from validated IDs under fixed HTTPS hosts rather than trusting provider URLs.

Provider fetches have a four-second timeout, redirects disabled, a 128 KB streamed response budget, and six-hour public-data caching. Failed/empty/malformed/rate-limited/oversized responses quietly return curated starters. Errors contain no provider or private payload. Capture persistence, reactions, and questions remain independent of discovery.

## Verification

Six new tests cover rotation, finite output, attribution, safe URL construction, provider filtering, strict schemas, bounded responses, outage fallbacks, optional disablement, and no outbound requests for food ideas. The complete suite totals **30 tests**.

An additional two-profile browser journey verifies an empty collection remains empty before selection, saved starters synchronize with real authorship, fresh results stay outside history until chosen, source URLs survive capture, authentication/membership checks reject unauthorized calls, sensitive/actor query inputs are rejected, API failure leaves starters usable, and the mobile page fits its viewport. Together with the original A/B/C journey, **two browser tests pass**.

Real public TVMaze and Open Library responses were fetched and validated against the adapters. Hosted deployment/session checks are recorded separately in the deployment status and build report; do not equate provider metadata validation with verified email signup/delivery.

## Three possibilities on Our Space — owner-requested extension

The owner asked for an automatically filled, feed-like hub with three useful main suggestions. Our Space now leads with **Do together**, **Watch or read**, and **Connect together**, even when shared history exists. It remains a finite home without infinite scrolling or automatic posting.

Ordinary saved items are ranked first using the existing real reason codes. Either participant's negative reaction excludes the item; private/intimate/faith objects do not enter ordinary recommendation pools. Saved choices can be opened and independently reacted to. Featured saved items are excluded from the default recent/resurfacing sections to avoid repeats. New activities use the small curated activity/food set; daily rotation is deterministic in UTC. Each slot has a local **Something else** action, with no provider call or notification.

Reading/viewing includes four source-linked editorial possibilities: two Berkeley Greater Good in Action practices and two TED talks. Linked pages and publisher titles were checked successfully; only original short suggestions are stored, without copying articles/transcripts or embedding third-party players/trackers. The visible editorial choice remains stable while live catalog results load. Source links open only on an explicit click.

Authenticated `GET /api/home-suggestions` requires an active space and rejects all query parameters. It loads the existing fixed TVMaze and Open Library catalogs in parallel and returns at most six ordinary choices to rotate through a single visible reading/viewing slot. The client requests once per mounted home, never on four-second snapshot polls. No couple text, identifiers, location, reactions or sensitive domains are sent to providers. Existing timeout/byte/schema/cache limits and `BETWEENUS_DISCOVERY=curated` remain authoritative. Complete local cards render immediately and remain usable on failure.

**Save this idea** and **Suggest to my partner** use the existing strict capture mutation; suggesting adds an attributable invitation sentence to the shared item's body, not a message/reminder or manufactured agreement. The partner's response is voluntary. A Question Card suggestion opens a prefilled editable draft; nothing is posted until **Place the question**. Ordinary prompts appear directly. An optional **Open an intimacy question privately** action exists only while the server-confirmed two-person gate is active; it does not display intimate text on Home. Withdrawing opt-in removes an open intimate draft on the next active poll. Tab hiding dismisses drafts. Existing DB/RLS enforcement remains authoritative.

Four additional unit tests cover empty-home usefulness, daily stability, actual-history reasons/negative reactions, duplicate source exclusion, capture attribution, and the separate intimacy gate. A third browser journey covers the complete three-card home, provider outage, source-linked suggestion persistence, draft-before-post behavior, query spoof denial, and mobile layout. The original A/B/C journey now also tests intimate draft withdrawal. No schema, required environment variable, paid integration, or member opt-in was added.
