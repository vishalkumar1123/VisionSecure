# VisionSecure Integration Setup Center

## Latest configuration and live checks — 2026-09-22

This section supersedes older missing-secret observations below. The supplied Meta App ID (`2010881339552808`), App Secret and OpenAI API key are configured only in ignored `.env.local`. The existing server-side webhook signature verifier consumes `META_APP_SECRET`; the AI client consumes `OPENAI_API_KEY`. No deployment settings were changed.

The website tag now reads `NEXT_PUBLIC_GA_ID`, with the existing `G-XRYGR89Q5K` fallback and measurement-ID validation. The screenshot confirms that measurement ID and stream `15223351834` for `https://visionsecuretech.in`. Google Cloud project `sigma-rarity-419017` / `80619856686` and the stream ID are recorded separately as metadata. Neither is an OAuth client ID or Analytics property ID. The existing Analytics property fallback `544810814` is preserved but its association with this stream has not been verified.

Live checks (`node tests/live-provider-check.cjs`, explicitly opt-in, small synthetic AI request and read-only Meta token inspection):

- OpenAI: HTTP 429, `credit_balance_exhausted`. Add billing credits before retesting generation.
- Meta: token inspection returned HTTP 200, matching App ID, but `is_valid: false`, error 190. Replace `META_ACCESS_TOKEN` through secret storage. `META_GRAPH_VERSION` still needs the supported version selected in the app dashboard. The diagnostic uses Meta's app-default version only for token inspection; messaging remains blocked until explicitly configured. No message was sent.
- Google: local OAuth client ID/secret are missing. The measurement and stream values match the supplied screenshot. Live Analytics ingestion and reporting access remain unverified.

