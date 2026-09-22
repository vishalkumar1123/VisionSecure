# Google Website Services — implementation and activation

The existing VisionSecure admin now has a separate Website & Marketing area. The implementation is local and has not been deployed. Live GA4 and Search Console acceptance remains pending Google Cloud configuration and administrator consent; no analytics data has been simulated.

## Architecture preserved

- Next.js 16 App Router, React 19, TypeScript, Tailwind and existing Recharts.
- NextAuth v4 credentials authentication, existing JWT/session security and five-minute admin inactivity policy. Google is an integration, not a replacement login provider.
- `requireAdmin()` checks the current active MongoDB user and permits `admin` / `super_admin`; both can manage this integration. Other roles remain denied under existing RBAC.
- Existing `RequireAdmin`, sidebar, admin shell, next-themes provider and semantic CSS colors. No additional theme provider or chart library.
- Existing CRM `/admin/analytics`, leads, email, notifications, users and authentication code are retained. Lead schema is unchanged.

## Dashboard setup added September 2026

The Analytics page now includes **Sign in with Google**. If no OAuth app is configured, open Settings → Integrations. A Super Admin can save the real Google Web application Client ID and Client Secret in **One-time Google app setup**, then administrators can sign in from the same screen. The app secret is encrypted in MongoDB and never returned by the status API. Environment-provided credentials take precedence; disconnect an existing integration before replacing saved app credentials.

A dedicated 32-byte hexadecimal `GOOGLE_TOKEN_ENCRYPTION_KEY` is required. Auth-secret fallback is disabled. Before migrating old fallback-encrypted credentials, disconnect Google while the old deployment can still decrypt them; deploy the dedicated key, re-enter app credentials, and reconnect. Do not replace an existing dedicated key without a re-encryption plan. The email encryption key is not reused.

Real Google Cloud registration, enabled APIs, matching callback URI and account consent are still required. A website cannot bypass those by displaying a sign-in button. No Google password belongs in this form. Existing admin sign-in remains unchanged.

## Activate locally and on Vercel

1. In Google Cloud, enable **Google Analytics Data API**, **Google Search Console API**, and **PageSpeed Insights API**.
2. Configure the OAuth consent screen for VisionSecure. Configure audience, support/developer contacts, authorized domain `visionsecuretech.in`, and the four scopes listed below. Add the connecting account as a test user while in Testing. External apps may require Google verification before public production use. Testing-mode refresh authorizations can expire after seven days for these scopes; publish appropriately for persistent production use.
3. Create an OAuth client with application type **Web application**. Add these exact authorized redirect URIs:

   ```text
   http://localhost:3000/api/admin/integrations/google/callback
   https://visionsecuretech.in/api/admin/integrations/google/callback
   ```

   The optional local host alias `http://127.0.0.1:3000/api/admin/integrations/google/callback` is supported in development only if separately registered. Preview/arbitrary domains are deliberately not trusted callbacks.

4. Either save Client ID/Secret using the Super Admin form above, or set these server-side variables in `.env.local` and Vercel Production as appropriate:

   ```dotenv
   GOOGLE_CLIENT_ID=<web-client-id>
   GOOGLE_CLIENT_SECRET=<web-client-secret>
   GOOGLE_TOKEN_ENCRYPTION_KEY=<64 hexadecimal characters representing 32 random bytes>
   GA4_PROPERTY_ID=544810814
   GOOGLE_SEARCH_CONSOLE_SITE_URL=https://visionsecuretech.in/
   NEXT_PUBLIC_SITE_URL=https://visionsecuretech.in
   GOOGLE_PAGESPEED_API_KEY=<optional API key restricted to PageSpeed Insights API>
   ```

   Generate the encryption key using a cryptographically secure random generator and save it directly in your environment/secret manager. Use a dedicated key, separate from the existing email encryption key. Keep it stable across deployments; changing it without a migration requires reconnecting Google. Do not put keys or tokens in chat, Git, application logs, or `NEXT_PUBLIC_*` variables.

   Retain existing `MONGODB_URI`, `NEXTAUTH_SECRET`, email and other application configuration. `NEXTAUTH_URL` must remain `http://localhost:3000` locally and `https://visionsecuretech.in` in production.

5. Restart locally / redeploy Vercel. Sign in using the existing admin credentials, then open **Settings → Google Integrations → Connect Google**. Complete consent within the existing five-minute admin-session window. Use the account with Viewer access to GA4 property **544810814** and authorized access to the exact Search Console property **https://visionsecuretech.in/**.
6. Click **Test Connection**, visit Website Overview, then check one URL under Indexing and run the Mobile/Desktop PageSpeed tests.

No Google service account is required. The Analytics account ID `400498742` is not used as a Data API property ID. Existing public measurement ID `G-XRYGR89Q5K` is preserved; verify in GA4 that this stream belongs to the intended property.

### OAuth scopes

```text
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/webmasters.readonly
openid
email
```

Identity scopes only display the verified connected account email. No profile, Drive, Gmail, edit or user-management permissions are requested.

