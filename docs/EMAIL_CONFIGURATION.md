# Email configuration implementation and operating guide

The email notification service remains **unverified against live Zoho SMTP** until a super-admin completes the manual checklist below. Automated tests mock SMTP; provider acceptance is not inbox-delivery confirmation.

## Setup and Save workflow

1. The server operator sets `EMAIL_CONFIG_ENCRYPTION_KEY` to **32 cryptographically random bytes encoded as 64 hexadecimal characters** in the server environment/secret manager. It must not have a `NEXT_PUBLIC_` prefix. Do not commit it, paste it into chat, or enter it into the website form. Preserve a secure backup; changing it without re-encrypting existing credentials makes them unreadable.
2. A super-admin opens **Settings -> Email Configuration** (`/admin/settings/email`). Admins have read-only status/log access; other roles are denied. Credentials must be supplied directly through this UI over HTTPS in production.
3. Choose Zoho Mail India: `smtp.zoho.in`, SSL/TLS port 465, secure connection on, authentication on. Alternatively choose STARTTLS: port 587, secure off, Require TLS on. Plain SMTP and arbitrary ports are not supported.
4. Enter the SMTP username and a **newly issued app password or newly changed mailbox password**. The previous exposed credential must be revoked first. No environment password is imported; a submitted password matching either legacy SMTP password environment value is rejected. The new-password confirmation is required, but the software cannot independently prove that a provider password was rotated.
5. Set sender/reply-to, recipients and event selections. Initial recipients are `info@visionsecuretech.in` and `vishalkumar8303763@gmail.com`. Addresses are trimmed, normalized, validated and deduplicated; maximum ten recipients.
6. Click the top **Save Configuration** or bottom **Save as Draft** button. The page confirms saving and shows the next step. Saving never activates delivery. Every configuration save conservatively resets verification and testing, including recipient/event-only edits.
7. **Test Connection** runs Nodemailer verification without sending an email. **Send Test Email** sends a separate test to each configured recipient. Check both inboxes (and spam folders). Only then select **Activate Notifications**.
8. Disable preserves the encrypted configuration. An already in-flight SMTP operation can still finish. All sensitive actions have a confirmation dialog.

Blank username/password fields preserve the saved encrypted values. The UI never retrieves the previous username/password. Credentials are cleared from form state after a successful save. No secrets are placed in localStorage.

## Encryption and trust boundary

- AES-256-GCM, new random 12-byte IV for every encryption, 16-byte authentication tag, version 1.
- Username and password are independently encrypted; authenticated associated data binds each ciphertext to the field and version to prevent swapping.
- MongoDB stores only ciphertext, IV, authentication tag and version for credentials. The key remains server-side.
- Sensitive services and models import `server-only`. Credentials are decrypted only while creating a non-pooled Nodemailer transporter, which is closed after use. SMTP debug/logger output is disabled. TLS certificate validation is mandatory.
- SMTP hosts resolve to checked public IPv4 addresses. Connections pin that IP and retain the configured hostname for TLS verification. Private/local/metadata addresses and unsupported ports are rejected. IPv6-only SMTP providers are intentionally unsupported.
- GET settings uses an explicit response allowlist. No password, username, ciphertext, IV, authentication tag or encryption key is returned; only `passwordConfigured` and `usernameConfigured` flags. User-entered secrets necessarily exist temporarily in the form and outbound HTTPS save request; saved secrets never come back to the browser.
- Current account role and active status are read from MongoDB for each API request. Browser-supplied roles are ignored. Mutations require same-origin requests. MongoDB-backed rate limits work across instances.
- The fixed primary configuration ID is a singleton. A lease serializes configuration operations; revision checks reject stale form saves. Expired leases allow recovery after an interrupted request.

