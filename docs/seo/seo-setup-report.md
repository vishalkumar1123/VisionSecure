# VisionSecure SEO and enquiry implementation handoff

Status: local implementation, not deployed. Verification date: 19 October 2026 (Asia/Kolkata). Production observations are exclusively in `live-url-checks.csv`; they do not describe the changed local build.

## Baseline and scope

Started on `main` at `a1dcc9568f55105ba1ccd0b1af529d3be7780509`. Work is isolated on `feat/lucknow-seo-enquiries`.

Pre-existing modified files were `.env.example`, `INTEGRATION_SETUP_CENTER.md`, `components/admin/website-analytics/google-connect-card.tsx`, `docs/security-scan.json`, `lib/google/integration-api.ts`, `lib/google/oauth.ts`, `tests/google-services.test.cjs`, `tests/website-analytics-ui.spec.cjs`, and `tsconfig.tsbuildinfo`. These changes were preserved and excluded from the SEO commit. `.env.local` was not read or edited. No applicable AGENTS.md or VisionSecure-SEO-Changes.patch was found in the workspace or inspected ancestor locations.

Stack: Next.js 16.3.5 App Router, React 19, TypeScript, npm/package-lock, MongoDB/Mongoose and existing NextAuth/admin authorization. Scripts are `npm run dev`, `npm run lint`, `npm run build`, `npm run start`. Removed the competing next-sitemap postbuild generator; the dependency remains installed to avoid unrelated lockfile churn.

README says merging main automatically deploys through the existing v0-linked workflow. No configured remote preview was established; validation used the production build at localhost:3013. No main merge, production deployment, DNS change, account configuration or real test lead was performed. Dashboard, authentication, integrations, lead statuses and notifications remain in the existing application.

## Resulting inventory

28 intended public pages: 1 home, 7 other public landing pages, 13 service details, 7 real blog articles. `/projects` is included. `public-urls.txt` and `public-url-inventory.csv` contain all 28. No invented dynamic IDs are listed. `non-indexable-routes.csv` separately lists account/admin/API routes, compatibility endpoints, metadata utilities, known catalogue patterns and the host redirect.

Production canonical origin: `https://visionsecuretech.in`.

* Sitemap: `https://visionsecuretech.in/sitemap.xml` from `app/sitemap.ts`.
* Robots: `https://visionsecuretech.in/robots.txt` from `app/robots.ts`.
* Unknown modification dates are omitted. The sitemap contains exactly the 28 public canonical pages.
* Account/admin pages receive `X-Robots-Tag: noindex, nofollow`; API and compatibility endpoints also receive that header. Authentication and authorization remain independent of indexing controls.

## Before and after

Production checks returned HTTP 200 for all 28 discovered pages. HTTP requests redirect to HTTPS, but the www host still serves its own HTTPS pages. Production service canonicals point to non-www. Production landing pages and blog articles had no observed canonical, and blog articles inherited generic site metadata. See the live CSV for exact titles, headings, destinations, redirect chains and timestamps. HTTP status is not proof of Google indexing or ranking.

Local changes implement page-specific canonical, title, description and Open Graph metadata for every public page, including all seven articles. Headings remain stable as carousels change. Recommended service intents are distinct: LAN points/cabling/switching, WiFi coverage/mesh, server/rack infrastructure, and CCTV/IT maintenance scope. These intents are recommendations, not measured keyword-volume research.

Home, CCTV, biometric, LAN, WiFi, server and AMC content now addresses site requirements, selection, compatibility and handover. All service pages retain their real catalogue applications, solutions and FAQs and add quotation inclusions, exclusions, cost factors and conditional warranty/AMC terms without invented prices or guarantees. Articles retain informational intent and gain natural service/contact links. Existing English/Hindi switching is preserved; changed stable headings, form labels and confirmed hours have dictionary entries. Existing untranslated content continues using the established English fallback.

A host-specific permanent 308 redirect sends only `www.visionsecuretech.in` to the same HTTPS non-www path. Local verification confirms query preservation, no loop and no production redirect for localhost or an unrelated preview host. HTTP-to-HTTPS enforcement remains the hosting platform's responsibility; production currently redirects HTTP successfully. After deployment, verify apex as primary, www as redirect and certificates for both in the existing hosting domain settings. Do not create a new project or change DNS unnecessarily.

Removed static robots/sitemap files and the postbuild generator to leave one source for each. Added account/API indexing headers. Organization/WebSite JSON-LD now uses the actual existing Vision.png asset and escapes `<` during serialization. Removed a SearchAction whose search behavior was not established. No ratings, reviews, coordinates, opening-hours schema or fabricated partnerships were added.

All 28 rendered pages had the expected metadata/H1, valid JSON-LD JSON, no unresolved public internal href paths and no missing referenced rendered image files. Public pages are reachable through existing navigation/catalogue/contextual links; the service and blog catalogues expose all discovered detail pages. A case mismatch in the Hikvision brand logo reference was corrected to match `Hikvision_logo.png` for Linux hosting. These checks verify paths and markup, not the provenance of project images or testimonials.

## Enquiry behavior

