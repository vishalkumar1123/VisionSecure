# Full address and follow-up email handoff

## Address correction

Contact and home enquiry forms now collect Full Address instead of locality/PIN and budget. Full address is required on those two complete forms (10–600 trimmed characters). Popup and assistant forms offer an optional address; the API keeps empty-address compatibility for existing callers. The legacy inquiry adapter forwards address too. Email remains optional, and existing service selection, duplicate protection, tracking privacy and lead-save notification isolation remain in place.

The address is stored on Lead, displayed in the leads grid and lead details, editable through a dedicated Save address form, projected into dashboard call lists, and passed to the new-lead email template. Historical locality/budget fields and records are retained; their values are not presented as a fabricated full address.

The reported save issue was reproduced without a database: Mongoose reused a cached model compiled before address existed, so strict-schema writes silently dropped it. The model now adds missing new paths to the cached schema and recompiles document accessors. PATCH uses document.set; the browser checks the returned saved address and shows inline success/error feedback. Leads list/detail reads explicitly use private no-store behavior. A test saves and freshly reads back the address while preserving old locality/budget, status and appointment values. No live customer record was inspected or rewritten. If a previously typed address never reached storage, enter and save it again; an unknown address cannot be recovered or invented.

## Simple email behavior

A protected background worker produces one morning plan per India business date after 8 AM IST for configured admin recipients, and one due reminder per lead and saved appointment timestamp. Due reminders include the customer, phone, full address, requirement, assigned person, saved time and latest note. Configured admins receive them, together with the lead's active assigned technician when that account has a valid email. Technicians do not receive the admin's full daily plan or other technicians' leads. Lead details include an active-technician selector; the API validates the target role/account before saving it.

Unassigned leads still notify configured admins. The existing verified SMTP configuration and delivery logs are reused; no new mail provider is introduced. The Follow-up morning summary / due-time reminder checkbox controls these events. Existing settings preserve their prior values, with the new event enabled by default. Existing inactive/unverified SMTP settings are never activated automatically.

Outbox event keys prevent repeat polling from generating duplicate deliveries. Appointment time/status and current recipients are rechecked before sending; changed, closed or deleted appointments skip stale mail. A changed appointment timestamp creates a new event. A private per-appointment marker avoids repeatedly selecting already-produced due work and does not change the lead's business updatedAt. Five due events are processed per invocation; the morning plan includes the first 50 appointments with an explicit count and dashboard link. Existing outbox recovery, manual eligible retries, accepted-recipient tracking and uncertain-delivery safeguards remain in effect.

## Activation after review/deployment

Automatic mail is NOT active merely because this code exists. No live scheduler, SMTP settings or production deployment was changed, and no real test email was sent.

1. Deploy the reviewed branch through the owner's normal release process; do not merge main automatically.
2. In Email Settings, use the existing save/verify/test/activate flow and confirm admin recipients plus the follow-up event checkbox. In Users, ensure technician accounts are active with correct email, then assign the technician on each lead.
3. Set the existing CRON_SECRET environment variable securely in hosting (at least 24 characters). Do not put its value in chat, Git or a public URL.
4. Configure the owner's external scheduler to make GET requests every minute to `https://visionsecuretech.in/api/internal/follow-up/process`, with header `Authorization: Bearer <CRON_SECRET>`. Disable caching and monitor HTTP failures plus the returned errors count. The worker computes IST internally, so the scheduler's timezone does not change appointment interpretation.
5. Inspect Email Settings delivery logs to confirm actual provider acceptance. Queue creation or a successful scheduler response alone is not a delivery guarantee. Failed/uncertain deliveries must be reviewed using existing logs/retry controls.

If a scheduler is not actually configured, automatic emails cannot arrive. Browser/dashboard timers are deliberately not used as a replacement. On Vercel Hobby, the built-in cron is limited to daily invocation with hourly precision; frequent due-time reminders require the external scheduler the owner selected (or compatible hosting). Official reference: https://vercel.com/docs/cron-jobs/usage-and-pricing . No frequent Vercel cron expression was added that would fail a Hobby deployment.

## Validation and review

Tests use isolated source, dummy auth/database configuration, in-memory Mongoose and mocked SMTP/authenticated browser fixtures. Verification source uses synthetic credentials; .env.local is not copied. Existing unrelated SEO/report, preview/cache and next-env edits are excluded from the commit. Final validation results and screenshot paths follow after checks finish.

## Final checks

- Fresh isolated production build passed: 83 pages generated, including the protected reminder worker route. TypeScript and full lint passed. The only build warning is the isolated checkout's multiple-lockfile root inference.
- 54 browser tests passed for admin shared pages, lead address editing, dashboard operations and public enquiry flows. After final technician assignment and contact layout changes, all 16 affected grid/detail/contact tests passed again. Coverage includes mobile/tablet/desktop, both themes, a successful save/read display, technician selection and rejection of a misleading 200 response that fails to persist the address.
- Cached Mongoose model regression test passed, including trim, fresh GET readback, invalid-address rejection, authorization, active-technician validation and preservation of legacy data/status/time.
- Follow-up worker tests passed for IST morning/due timing, duplicate events, rescheduling, closed/old/undated exclusions, inactive mail, escaped address/notes, safe failures and scheduler authorization.
- Existing email configuration/outbox tests passed: 30 groups, including stale reminder suppression and configured-admin/active-assigned-technician routing. Existing lead validation/tracking tests passed, preserving all 28 intended sitemap URLs and 13 service handoffs. Account authorization, dashboard and IST scheduling regressions passed.
- Screenshots visually inspected: screenshots/lead-address-desktop-dark.png and screenshots/lead-address-mobile-light.png. These contain mocked fixture data only.

Branch: feat/admin-glass-dashboard. No merge, production deployment, external scheduler activation or real mail delivery was performed. Existing GitHub PR permission limitation remains; review through the branch compare link. Portable continuation patch: visionsecure-lead-address-reminders.patch, applying on parent f7a77c2. Roll back this implementation commit to undo the UI/worker changes; stored addresses and old lead fields need not be deleted.
