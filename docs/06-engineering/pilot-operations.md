# Controlled-pilot operations

This V1 is intended for the documented controlled two-person pilot. Keep production data separate from local tests. Do not copy relationship text into issues, logs, screenshots, development seeds, or external AI.

## Before inviting a pair

1. Set up a dedicated Supabase pilot project and apply the migration. Run Supabase security/performance advisors and review Auth settings. Require verified email; set the minimum password length to 12. Keep JWT lifetime short. Enable provider rate limits and configure trusted SMTP for email confirmation/recovery.
2. Set `BETWEENUS_BACKEND=supabase`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and the exact HTTPS `APP_ORIGIN`. Add `/auth/callback` to the project's Auth redirect allowlist. Use the origin for the Supabase site URL.
3. Exercise A/B pairing in separate browsers. Try access from an unrelated C account. Repeat the browser journey against the provider rather than assuming a successful local run proves hosted configuration.
4. Start with intimacy disabled. The optional adult-text pilot requires both participants' informed interest, installation flag enablement, and independent settings opt-in. Pairing does not enable it.
5. Explain intentional sharing, voluntary participation, generic previews, the limits of discretion, and the current retained-but-inaccessible policy on closing a space. Explain how to contact the pilot operator for deletion/export/recovery. Do not enroll anyone for whom these limits are unacceptable.

## Intimacy feature flag

Local mode reads `ENABLE_INTIMACY_PILOT=true` at startup. For a hosted Supabase installation, the database flag is authoritative and must be changed by a trusted operator in the SQL editor:

```sql
update private.features set intimacy_pilot = true where singleton;
-- Revoke the installation-wide capability:
update private.features set intimacy_pilot = false where singleton;
```

Both active memberships must also opt in. No user can enable another person's preference or the installation flag. Revocation blocks future explicit rows through RLS; the UI clears an open card/item on its next poll (up to four seconds while active) or immediately when the tab hides. Withdrawal permanently dismisses an affected open detail, suggested question draft, or manually written intimate capture/question draft; restoring opt-in makes the preview available but requires a fresh explicit opening action. Detail responses that were pending across a membership/session or intimacy revocation are invalidated. Copies previously made by an authorized partner cannot be recalled. Use the ordinary collection without enabling this feature until provider/lifecycle/recovery review is complete.

## Closing, deletion, and export

The in-app Leave action requires an explicit typed confirmation. It closes the whole space and removes both members' access. The creator has no special powers to retain access. Joining a later space does not expose old content.

For this controlled pilot, a verified participant can ask the trusted operator to permanently delete the old closed space's contents. Verify identity through the authenticated account/recovery channel; never rely on possession of a space ID. Confirm the exact space and explain that this removes both people's shared copy. First confirm the space is already closed; do not delete a currently active home without an explicit closure. In a transaction, delete that space's events, shared objects (reactions cascade), question cards (responses cascade), invitations, memberships, and finally the space. Do not delete the other person's account. Do not run broad unscoped DELETE statements. Record only the request ID, date, and outcome in operational records, not shared text. Follow the provider's backup expiry policy and accurately disclose that backups may retain an inaccessible copy until expiry.

Export is not built into V1. Before fulfilling a manual export, verify participant identity and consult both parties' informed pilot agreement, including the separate explicit-content permission. Use a protected destination, exclude local credentials/session tokens/invite tokens, and include provenance/attribution. Do not email intimate data or attach it to support tickets. If the agreement does not resolve export rights, pause that export; continue to offer closure and deletion as described. Resolve self-service export/deletion rights before broad production.

## Account or device compromise

Disable the relevant membership/capability or close the space to immediately prevent further couple-data access. Revoke Supabase sessions through supported provider controls and account recovery; do not assume deleting an account invalidates every existing token. Review Auth logs without collecting relationship content. The application uses `getUser()` and fresh membership checks, but does not independently verify `auth.sessions` on every operation. For a stricter immediate device-session revocation guarantee, implement that boundary before an uncontrolled sensitive launch.

Local auth has no email confirmation, recovery, or remote session management and is never appropriate for live sensitive pilot data. It exists to let developers verify the real domain/policies without credentials.

## Validation

Follow `../07-validation/30-day-couple-test.md`. Structural events are available to authorized members/operators in `public.events`, but the product has no contribution leaderboard. Interview each participant separately about pressure, discretion, and usefulness. The strongest outcomes are voluntary capture, useful retrieval/decisions, and comfortable participation—including Pass/Not now—rather than maximizing app usage.
