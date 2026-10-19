# VisionSecure Integration Setup Center

## Latest OpenAI key replacement

Replaced `OPENAI_API_KEY` in ignored `.env.local` with the newly supplied key; retained the configured model. A fresh bounded Responses API request (`Reply with OK.`, `store: false`, maximum 32 output tokens, no retries or customer data) returned HTTP 429, `credit_balance_exhausted`. The replacement key is configured locally, but generation remains blocked by provider billing credits. Add credits to the OpenAI API project/account and retest. Restart the local app to reload environment changes. Vercel Production still requires its own `OPENAI_API_KEY` update and redeploy; this local operation did not change deployment settings. Credential scan found matches only in ignored, untracked `.env.local`.

## Preferred Google account follow-up

The owner's supplied Gmail is configured as `GOOGLE_LOGIN_HINT` only in ignored `.env.local`. Google connection requests now pass that value as `login_hint`, Google's account-selection hint. This does not grant permissions, create an administrator, restrict other Google accounts, or complete consent. The existing website administrator login remains separate from the Analytics/Search Console connection.

The Super Admin integration card now displays the preferred account, active OAuth Client ID and exact callback even when credentials come from deployment settings. Compare those displayed values with Google Cloud rather than assuming the live site uses local settings.

For Vercel Production, set `GOOGLE_LOGIN_HINT` to the same owner Gmail and deploy this code change. In Google Cloud > Google Auth Platform > Audience, add that Gmail under Test users if the app is in Testing. Confirm that Gmail has access to the actual Analytics property and Search Console site. Continue using the new `6csmr...` OAuth client and the two callbacks below. A `redirect_uri_mismatch` still requires correcting the callback registration; choosing an email does not resolve it.

The latest exact provider error has been requested because “not working” does not establish whether the remaining failure is callback registration, test-user eligibility, consent, or service permissions. No authenticated Google Cloud/Vercel dashboard session is available here; the owner must complete Google consent. Official behavior: [Google OAuth login_hint and redirect URI requirements](https://developers.google.com/identity/protocols/oauth2/web-server).

Validation: Google OAuth and integration regression suites passed, including preferred-account and no-hint flows with PKCE/state retained. TypeScript passed. Two browser tests passed for visible account/client/callback diagnostics at 375px and 1280px with no horizontal overflow. Credential scan matched only ignored `.env.local`. These are local/mocked checks, not proof of Google account eligibility or successful production consent.

## Current Google OAuth fix: redirect_uri_mismatch

The latest supplied credential pair replaces the earlier client. Ignored `.env.local` now contains Client ID `80619856686-6csmrkii0rmvctgkd3rm0vuqngj84emd.apps.googleusercontent.com` and its matching secret. The secret is not reproduced here. Both environment credentials take precedence over any saved database app configuration.

Checked from the actual local environment and Google OAuth library: the generated request uses that new Client ID and `http://localhost:3000/api/admin/integrations/google/callback`. The encryption key has the required format and app URL settings have no conflicts. This verifies local request construction, not Google Cloud registration or a completed connection.

### Google Cloud settings to complete

1. Open [Google Cloud credentials for sigma-rarity-419017](https://console.cloud.google.com/apis/credentials?project=sigma-rarity-419017).
2. Open the **Web application** OAuth client whose ID is exactly `80619856686-6csmrkii0rmvctgkd3rm0vuqngj84emd.apps.googleusercontent.com`. Editing the previous `tgbous...` client will not fix requests using the new client.
3. Under **Authorized redirect URIs**, add both entries below as separate rows and save:

   ```text
   http://localhost:3000/api/admin/integrations/google/callback
   https://visionsecuretech.in/api/admin/integrations/google/callback
   ```

   These are full callback paths, not just website origins. Adding them only under Authorized JavaScript origins does not register the OAuth callback. Keep scheme, hostname, port, path and trailing slash exactly as shown; there is no trailing slash after `callback`.
4. For local use, restart the existing Next.js server, use `http://localhost:3000`, and start a fresh Google connection from Settings > Integrations. Do not retry an old Google error-page URL. If the dev server runs on another port, align the app URL settings and registered callback with that port before connecting.
5. For the live website, update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the hosting provider's server environment and set `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` to `https://visionsecuretech.in`, then redeploy. Local `.env.local` edits do not update hosting configuration. Preserve the existing Google encryption key if encrypted settings or tokens already exist.
6. Enable Analytics Data API and Search Console API. If the OAuth app is in Testing, add the Google account you will use as a test user. Connect with an account that can access the Analytics property and Search Console site, approve consent, then run the Google integration test.

If the error persists, open **error details** and compare `redirect_uri` and `client_id` with the two values above. Share only those public values for diagnosis, not the full authorization URL, secret, code or state. Google Cloud changes and interactive account consent have not been completed by this local update. Google remains unverified until that flow succeeds.

Google requires the requested callback to match a registered redirect URI exactly: [official OAuth web-server guide](https://developers.google.com/identity/protocols/oauth2/web-server#authorization-errors-redirect-uri-mismatch). Rotate the secret shared in chat before production use, updating the matching server configuration afterward.

### Vercel production settings

Hosting is Vercel (confirmed by the operator and public response headers). There is no authenticated Vercel or Google Cloud management connection in this workspace, so the remote settings below still require dashboard access.

Open the Vercel project serving `visionsecuretech.in` > Settings > Environment Variables. Add or update these values for **Production**:

| Variable | Production value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | `80619856686-6csmrkii0rmvctgkd3rm0vuqngj84emd.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Matching secret from ignored local `.env.local`; never put it in a `NEXT_PUBLIC_` variable |
| `AUTH_URL` | `https://visionsecuretech.in` |
| `NEXTAUTH_URL` | `https://visionsecuretech.in` |
| `NEXT_PUBLIC_APP_URL` | `https://visionsecuretech.in` |
| `NEXT_PUBLIC_SITE_URL` | `https://visionsecuretech.in` |

Preserve the deployed `GOOGLE_TOKEN_ENCRYPTION_KEY` if already configured; it must be 64 hexadecimal characters. If absent on a fresh production integration, generate a dedicated production key before connecting. Do not replace a key that protects existing Google credentials/tokens.

Save, then redeploy the production deployment so it picks up the new variables. Add both localhost and production callbacks to the **same new Google Cloud OAuth client**, as shown above. After deployment, visit `https://visionsecuretech.in/admin/settings/integrations`, check that the displayed callback is the production callback, then start a fresh Google connection. Local app URL variables must remain `http://localhost:3000`; do not copy the production URL values into local configuration.

Validation for this credential update: Google OAuth and integration regression suites passed; new-client callback generation passed for both localhost and simulated production configuration. The secret scan found credentials only in ignored, untracked `.env.local`. No remote settings, Google consent or production connection have been verified by these tests.

## Latest configuration and live checks — 2026-09-22

Historical Client ID follow-up (superseded by the credential pair at the top): previously configured the `tgbous...` client ID without a matching secret. At that time a read-only database check confirmed no saved Google app secret or connected refresh token. The setup form was updated to prefill an environment Client ID when no app had been saved.

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
