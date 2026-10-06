# Hosted deployment status

## Supabase prepared

- Dedicated project: **BetweenUs V1**, reference `vrvolqziqlzpwnncxysf`.
- Existing owner organization: `jemxisoblmkepvfohmrw`.
- Region: `ap-south-1` (Mumbai).
- API URL: `https://vrvolqziqlzpwnncxysf.supabase.co`.
- Project creation quote: **USD 0/month**. No paid upgrade requested.
- Foundation migration applied successfully. All ten application tables have RLS enabled; the authoritative intimacy installation flag initially defaulted to false (see the owner-requested activation below).
- `scripts/verify-hosted.sql` passed on hosted PostgreSQL using authenticated A/B/C and anonymous roles. It exercises pairing, capture, reactions, response transitions, private preview/detail policy, actor spoof denial, cross-space denial, anonymous RPC denial, disabled intimacy, and privileged maximum-two enforcement. It rolls back every synthetic identity and row.
- The script does not verify actual Auth JWTs, email delivery, HTTP cookies, or the hosted browser journey. Those still require the deployed application.
- Repository follow-up verification: lint, type checking, all **24 tests**, and production build passed. The added automated smoke test also verifies that no synthetic identities/spaces survive rollback. No application behavior changed in this follow-up.

Security advisors reported two informational `rls_enabled_no_policy` notices for `private.features` and `private.invites`. This is intentional default-deny: application users have no direct table access/policy, and narrowly authorized private helpers provide access. Do not add permissive policies to silence these notices. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

Performance advisors identified eight unindexed foreign keys and eleven per-row Auth policy evaluations. These are optimization follow-ups for the pilot-size schema, not reasons to relax authorization. Review before collections grow: [foreign key indexes](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys), [Auth init plans](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan). Unused-index notices are expected on the fresh project; retain the existing indexes.

## Vercel production

- Live URL: **https://between-us-three-beta.vercel.app/**.
- Owner workspace: `smile-plzzs-projects`, ID `team_aR7JG2YPPjTCdZIHu8PHKB2R`, Hobby.
- Existing project: `between-us`, ID `prj_8a0OQFmtjznAo3NbFY5udjhggDRs`.
- Verified application source: `smile-plzz/BetweenUs`, branch `main`, commit **`738188d890eec53194bfbcd4d98892f646b617b3`**.
- Verified production deployment: **`dpl_5aagMPNYHa5HWA1dMcRbgTGghDhY`**, status READY; build duration 29 seconds.
- Immutable deployment URL: `https://between-k824ot1ys-smile-plzzs-projects.vercel.app`.

The user initially imported the repository into Vercel. The page built but `/api/space` and anonymous logout returned 500: Production lacked `BETWEENUS_BACKEND` and `APP_ORIGIN`. Browser-based Vercel CLI login restored access independently of the failing ChatGPT Vercel plugin. The existing project was verified before linking; no duplicate application or paid upgrade was created.

Production now has `BETWEENUS_BACKEND=supabase`, `APP_ORIGIN=https://between-us-three-beta.vercel.app`, the dedicated Supabase URL above, and that project's publishable key. Existing integration URL/key variables were updated while retaining their integration-supported Config type. No service-role key is used by the application. Do not share the pilot database with automatic preview deployments.

After rebuilding with the corrected variables:

- `/api/space` without a session returns **401 Please sign in**, rather than 500.
- Anonymous same-origin logout returns **200**, confirming the route/configuration/cookie boundary.
- A synthetic invalid login returns **400** from the normal authentication path, rather than a configuration failure. No real account password was used.
- The mobile browser renders the signup form and sign-in entry point with **no page JavaScript errors**. Screenshot fixtures stay outside Git.
- Supabase reports ACTIVE_HEALTHY; its public Auth settings endpoint returns 200, email signup is enabled, and email confirmation remains required.
- The new deployment's error-level runtime-log query returned no entries. This is a short smoke window, not a long-term monitoring guarantee.

Vercel CLI authentication files, project links, and pulled environment files remain outside Git; `.vercel` is explicitly ignored. The plugin's original 403/unknown-action issue is not claimed fixed. CLI access provides the working management boundary for this cloud workspace. Vercel Hobby is for personal/noncommercial use; reconsider the plan before a commercial launch.