PageSpeed uses the documented keyless/API-key interface independently of GA4/Search Console. It does not send an Analytics-only access token to PageSpeed or request unrelated OAuth scopes. Missing PageSpeed credentials do not block the other services. A keyless live probe during implementation returned **HTTP 429 / RESOURCE_EXHAUSTED**; a dedicated API key/quota may be needed. No successful live score is claimed.

## Routes

| UI | Purpose |
| --- | --- |
| `/admin/settings/integrations` | Connect, test, reconnect, confirmed disconnect |
| `/admin/website-analytics` | Website overview and KPIs |
| `/admin/website-analytics/traffic` | Trend, acquisition, devices, geography, landing pages |
| `/admin/website-analytics/search` | Search KPIs, trend, queries and pages |
| `/admin/website-analytics/keywords` | Query filtering and search opportunities |
| `/admin/website-analytics/pages` | Landing/search pages and exact public-page drill-down |
| `/admin/website-analytics/indexing` | On-demand URL inspection and sitemaps |
| `/admin/website-analytics/performance` | Mobile/desktop Lighthouse and available page-level field data |

Integration endpoints: `POST /api/admin/integrations/google/connect`, `GET .../callback`, `GET .../status`, `POST .../test`, `POST .../disconnect`.

Reports: `GET /api/admin/website-analytics/{overview,traffic,search,keywords,pages,indexing,pagespeed}`. POST explicitly refreshes reports or initiates a PageSpeed/URL inspection operation. All API operations require the existing authorized admin session, including OAuth callback; writes require the exact trusted request origin. Connect returns Google's authorization URL to the same-origin client, which performs the redirect.

## Security and persistence

- Official `google-auth-library` Authorization Code flow, PKCE S256, cryptographically random state, hashed state record, HttpOnly SameSite=Lax browser cookie (Secure in production), ten-minute state expiry, initiating admin ID binding and atomic single-use state consumption.
- Callback exchanges codes only on the server, validates ID-token audience/signature before using email, runs independent GA4 and Search Console checks, then redirects to a clean status URL with no credentials. Partial property permissions remain independently visible.
- Refresh tokens and temporary PKCE verifier are encrypted with AES-256-GCM using random IVs and Google-specific authenticated context. Access tokens stay transient inside the server OAuth client. Client code never imports token modules. Google errors are converted to safe categories rather than returning provider responses.
- Existing authenticated API guards are reused. MongoDB-backed counters limit request volume, refreshes, inspections and performance tests across serverless instances.
- Disconnect removes local credentials and pending authorizations, clears private report caches, and attempts Google token revocation. If remote revocation cannot be confirmed, the UI explicitly says so. Public PageSpeed snapshots are retained.

New collections (defined in `models/GoogleIntegration.ts`): `GoogleIntegration` (single encrypted connection), `GoogleOAuthState` (expiring state), `GoogleReportCache` (expiring normalized report data), `GoogleRateLimit` (expiring counters). Existing collections are unchanged. Ensure normal Mongoose index creation is enabled; TTL indexes clean up expired records. Expiry checks for usable state/reports do not rely solely on the TTL cleanup schedule.

Caching: GA4 20 minutes, Search Console reports 45 minutes, sitemaps 60 minutes, URL inspection 24 hours. Compact latest PageSpeed result per URL/device is retained for seven days; GET only reads saved results, POST initiates a test. Five-minute per-URL/device cooldown, 12 global performance tests/hour, 20 inspection requests/hour and 2 explicit analytics refreshes/minute apply. The PageSpeed route requests a 120-second execution allowance; the deployment plan must support this duration.

## Data semantics and limits

- Today, yesterday, 7/28/30/90 days, this/last month and custom dates; inclusive preceding equal-length periods. Dates persist for the current browser session across sections. Maximum range: 366 days. Future/invalid/reversed dates are rejected.
- GA4 totals and daily user/session/view trends; acquisition, aggregate geography, device metrics and landing-page key events. Key events are Google-configured events, not presumed CRM enquiries.
- Weekly/monthly charts sum sessions/views; unique daily users are deliberately not summed into weekly/monthly unique counts.
- Search Console uses finalized data, shows the latest returned date, and never claims real-time reporting. Search Console Pacific dates and GA4 property-timezone dates can differ.
- Search query/page tables return up to 10,000 top rows. Privacy-filtered/omitted queries and truncated long-tail rows must not be treated as all search traffic. KPIs come from separate aggregate requests.
- Query opportunities: at least 100 impressions and CTR below 2%, or positions 8–20. Growing/declining groups require a matching previous-period row. Missing historical rows remain N/A. Lower average position is labeled an improvement.
- GA4 landing-path and exact Search Console URL drill-downs remain separate datasets. The GA4 path comparison excludes query strings; no fabricated join or user-level attribution.
- Unknown/missing values are N/A, while an actual provider-returned zero remains zero. One service's permission/quota error does not hide successful reports from the other.
- Important URLs come from actual static public paths plus `lib/services.ts` and `lib/blogs.ts`. Domain/path allowlists reject arbitrary targets, credentials, query strings, fragments and internal admin/API URLs. Inspection is on demand, not a page-load crawl.
- Lighthouse lab scores/metrics and CrUX page-level field metrics are separate. Missing field data is explicitly unavailable. Reported CLS field percentiles are normalized from the API's scaled value. Lighthouse SEO is not a ranking/indexing score.
- Existing `Lead.source` defaults to `Website`, including records without trustworthy attribution provenance. Website leads, organic leads and conversion metrics therefore remain **N/A**; no historical funnel is invented. Reliable CRM attribution belongs in Phase 2.
- Website health lists evidence/next actions separately; there is no synthetic overall SEO score. Technical crawler, scheduled history, alerts and revenue attribution remain outside Phase 1.