Contact resolves real service titles, slugs and legacy aliases from the URL on the server. All 13 services are selectable; additional existing offerings remain available. Home uses the same service catalogue. Contact captures optional locality/PIN (max 160), persists it on Lead, and displays it in the authenticated lead detail workflow. Older callers can omit locality and email. Name, mobile and relevant text limits agree with backend validation; Indian mobile numbers use the existing 10-digit rule beginning 6–9.

Home email is now optional and a successful save no longer depends on opening WhatsApp. The popup previously only opened WhatsApp; it now saves via the existing `/api/leads`, communicates success and preserves input on failure. Contact, Home and popup disable repeat submission while pending. Duplicate checks (same phone/service within 24 hours), rate limits, New status and existing notification dispatch remain. Logging and notification failures after persistence do not turn a saved enquiry into a failed response. The existing duplicate check is query-based, not an atomic concurrent-request guarantee; it was not redesigned.

Main Contact labels/selects and popup accessible names are improved. Server validation remains authoritative. Home/popup still use existing browser alerts for submission feedback. Legacy `/inquiry` and `/api/inquiry` adapters retain compatibility. Neither endpoint is a public landing page.

## Analytics and privacy coverage

Locations: `components/google-analytics.tsx`, `components/clarity.tsx`, root Vercel Analytics in `app/layout.tsx`, new `lib/public-tracking.ts` and `components/public-click-tracking.tsx`. Existing Google account reporting/OAuth code remains in `lib/google/*` and `components/admin/website-analytics/*`. No existing public consent control was found; this change does not claim to implement one. Account-side collection/consent settings require owner review.

| Flow | Event | Condition |
| --- | --- | --- |
| Home callback | enquiry_saved, form=home | API OK and success=true |
| Contact | enquiry_saved, form=contact | API OK and success=true |
| Lead popup | enquiry_saved, form=popup | API OK and success=true |
| Public tel links | call_click, form=public_link | Click only; not a saved enquiry |
| Public wa.me/api.whatsapp.com anchors | whatsapp_click, form=public_link | Click only; not proof a message was sent |
| Legacy API-only clients, AI-generated leads | Intentionally uncovered | No added client success event |
| Newsletter, admin/account actions | Intentionally uncovered | Not public lead conversions |

One global anchor listener handles click events; form handlers only emit saved-enquiry events. No names, contact details, messages, locality, service query text or lead IDs are included. Page location excludes query/hash and referrer is blank in new event payloads/config. Analytics exceptions cannot block forms/navigation. Public lead events skip admin/profile/register. GA and Clarity initialization also skip these routes. Existing provider-level history/enhanced measurement, replay masking and consent settings cannot be verified from repository code; disable automatic form/outbound collection that could duplicate these events or capture personal URLs, and validate masking before relying on collection. No successful Google ingestion or key-event configuration is claimed.

Environment names relevant to operation: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`, `MONGODB_URI`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`, `EMAIL_CONFIG_ENCRYPTION_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAILS`, `LEAD_NOTIFICATION_EMAILS`. Existing account reporting additionally uses `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_TOKEN_ENCRYPTION_KEY`, `GA4_PROPERTY_ID`, `GA4_STREAM_ID`, `GOOGLE_SEARCH_CONSOLE_SITE_URL`, `GOOGLE_PAGESPEED_API_KEY`. No new environment variable is required by this change. Secret values must stay in existing secure configuration, never in this report or chat.

## Business facts

Owner confirmed in this session: Monday–Saturday 9 AM–8:30 PM; Sunday 10 AM–4 PM. Contact now matches Home. Business phone/address are preserved from existing public content. Do not interpret preservation as independent verification.

Owner review still needed: actual project/testimonial provenance, experience/certification/partnership claims, free-site-visit and same-day-support claims, written warranty/AMC terms, actual supported service areas, and the differing YouTube URLs in Contact and organization schema. No new proof or guarantees were invented, and ambiguous existing claims were not expanded. No opening-hours schema was added.

## Validation and limits

* `npm run lint`: passed (exit 0).
* `npx tsc --noEmit --incremental false`: passed; production build also runs TypeScript.
* `npm run build`: passed; final build including confirmed hours, asset casing and indexing headers passed.
* `node tests/seo-enquiries.test.cjs`: passed mocked persistence, optional/omitted email/locality, invalid inputs, 409/429 behavior, provider failure isolation, auth, privacy and all service handoffs/sitemap coverage.
* `npx playwright test tests/seo-enquiries-ui.spec.cjs --workers=1 --reporter=line`: 4 passed (mocked API, third-party requests blocked). Browser tests use localhost, mock `/api/leads`, block third-party requests and do not contact database/email providers.
* `python docs/seo/check-local-render.py`: 28 rendered pages and 28 sitemap URLs, no metadata/H1 mismatches, no unresolved public paths, no missing rendered image paths; JSON-LD parses. Also verifies 308 host redirect/query preservation, unrelated-host behavior and account noindex header.
* `python docs/seo/crawl-public.py`: bounded read-only production requests (three workers); 28 public pages plus three domain variants. All responded. No admin/API/private pages crawled.