## Live provider/browser verification — 2026-10-06

The activity refinement above was verified on the stable production alias using three temporary synthetic identities and genuine Supabase password-login sessions. Fixtures were administratively seeded as email-confirmed; no messages were sent, confirmation requirements were not disabled, and no service-role credential was added to the application. This verifies login/session behavior, **not signup email delivery or confirmation callbacks**.

The browser checks passed:

- A creates a space and invites B; B joins from a separate mobile browser session.
- Three starter ideas appear without preloading shared history. A explicitly saves one; attribution remains A and it synchronizes to B.
- B independently reacts; A sees the attributable reaction.
- A creates a Question Card; B chooses Not now, preserving a legitimate voluntary response.
- Unpaired C cannot request catalogs (403). After C creates a separate space, guessing A's object detail ID returns 404.
- Decide Together returns exactly three live TVMaze documentary suggestions and three Open Library reading suggestions; food returns three curated starters. A saves a catalog suggestion through the existing capture boundary.
- The mobile page has no horizontal overflow; all three browser sessions report no page JavaScript errors and logout succeeds.

All fixture spaces, objects, questions, reactions/responses, events, invitations, memberships, profiles and Auth identities were deleted afterward. Scoped verification returned zero remaining Auth/profile/membership fixtures; the ignored local password file was removed. No real member records were altered. Screenshots contain synthetic content only and remain outside Git.

Final local checks for this application revision: lint, type checking, **30 tests across four files**, **two browser journeys**, and production build passed. The discovery request boundary, bounded provider parsing, deterministic fallbacks, and save independence have automated coverage; see [discovery architecture](discovery-starters.md).

## Remaining hosted validation

1. Review Supabase Auth's site URL (`https://between-us-three-beta.vercel.app`) and exact redirect allowlist (`https://between-us-three-beta.vercel.app/auth/callback`). Keep confirmation enabled, configure SMTP, minimum password length 12, and provider rate/session settings. The available Supabase MCP tools do not expose Auth configuration; the owner must configure it in the dashboard or provide a securely connected management boundary. **Email delivery and callback correctness have not been verified.**
2. Complete self-service signup/confirmation/recovery and the sensitive-detail browser review with controlled pilot accounts. Real provider login, pairing, capture, sync, reactions, a question response, catalog decisions and guessed-ID denial passed above; sensitive policies also have hosted SQL/local browser coverage. The owner explicitly enabled the controlled adult-text feature as recorded below; broader lifecycle/privacy review remains open before expanding beyond the controlled pilot.
3. Review/remove unused integration-provided credentials from this project's runtime when the provider integration permits it; the application reads only its documented Supabase URL/publishable key and origin/backend settings.
4. Repeat the controlled-pilot lifecycle/recovery review before real sensitive use. The live signup screen does not constitute broad launch readiness.

The repository README contains the full setup and controlled-pilot boundaries. No credentials, tokens, or synthetic database contents belong in this document.

## Owner-requested intimacy activation — 2026-10-07 (Asia/Dhaka)

After reporting successful account creation and local product testing, the owner explicitly requested enabling **Intimacy & desire** on the hosted installation. The operator updated only `private.features.intimacy_pilot` to true in the existing dedicated project. No member opt-in, Auth requirement, RLS policy, permission, or code was changed. New installations still default to disabled. No redeployment is required: the authenticated snapshot reads the authoritative database flag.

A rollback-only hosted PostgreSQL check verified availability, denial with only one opted-in partner, successful question/answer creation after both opt in, generic previews excluding synthetic intimate text, outsider detail denial, and immediate database access denial after either participant opts out. The check rolled back all synthetic identities and content. The existing automated intimacy opt-in/revocation test was rerun successfully.

Participants must each enable their own checkbox in Privacy and settings and save. Closing/reopening settings or refreshing retrieves availability. Installation enablement does not select anyone's checkbox, establish current sexual consent, or change the documented controlled-pilot lifecycle/recovery limitations. Operators can revoke installation availability with `update private.features set intimacy_pilot = false where singleton;`.
