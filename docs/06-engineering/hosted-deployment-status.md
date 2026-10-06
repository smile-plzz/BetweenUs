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

## Vercel access blocker

The connected identity is `smile-plzz`, on Hobby. Its default workspace is `smile-plzzs-projects`, ID `team_aR7JG2YPPjTCdZIHu8PHKB2R`. The current Vercel connection lists no accessible teams and returns HTTP 403 for that workspace: "You must re-authenticate to this scope or use a token with access to this scope."

No Vercel project or deployment was created. Reconnect the Vercel app with permission for this exact workspace; no passwords or tokens need to be pasted into chat. Vercel Hobby is for personal/noncommercial use; reconsider the plan before a commercial launch.

## Resume checklist

1. Verify access to the workspace above. Link `smile-plzz/BetweenUs`, root directory, branch `main`, to a new `betweenus` Next.js project. Use Node 24 and the normal `npm ci` / `npm run build` pipeline.
2. Retrieve only the new Supabase project's publishable key and put it in Vercel's encrypted environment settings. Set `BETWEENUS_BACKEND=supabase`, `SUPABASE_URL` to the API URL above, `SUPABASE_PUBLISHABLE_KEY`, and `APP_ORIGIN` to the actual stable HTTPS application domain. Never use a service-role key. Do not share the pilot database with automatic preview deployments.
3. In Supabase Auth, set the site URL and exact `/auth/callback` redirect for that domain. Keep email confirmation enabled, configure SMTP, minimum password length 12, and provider rate/session settings. The available Supabase MCP tools do not expose Auth configuration; the owner must configure it in the dashboard or provide a securely connected management boundary.
4. Deploy and inspect build/runtime results. Test A/B/C through real provider sessions: signup/confirmation, pairing, capture, polling sync, reactions, questions, retrieval, decisions, guessed-ID denial, and discreet rendering. Keep intimacy disabled.
5. Record the actual live URL, exact Git SHA, environment scope, and hosted verification results here and in BUILD_REPORT.md. Do not describe the product as live until these checks pass.

The repository README contains the full setup and controlled-pilot boundaries. No credentials, tokens, or synthetic database contents belong in this document.
