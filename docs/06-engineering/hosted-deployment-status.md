# Hosted deployment status

## Supabase prepared

- Dedicated project: **BetweenUs V1**, reference `vrvolqziqlzpwnncxysf`.
- Existing owner organization: `jemxisoblmkepvfohmrw`.
- Region: `ap-south-1` (Mumbai).
- API URL: `https://vrvolqziqlzpwnncxysf.supabase.co`.
- Project creation quote: **USD 0/month**. No paid upgrade requested.
- Foundation migration applied successfully. All ten application tables have RLS enabled; the authoritative intimacy installation flag remains false.
- `scripts/verify-hosted.sql` passed on hosted PostgreSQL using authenticated A/B/C and anonymous roles. It exercises pairing, capture, reactions, response transitions, private preview/detail policy, actor spoof denial, cross-space denial, anonymous RPC denial, disabled intimacy, and privileged maximum-two enforcement. It rolls back every synthetic identity and row.
- The script does not verify actual Auth JWTs, email delivery, HTTP cookies, or the hosted browser journey. Those still require the deployed application.
- Repository follow-up verification: lint, type checking, all **24 tests**, and production build passed. The added automated smoke test also verifies that no synthetic identities/spaces survive rollback. No application behavior changed in this follow-up.

Security advisors reported two informational `rls_enabled_no_policy` notices for `private.features` and `private.invites`. This is intentional default-deny: application users have no direct table access/policy, and narrowly authorized private helpers provide access. Do not add permissive policies to silence these notices. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

Performance advisors identified eight unindexed foreign keys and eleven per-row Auth policy evaluations. These are optimization follow-ups for the pilot-size schema, not reasons to relax authorization. Review before collections grow: [foreign key indexes](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys), [Auth init plans](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan). Unused-index notices are expected on the fresh project; retain the existing indexes.

## Vercel production

- Live URL: **https://between-us-three-beta.vercel.app/**.
- Owner workspace: `smile-plzzs-projects`, ID `team_aR7JG2YPPjTCdZIHu8PHKB2R`, Hobby.
- Existing project: `between-us`, ID `prj_8a0OQFmtjznAo3NbFY5udjhggDRs`.
- Verified source: `smile-plzz/BetweenUs`, branch `main`, commit **`1a149b485e3272c1e5562acf7efbff0ba069d7dc`**.
- Verified production deployment: **`dpl_BR7jXSJCBvefxzNTSPqL5FXMbtVW`**, status READY; build duration 41 seconds.
- Immutable deployment URL: `https://between-rbm600xb6-smile-plzzs-projects.vercel.app`.

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

## Remaining hosted validation

1. Review Supabase Auth's site URL (`https://between-us-three-beta.vercel.app`) and exact redirect allowlist (`https://between-us-three-beta.vercel.app/auth/callback`). Keep confirmation enabled, configure SMTP, minimum password length 12, and provider rate/session settings. The available Supabase MCP tools do not expose Auth configuration; the owner must configure it in the dashboard or provide a securely connected management boundary. **Email delivery and callback correctness have not been verified.**
2. Test A/B/C through real provider sessions: signup/confirmation, pairing, capture, polling sync, reactions, questions, retrieval, decisions, guessed-ID denial, and discreet rendering. Hosted database role tests and local browser tests already pass; they do not substitute for this complete provider/browser test. Keep intimacy disabled.
3. Review/remove unused integration-provided credentials from this project's runtime when the provider integration permits it; the application reads only its documented Supabase URL/publishable key and origin/backend settings.
4. Repeat the controlled-pilot lifecycle/recovery review before real sensitive use. The live signup screen does not constitute broad launch readiness.

The repository README contains the full setup and controlled-pilot boundaries. No credentials, tokens, or synthetic database contents belong in this document.
