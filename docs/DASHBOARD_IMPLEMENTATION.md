# Live Admin Dashboard implementation

## Preserved architecture

The existing Next.js 16 App Router application, NextAuth Credentials sessions, admin/super-admin authorization, MongoDB connection, lead creation/update/delete workflows, notification bell, activity logs and encrypted SMTP configuration remain in place. Dashboard access remains admin-only; no new sales/technician access was granted. The existing next-themes provider, `visionsecure-theme` storage key, toggle and charcoal dark tokens are unchanged. Recharts, Lucide and Framer Motion are reused; no new dependency was installed.

## Files changed in this dashboard task

- `app/admin/dashboard/page.tsx`: server page wrapping the interactive dashboard.
- `app/admin/layout.tsx`: responsive shell, drawer, authenticated identity, functional lead search and Ctrl/Cmd+K.
- `components/admin-sidebar.tsx`: 240px desktop container, accessible active navigation, mobile close callback and brand-green selected state.
- `components/admin/dashboard/overview.tsx`: daily control dashboard, six KPI cards, action center, schedule, refresh, partial errors and management links.
- `components/admin/dashboard/live-header.tsx`: isolated local greeting/clock and relative activity times.
- `components/admin/dashboard/status-badge.tsx`: reusable semantic status badge using theme tokens.
- `components/admin/dashboard/recent-leads.tsx`: five actual recent leads, desktop table, mobile cards, source, assignment, follow-up date, call and WhatsApp links.
- `components/admin/dashboard/charts.tsx`: responsive trend, accessible chart data and service donut/ranking with Other grouping.
- `components/admin/dashboard/types.ts`: dashboard response types.
- `app/api/admin/dashboard/route.ts`: new protected summary endpoint with allowlisted projections and independent failure handling.
- `lib/dashboard-time.ts`: centralized India business-day boundaries, greeting and relative-time helpers.
- `app/api/leads/route.ts`: additive due/overdue/today/won/active/status filters and escaped literal search; POST unchanged.
- `app/admin/leads/page.tsx`: URL filters and visible filtered-list/error states.
- `app/api/analytics/route.ts`: removed redundant team/activity queries introduced by the earlier dashboard iteration; existing lead analytics calculations remain intact. The dedicated dashboard endpoint now owns team/activity summaries.
- `tests/dashboard.test.cjs`: mocked API/auth/filter/date/calculation tests, no external writes.
- `tests/dashboard-ui.spec.cjs`: real components/shell with mocked APIs, eight widths in both themes, drawer, notifications, clock and empty/error cases.
- `tests/fixtures/dashboard-image.tsx`, `tests/fixtures/dashboard-navigation.ts`, `tests/fixtures/dashboard-session.ts`: browser-test framework adapters only; not imported by production.
- `docs/DASHBOARD_IMPLEMENTATION.md`, `docs/IMPLEMENTATION_REPORT.md`: implementation and verification notes.

Build-generated `next-env.d.ts` and `public/sitemap.xml` may also change. Environment variables and secrets were not changed by this dashboard work.

## Components and interaction

LiveHeader initializes the date after hydration, updates once per second and uses Intl formatting with browser local time. Greeting switches at 05:00, 12:00, 17:00 and 21:00, and uses the authenticated server response name. Relative activity labels refresh every minute. The clock is explicitly labelled Live clock; it does not imply business data refreshes every second.

Dashboard data refreshes every 60 seconds while visible, on return to the tab and on manual Refresh. Previous data remains visible during refresh, with an explicit stale-data warning if refresh fails. Obsolete fetches are aborted. Individual data-section failures preserve healthy sections and provide Retry.

The mobile/tablet sidebar uses the existing Radix Sheet primitive, including Escape, overlay dismissal, focus trapping and restored trigger focus. Desktop navigation remains persistent. Search is scoped to leads by name, phone, email and service, submitting once on Enter/button; no per-keystroke network requests or fake global entity search. Theme changes use the existing provider and persistence key.

## Queries and calculations

`GET /api/admin/dashboard?days=7|30|90` uses server-side requireAdmin, rejects unsupported ranges, returns no-store responses, and executes independent summary queries concurrently. A lead facet combines stage/service/today/due counts. Projection-only recent lead/schedule queries populate assigned names. User roles are aggregated; activity projects only actor name/action/entity/status/time, never changes, IPs, raw errors or secrets. There are no business mutations or SMTP calls.

- Business timezone: Asia/Kolkata. Local clock and greeting follow browser timezone separately.
- Today uses India midnight inclusive to next midnight exclusive. Overdue uses earlier-than-today follow-up dates on non-terminal leads, excluding null dates.
- Today's schedule uses the same follow-up query and is chronological, capped at 20 with a link to all matching leads.
- Active/overdue/due exclude Converted, Closed, Installed Successfully and Cancelled.
- Conversion retains the existing definition: (Converted + Installed Successfully) / total leads * 100, with zero denominator handled.
- Action Center distinct count uses an OR across due/overdue dates, New and Quotation Sent; overlapping categories are explicitly labelled.
- New does not falsely imply verified lack of contact; Quotation Sent does not falsely imply an approval state.
- Pipeline retains every stored status; links filter the existing lead manager.
- Trend fills missing dates with zero and compares the chosen calendar window with the preceding equally long window. The current period includes today's partial day. A zero historical baseline displays No previous data, never a fabricated 100% growth.
- Service share uses all leads; top five categories plus Other sum to the actual total.
- Latest five leads sort newest first; priority work is available through actionable due/overdue filters.
- Team active/inactive counts use the stored isActive field.

## Schema limitations

Lead stores followUpDate, but no site-visit/installation timestamp or completion state. Therefore the schedule shows only follow-ups. Installation KPI is explicitly all leads currently in Installation Scheduled, not installations today. There is no reliable confirmed revenue model; no revenue metric is fabricated. No standalone customer/site-visit/quotation creation workflows were found, so those quick actions are omitted. Add New Lead opens the existing `/contact#contact-section` enquiry form and its existing `/api/leads` submission workflow. Schedule follow-up opens active leads, whose detail pages already support scheduling. No duplicate disconnected form was created.

## Verification scope

API tests mock database and authentication boundaries; browser tests render real dashboard, layout, theme provider, charts, sidebar and notification components with test-only authenticated session/API fixtures. Fixtures never enter production code. Test matrix: 320, 375, 430, 768, 1024, 1280, 1440 and 1920 pixels, light and dark. Checks include no document overflow, mobile drawer Escape, actual theme storage, notification dropdown, recent five records, partial errors, empty states, search shortcut, local noon transition and midnight date rollover. Screenshots are written to ignored `test-results/` and inspected.

A logged-in live production database acceptance session has not been performed by the agent; no customer/test lead was created and no email was sent during these tests. Final command results are recorded in IMPLEMENTATION_REPORT.md. The pre-existing next-sitemap environment interpolation warning may appear even when build and sitemap generation exit successfully.
