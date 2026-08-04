# Enso Voice community beta release gate

This is the operational gate for the first 50 community members. A build is not
called production-ready until every item in the release column is complete.

| Gate          | Owner         | Evidence required                                                       |
| ------------- | ------------- | ----------------------------------------------------------------------- |
| Client checks | Engineering   | `quality-check`, i18n, 1,136+ tests, renderer build                     |
| API checks    | Engineering   | lint, typecheck, unit tests, zero production audit findings             |
| Database      | Engineering   | Neon production created; migrations 001–002 applied                     |
| CRM           | Community ops | Signed webhook delivered; reconcile endpoint reports expected members   |
| Entitlements  | Community ops | 50 Community Pro and 4 Internal test accounts show correct balances     |
| Privacy       | Product       | `/privacy` and `/terms` live; audio ephemerality and opt-in sync stated |
| Cost guard    | Operations    | Deepgram/OpenAI/Vercel alerts; combined monthly ceiling US$150          |
| macOS         | Release owner | Company certificate, notarization and clean-machine smoke test          |
| Windows       | Release owner | Artifact Signing certificate and clean-machine smoke test               |
| Support       | Community ops | `support@ensovoice.com`, incident owner and rollback message ready      |

## Smoke test

Run once on a clean macOS account and once on a clean Windows account:

1. Install the signed build and confirm the publisher/Team ID.
2. Create and verify an account using a CRM-active email.
3. Confirm Community Pro shows 120 minutes and the correct reset date.
4. Dictate 30–60 seconds through Enso Cloud and confirm the balance falls.
5. Import a short two-speaker file with diarization and confirm the charge is 2× duration.
6. Enable note sync, edit on a second device, then disable sync.
7. Exhaust a test allowance and verify local and BYOK remain accessible.
8. Revoke the CRM membership and verify grace state, then expiry.
9. Delete the account and confirm sessions, notes, credits and membership link are removed.

## Rollback

- Pause the Vercel production deployment or promote the previous healthy one.
- Disable managed AI by removing provider keys; local and BYOK remain usable.
- Stop CRM delivery only after preserving failed event IDs for replay.
- Pull the affected desktop release from GitHub and publish a clear beta notice.

## Secrets and repository variables

Client release variables: `VITE_AUTH_URL`, `VITE_ENSO_API_URL`, the four
`AZURE_SIGNING_*` values. Client release secrets: Azure service principal and
Apple certificate/notarization credentials.

API secrets: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CRM_WEBHOOK_SECRET`,
`ADMIN_API_KEY`, `DEEPGRAM_API_KEY`, `OPENAI_API_KEY` and mail/OAuth credentials.
Never expose these with a `VITE_` prefix or package a local `.env` in Electron.