Complete Google setup in [this project's credentials page](https://console.cloud.google.com/apis/credentials?project=sigma-rarity-419017): enable Analytics Data API and Search Console API, create a Web application OAuth client, configure consent/test users, and register the two callback URLs documented below. Save its client ID/secret through the existing Super Admin Google setup form or server environment, then connect Google. Confirm the numeric GA4 property ID in Analytics Admin and set `GA4_PROPERTY_ID`; do not use the stream or Cloud project number.

The live AI check follows the [OpenAI Responses API](https://developers.openai.com/api/reference/cli/resources/responses/methods/create) with `store: false`. The screenshot's `G-` identifier is the [Google Analytics measurement ID](https://support.google.com/analytics/answer/12270356?hl=en). Secrets shared in chat should be rotated through provider secret storage before production use.

Validation this follow-up: all nine existing Node regression files passed. Production build passed, including TypeScript and all 74 pages; the built browser chunk contains the expected measurement ID. The credential scan found matches only in ignored, untracked `.env.local`; `git diff --check` passed. The existing non-blocking next-sitemap module-type warning remains. These local checks do not establish production deployment or live Analytics collection.

Implemented in the existing Next.js / MongoDB Admin. No replacement authentication, CRM, email service, AI, notification service or conversation system was introduced.

## Audit and implementation

The audit covered Google OAuth / callback / encryption, Analytics Data API, Search Console, PageSpeed, OpenAI Responses, Meta signing and outbound delivery, Inbox, AI Agent, published knowledge, customer identity and lead resolution, encrypted email settings, RBAC, activity logs and notifications. Existing work in the workspace was preserved.

The existing foundation already provided PKCE, expiring session-bound single-use OAuth state, encrypted refresh tokens, read-only Google scopes, signed/schema-validated WhatsApp webhooks, transactional inbound deduplication, delivery status updates, shared normalized channels, published-knowledge AI drafts, and atomic conversation send locks. These remain in use.

The setup page now groups Website & Google, Customer Messaging, AI, Email & Notifications, and System Health. It includes setup progress, provider links, expandable guides, safe URL copying, configured/missing indicators, sanitized test results and timestamps. Setup diagnostics and provider actions require Super Admin authorization. Existing Inbox users retain their normal permissions.

Changes include:

- A single trusted environment-based app origin resolver; OAuth never derives its redirect destination from an arbitrary Host header.
- A required dedicated Google encryption key; removed the auth-secret fallback. Connect is disabled without it.
- Tiny server-side OpenAI Responses test, configured model, no customer data, `store: false`, bounded output, timeout and no retries. Billing, authentication and model-access errors are sanitized.
- Safe Test All: MongoDB ping, small read-only Google requests, OpenAI synthetic prompt, Meta phone metadata, SMTP authentication/connectivity without sending email. It does not activate email or change AI mode.
- Persisted integration checks, last successful test/request and sanitized failures. Server configuration fingerprints remain private and invalidate stale test results when environment settings change.
- Meta configuration checks require an explicit valid Graph version. Webhook verification is persisted separately from API capability checks. A verified phone lookup alone does not mark WhatsApp connected.
- Explicit WhatsApp outbound test requires Super Admin, same-origin request, an entered test number, confirmation, a recent inbound conversation already taken over by that administrator, rate limiting and an idempotency key. It uses the existing sender and service-window rules.
- Channel enums on shared Conversation and Message models; connected-channel filters in Inbox. Non-WhatsApp outbound sends are blocked until their adapters exist, preventing accidental routing through WhatsApp.
- Activity events for Google configuration/connect/disconnect/failure, AI/Meta/health tests, webhook verification and explicit test sends. Existing AI-mode and takeover audit events remain.
- Local SMTP password quoting and literal-dollar escaping so dotenv preserves its complete value. Local app URL conflicts fixed. Expanded environment/log ignores.

## Actual provider status observed on 2026-09-21

| Provider | Observed result |
| --- | --- |
| MongoDB | Live read-only ping passed |
| Google | No saved OAuth app or connection; provider credentials still required |
| OpenAI | Key configured locally; tiny live request returned HTTP 429, `credit_balance_exhausted`; generation is not verified |
| AI mode | Existing settings enabled, mode DRAFT; not changed by this work |
| Meta / WhatsApp | Partial local configuration; App Secret and explicit Graph version still missing; no live message sent |
| Email | Existing encrypted database configuration reports ACTIVE and verified; preserved; no email sent |
| Instagram | Shared channel/model architecture prepared; account adapter and permission/webhook verification not implemented |
| Facebook | Shared channel/model architecture prepared; account adapter and permission/webhook verification not implemented |
| Website Chat | Shared WEBSITE channel prepared; public widget not active |

Google live OAuth consent, GA4/GSC access and Meta inbound/outbound delivery require provider setup and operator interaction. Mocked tests do not prove live provider permissions. SMTP's stored verification status is not a fresh delivery test.

## Local and production configuration

Local values for `NEXTAUTH_URL`, `AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`:

```text
http://localhost:3000
```

Production values for those same variables:

```text
https://visionsecuretech.in
```

Both Google OAuth Web application authorized callbacks:

```text
http://localhost:3000/api/admin/integrations/google/callback
https://visionsecuretech.in/api/admin/integrations/google/callback
```

The real Search Console property remains `https://visionsecuretech.in/` in both environments. Configure the actual verified property and Analytics property in deployment settings.

Production WhatsApp webhook:

```text
https://visionsecuretech.in/api/webhooks/whatsapp
```

For local webhook development, use a public HTTPS tunnel. Never register a localhost endpoint with Meta.

The local environment now includes OpenAI configuration and newly generated random local `GOOGLE_TOKEN_ENCRYPTION_KEY`, `META_VERIFY_TOKEN`, and `CRON_SECRET`. These are ignored and are not deployment configuration. Do not upload `.env.local` or reuse exposed credentials in production.

## Deployment variables — names only

| Group | Names |
| --- | --- |
| App/auth | NEXTAUTH_URL, AUTH_URL, NEXTAUTH_SECRET, AUTH_SECRET, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_URL |
| Database | MONGODB_URI |
| Google | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_TOKEN_ENCRYPTION_KEY, GA4_PROPERTY_ID, GOOGLE_SEARCH_CONSOLE_SITE_URL, GOOGLE_PAGESPEED_API_KEY |
| OpenAI | OPENAI_API_KEY, OPENAI_MODEL |
| Meta | META_APP_SECRET, META_VERIFY_TOKEN, META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, META_GRAPH_VERSION |
| Email | SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, ADMIN_NOTIFICATION_EMAILS, LEAD_NOTIFICATION_EMAILS, EMAIL_CONFIG_ENCRYPTION_KEY |
| Optional / worker | RESEND_API_KEY, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_CLARITY_ID, CRON_SECRET |

`SMTP_PASSWORD` and `EMAIL_FROM` are legacy aliases. Keep both auth secret aliases identical if both are supplied. The existing encrypted email configuration remains the notification source; adding SMTP environment settings alone does not activate it.

## Security incident and migration

The credentials shared in the conversation must be treated as exposed. Rotate the OpenAI key, database credential, Meta access token, SMTP credential, Resend key and auth secrets at their providers/deployment settings. This work does not revoke credentials remotely or rewrite Git history.

Do not blindly replace `EMAIL_CONFIG_ENCRYPTION_KEY`: existing encrypted email credentials depend on it. Plan re-encryption or re-enter the credentials during a controlled rotation. Similarly, preserve any existing dedicated Google encryption key until its stored data is migrated. For old Google auth-secret fallback deployments: disconnect while the old deployment can decrypt, configure a dedicated key, re-enter OAuth app credentials and reconnect. The inspected database had no saved Google app/connection.

Never paste production API keys into AI coding prompts. Use placeholders such as `OPENAI_API_KEY=<configured-in-deployment>`. Keep secrets in deployment secret storage; never in source, public environment variables, browser storage or documentation.

`docs/security-scan.json` records file/category/tracked status only. The scan covers tracked/untracked source, root runtime logs, ignored local environment and built browser JavaScript. The only matched credential file was ignored, untracked `.env.local`. This is a working-tree scan, not a historical Git audit or a guarantee against every credential format.

## Main files, models and routes

New: `lib/app-url.ts`, `lib/integrations/health.ts`, `models/IntegrationHealth.ts`, `components/admin/integration-setup-center.tsx`, `components/admin/whatsapp-test-send.tsx`, `tests/integration-setup.test.cjs`, `tests/integration-setup-ui.spec.cjs`, `tests/scan-secrets.py`.

Changed: integrations page; existing Google card/setup, OAuth/security/API and GoogleIntegration model; Customer Center API/security/inbound/dispatch and CustomerCenter model; Inbox and legacy integrations component; WhatsApp webhook; MongoDB error logging; `.env.example`, ignored `.env.local`, `.gitignore`; Google guide and existing regression fixtures.

Models: new IntegrationHealth stores sanitized diagnostics and a non-selectable configuration fingerprint. GoogleIntegration adds verification error/success timestamps. AIAgentSettings adds webhook verification time and verified business number. Conversation and CustomerMessage enforce the existing normalized channel enum. No separate CRM/conversation model was introduced.

New routes:

- `GET /api/admin/integrations/health`
- `POST /api/admin/integrations/health`
- `POST /api/admin/integrations/meta/test-send`

Changed route behavior: Google integration actions enforce Super Admin; existing Customer Center integration tests use the shared safe tester; WhatsApp GET verification persists status; existing Inbox conversation listing supports normalized channel filtering.

## Next steps

1. Rotate the exposed OpenAI key in OpenAI Platform; add project billing credits and replace `OPENAI_API_KEY` through secret storage. Restart/redeploy and run Test AI Connection. The selected local model is `gpt-4o-mini`; change `OPENAI_MODEL` if desired after checking Responses/structured-output access.
2. Rotate the other exposed provider/auth credentials with the encryption migration precautions above.
3. In Google Cloud, enable Analytics Data API and Search Console API; create OAuth Web application, configure consent/testing users and add both callbacks. Save credentials, connect as Super Admin and test.
4. In Meta, configure app/business assets, number, App Secret and supported Graph version. Set the verify token in the webhook setup, subscribe to messaging events, verify a real inbound message from your test phone and explicitly test a reply.
5. In production, configure the variables above in the deployment provider. Use production URL values and independently generated server secrets; restart/redeploy.
6. Visit Settings → Integrations as Super Admin and run Test All Integrations. Keep DRAFT until published knowledge and manual review are ready.

Official references: [OpenAI server SDK setup](https://developers.openai.com/api/docs/quickstart), [selected model](https://developers.openai.com/api/docs/models/gpt-4o-mini), [Google credentials](https://console.cloud.google.com/apis/credentials), [Meta apps](https://developers.facebook.com/apps/), [WhatsApp guide](https://developers.facebook.com/documentation/business-messaging/whatsapp/), [Instagram](https://developers.facebook.com/docs/instagram-platform/), [Messenger](https://developers.facebook.com/docs/messenger-platform/). Meta documentation fetching was rate-limited during this session, so no current permission list or supported Graph version was guessed; use the app dashboard's current requirements.

## Validation

- Production build: `npm run build` passed, including TypeScript, all 74 generated pages and sitemap generation (exit 0).
- Standalone TypeScript check passed during implementation.
- ESLint passed after fixing internal navigation to use Next.js Link.
- All 9 Node regression files passed, including authorization, Google state/replay/encryption, WhatsApp signatures/deduplication, human takeover, AI Draft, email safety and setup diagnostics.
- 39 Playwright tests passed: Setup Center at 375, 430, 768, 1024, 1280 and 1440 pixels in light/dark themes, existing Inbox layouts, Google setup, human takeover and explicit WhatsApp test confirmation. Providers were mocked; no external messages sent.
- Read-only live MongoDB ping passed. Live OpenAI request was blocked by exhausted credits; live Meta token check was rejected with HTTP 401.
- Working-tree/browser-bundle credential scan found matches only in ignored `.env.local`. `git diff --check` passed.
- Remaining non-blocking build warning: next-sitemap configuration module type is unspecified.



## Meta asset follow-up ? 2026-09-22

The supplied Instagram account ID is stored as server-side `META_INSTAGRAM_ACCOUNT_ID`. Three other supplied IDs are preserved in ignored `.env.local` as `META_ASSET_CANDIDATES`, retaining their labels and explicitly unverified status. They are not assigned to App ID, Facebook Page ID, WABA ID or Phone Number ID without verification. The existing active WhatsApp Phone Number ID was preserved.

A live read-only request to Meta's token identity endpoint returned HTTP 401, error 190, subcode 467. No customer data was requested and no message was sent. The request used Meta's app-default version solely to check the token; it did not select or configure a Graph version for the integration. Asset access and asset types therefore remain unverified.

Required operator actions: replace `META_ACCESS_TOKEN` with a valid token via local/deployment secret storage, add `META_APP_SECRET`, set `META_GRAPH_VERSION` to the version configured for the Meta app, and identify whether the notification/business assets are Apps, Pages or WhatsApp accounts. Never paste replacement secrets into chat. Account IDs alone do not authenticate or activate Instagram/Facebook messaging.