Node execution initially encountered sandbox EPERM resolving the workspace; authorized local checks ran outside that filesystem restriction. Implementation/test issues discovered during checks were corrected; final results supersede intermediate failures. Database/provider behavior is mocked, and real delivery is not established. Google-selected canonicals, indexing, rankings, account ownership, remote preview and GA ingestion are not verified. Browser coverage is sampled desktop/mobile; it is not a claim of exhaustive device compatibility.

## Exact account-side next steps

1. Open the owner's existing Search Console account and select an existing verified property covering this origin. If none exists, add the Domain property `visionsecuretech.in`, copy Google's TXT record into the existing DNS provider, and click Verify after propagation. Alternatively use a URL-prefix property for `https://visionsecuretech.in/` with an offered supported verification method. Keep the verification record/file. Do not create duplicate properties unnecessarily or share passwords/OTPs.
2. After approved deployment, open Sitemaps and submit `https://visionsecuretech.in/sitemap.xml` (or `sitemap.xml` where the property UI supplies the prefix). Confirm successful fetch and 28 intended URLs. Resolve errors rather than resubmitting alternate hosts.
3. Use URL Inspection for the five priority URLs below. Review indexed information and Test Live URL; request indexing only when the deployed page is ready. Inspect user-declared versus Google-selected canonical. A live test cannot prove that Google has indexed the changed page. [Google URL Inspection guidance](https://support.google.com/webmasters/answer/9012289?hl=en).
4. In the existing GA4 property, confirm owner/admin access and that its web-stream measurement ID matches the configured website ID. Audit enhanced measurement (especially history pageviews, form interactions and outbound clicks), consent settings and Clarity masking. Use a dedicated approved test environment/stream and browser debugging to verify enquiry_saved once on saved success, none for errors/duplicates, and separate call_click/whatsapp_click. Do not send production test leads. See [GA4 DebugView](https://support.google.com/analytics/answer/7201382?hl=en-40).
5. Once received and verified, mark enquiry_saved as a key event in the existing GA4 property's Events/Key events controls. Keep Call and WhatsApp as separate intent measures; they do not establish saved or qualified leads. Check for duplicate tag implementations. [Google key-event instructions](https://support.google.com/analytics/answer/13128484?hl=en).
6. Find the existing Google Business Profile through the owner's account or the published Maps listing. Request access to the existing listing if necessary, then complete only the verification method Google offers. Confirm the real business name, suitable available primary category reflecting actual security installation, supported services, address/service-area eligibility, confirmed hours, phone, canonical website and genuine business/project photos. Avoid duplicate listings or unsubstantiated categories/coverage. [Google verification guidance](https://support.google.com/business/answer/7107242?external_link=true).
7. After completed real work, ask customers neutrally for an honest review using the existing profile's review link. Do not fabricate, incentivize or selectively gate reviews. Do not send requests automatically as part of this implementation.
8. Weekly, compare saved Website enquiries with the CRM: service, locality coverage, contactability, duplicates/spam, quotation requests, booked installations and lost reasons. Have staff mark actual qualification after review. Track qualified/saved and installed/qualified rates with the same date window; do not classify automatically from a form submission.

Minimum owner input/access: existing verified property/profile selection, existing GA4 stream ownership, authorized hosting reviewer, and evidence for the unresolved business claims. The owner can perform these actions directly; no password, OTP or secret is needed in chat.

## Deployment, review and rollback

Review the isolated SEO commit/patch together with the preserved integration work. The README says main merges deploy automatically, so approval must precede merging. Run lint, focused tests, build and the mocked browser suite in the existing preview environment if available. Ensure the deployment includes the canonical hostname redirect and that old static robots/sitemap files are removed. After approved deployment rerun the bounded live crawler, verify domain variants and Google account steps above. No production deployment has been performed here.

Rollback by reverting only the SEO implementation commit in a new branch and reviewing that revert. Do not reset main or discard the owner's other work. Locality is additive; retaining previously saved locality data is safe if UI changes are reverted. Do not delete leads or database fields as a rollback step.

Five highest-priority pages for the next account setup stage:

1. `https://visionsecuretech.in/`
2. `https://visionsecuretech.in/services/cctv-surveillance`
3. `https://visionsecuretech.in/services/biometric-attendance`
4. `https://visionsecuretech.in/services/networking-solutions`
5. `https://visionsecuretech.in/contact`

AMC (`/services/it-support-amc`) is also P1 for content/enquiry follow-up. The complete priority map covers every public page.

Final delivery: isolated local commit and `docs/seo/visionsecure-seo.patch`. Remote PR availability is checked separately; production remains unchanged.

Remote review result: feature branch pushed successfully. GitHub connector draft-PR creation returned HTTP 403, `Resource not accessible by integration`; no PR was created. Open https://github.com/vishalkumar1123/VisionSecure/compare/main...feat/lucknow-seo-enquiries?expand=1 and use `pull-request-description.md` to create a draft through an account with PR permission. This is an integration permission limit, not an automatic approval-review rejection. The patch includes all SEO commits since the baseline and excludes the nine pre-existing modified files.