## Public-site performance changes

`next.config.mjs` had globally disabled Next/Image optimization. Local PNG assets include several 2–3 MB files, and hero slides use full-width images. Optimization is now enabled with AVIF/WebP negotiation; existing image assets, quality default, dimensions, design and first-slide priority are preserved. Review hidden-slide prefetching and the 24–40 MB video assets separately before changing content delivery. No Lighthouse improvement is claimed without a successful live measurement.

`next-sitemap.config.js` now excludes admin, API, profile and registration routes. The generated public sitemap is updated.

## Files

Created:

- `models/GoogleIntegration.ts`
- `lib/google/{security,dates,oauth,integration-api,reports,monitoring,analytics-api}.ts`
- `components/admin/website-analytics/{shared,google-connect-card,date-filter,report-table,trend,acquisition-chart,monitoring,dashboard}.tsx`
- `app/admin/settings/integrations/page.tsx`
- `app/admin/website-analytics/{page,layout}.tsx`, `[section]/page.tsx`
- `app/api/admin/integrations/google/{connect,callback,disconnect,test,status}/route.ts`
- `app/api/admin/website-analytics/[section]/route.ts`
- `tests/google-services.test.cjs`, `tests/website-analytics-ui.spec.cjs`
- This setup and implementation report.

Modified: `.env.example`, `package.json`/lockfile (official Google client dependency), `components/admin-sidebar.tsx`, `app/admin/settings/page.tsx`, `next.config.mjs`, `next-sitemap.config.js`, generated sitemap. Next.js also regenerates route type references and TypeScript's incremental cache during verification.

## Verification and remaining acceptance

- Production build: passed (Next.js compilation, TypeScript and page generation). `next-sitemap` completes, but its existing nested environment loader reports a `.env.local` interpolation warning; no secret values are displayed. It also emits the existing ESM config warning.
- Existing account/security, CRM analytics, dashboard and email regression suites passed using mocked services. No production lead/email/notification mutations were performed.
- Standalone `npx tsc --noEmit` and `npm run lint`: passed.
- Google unit/security suite checks authenticated encryption, tampering, invalid/missing key, date boundaries, safe public URL allowlist, missing-vs-zero values, API request contracts, admin guard, CSRF rejection, state replay rejection, PKCE callback exchange, encrypted persistence, partial permissions, sanitized status and revocation/disconnect.
- 21 new browser tests passed with isolated test fixtures: 320/375/430/768/1024/1280/1440/1920 widths in both themes, date/comparison/refresh controls, missing configuration, disconnected state, confirmed disconnect, and manual PageSpeed behavior. Browser fixtures are never used in production. Mobile and desktop screenshots visually reviewed. These tests render components with existing compiled CSS; they do not imply live Google consent or a production authenticated session was exercised.
- Local GA4/Search Console status: **not connected / not live-verified**. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_TOKEN_ENCRYPTION_KEY` are absent locally.
- PageSpeed live keyless check: **429 RESOURCE_EXHAUSTED**, no score returned. Optional API key is absent locally.
- Local production HTTP smoke checks: homepage 200; protected admin page 307 to login; unauthenticated integration/report APIs 401. Next/Image returned 200 `image/webp`: a 640px rendition of `CCTV_Camera.png` was 16,506 bytes versus the 1,262,670-byte original. This is a resized transfer check, not a Lighthouse score or same-resolution quality comparison.
- Live MongoDB token persistence/refresh, local and production Google consent, Google account permissions, URL inspection and live analytics data must be acceptance-tested after configuration. Production deployment has not been performed.

## Phase 2 recommendations

Add provenance-aware enquiry attribution before computing CRM conversion rates; preserve unknown historical attribution. Then implement a bounded domain-only technical SEO crawler, compact historical PageSpeed snapshots, scheduled checks and evidence-backed alerts. Add revenue attribution only after CRM stage and source mappings are reliable.

References: [Google web-server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [OAuth best practices](https://developers.google.com/identity/protocols/oauth2/resources/best-practices), [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1), [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [PageSpeed request/response](https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed), [PageSpeed getting started](https://developers.google.com/speed/docs/insights/v5/get-started).