Reference APIs: [Node.js authenticated encryption](https://nodejs.org/api/crypto.html), [Nodemailer SMTP transport](https://nodemailer.com/smtp).

## Delivery, retries and health

- A durable pending delivery is inserted before registering `next/server` `after()` work. The business response does not wait for SMTP. Failure of SMTP/log storage is isolated from saved business actions.
- Unique event keys prevent duplicate enqueues. An atomic sending claim prevents parallel retries/workers from sending the same log twice.
- Per-recipient SMTP acceptance is persisted. Retries send only to recipients not already accepted, enforce backoff and stop after three total attempts. Recipient changes block historical retry; event-disable/active-service gates are checked again before delivery.
- Timeouts and ambiguous provider outcomes become `uncertain`, never automatically retryable. In-flight records abandoned for ten minutes become uncertain when health is read. Check the provider before taking further action.
- `Process Pending Emails` recovers up to five durable records that were never claimed. It is super-admin-only. There is no unattended cron deployment in this change. Hosts must allow response-lifecycle work enough execution time; a controlled worker can invoke pending processing where needed.
- Delivery logs contain subject, event, entity, recipients, accepted-recipient count, message IDs, attempt count, status, safe error category and timestamps. Bodies are excluded from log APIs. Message IDs are deterministic identifiers passed to Nodemailer, not proof of final inbox delivery.
- Health reads stored state/counters, not SMTP. Sent-today uses UTC. Verification only occurs through an explicit authorized action. Authentication failures move the service to ERROR and invalidate verification.
- Notification-center notices include severity, read/unread state and an Email Configuration link. Inactive config, verification/test failures, activation/disable, delivery failure, threshold exceedance and retry attention generate notices. Repeated notices are grouped within an hour.
- Activity records include actor ID/role, safe action names, field names, results and safe error categories. No secret values or SMTP error strings are stored.

## Business-event integration

Connected producers: new leads (all existing inquiry routes route through the lead service), lead status changes, lead assignment activity, user creation, user-role changes, user activation/deactivation, password-reset activity, email settings changes, failed-password/unknown-account/locked-account login alerts (globally grouped over 15 minutes to limit alert flooding), newsletter requests, and quotation-created activity where emitted.

All requested event categories are stored and have UI toggles. The repository currently has no implemented order/payment/work-order/complaint/automation business mutation modules. Their future successful mutation handlers must call `notifyEmail({ eventKey, eventType, entityId, subject, text, html? })` with a durable event ID. No fake events or new business records are created. Site-visit/installation events also need a real producer; changing a lead's status currently emits the existing lead-status event. Dashboard reads, analytics refresh, searches, filtering and other harmless UI activity never trigger email.

The legacy test-email endpoint uses the same super-admin gates. All previous direct environment SMTP/Resend fallback send paths now use this configured service so disabled notifications cannot be bypassed. Existing new-lead templates, dashboard notifications and WhatsApp behavior are retained.

## Verification commands

- `npm run lint`
- `npx tsc --noEmit`
- `node tests/email-config.test.cjs` (mocked MongoDB, DNS and Nodemailer; never sends external mail)
- `node tests/account-activity.test.cjs`
- `npm run build`
- Start the production server, set `TEST_BASE_URL`, then `npx playwright test tests/site-ui.spec.cjs --workers=1 --reporter=list`.

`tests/email-ui.spec.cjs` bundles the actual form with a test-only Link adapter and mocked APIs, checks Save Configuration, secret-input clearing, activation gating, admin read-only access and mobile width. It does not simulate a real authenticated server session.

The browser suite uses locally installed Chrome; change the test executable path on non-Windows hosts.

## Manual acceptance checklist - pending secure credentials

- [ ] Log in through the real super-admin account (not a mocked session).
- [ ] Configure the master key in the server environment and the new Zoho app password through the settings form.
- [ ] Save and confirm the database has encrypted credential components only.
- [ ] Verify the SMTP connection.
- [ ] Send one authorized test email to both configured recipients and confirm actual inbox receipt.
- [ ] Activate notifications.
- [ ] Create a test lead and confirm its new-lead email.
- [ ] Change its status and confirm the activity email.
- [ ] Review delivery logs and site notifications.
- [ ] Inspect authenticated response bodies and server logs for absence of secrets.

Do not call the live email service production-verified until these checks succeed. No real password, live SMTP test, real admin login, or business-data mutation was performed by the automated suite.

## Website fixes

The home hero again displays full-width background images, with a directional overlay for text contrast. Hindi/English switching is local and works on localhost, with persisted preference and no Google Translate redirect. The curated dictionary covers navigation, home-hero copy, service labels, common controls and the FAQ content. Unmapped long-form marketing/blog copy remains English; this is not unrestricted machine translation of arbitrary new content. User-entered fields and the admin console are not translated.

## Dependency security

Next.js is updated to 16.3.5 and Nodemailer to 10.0.10 to resolve advisories present in the previous versions. A scoped npm override applies the current Nodemailer version to NextAuth's optional peer; this application uses the Credentials provider, not NextAuth email sign-in. Existing account regression tests remain required. Playwright/esbuild are test-only dependencies; `server-only` enforces the server/client boundary. `npm audit fix` applied the remaining compatible transitive update. The resulting audit reported zero vulnerabilities.

The pre-existing next-sitemap environment interpolation warning is independent of SMTP configuration; it does not print secret values and sitemap generation still completes. Live deployment configuration should be reviewed separately by the operator.
