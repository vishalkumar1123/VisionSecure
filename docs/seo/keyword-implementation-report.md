# VisionSecure keyword content implementation

Prepared 2026-10-30 (IST). Review branch: `feat/customer-keyword-review`, based on fetched `origin/main` (`f4cb2dc`). The original workspace branch and all prior admin/address/reminder work are preserved. A separate clean worktree prevents those eight prior commits from entering this content review.

## Inspection and authority

No applicable AGENTS.md was found in the repository or inspected ancestors. README, package scripts, Next deployment/security configuration, current route/catalogue files, public page components, analytics, schema and historical SEO reports were inspected. README says merging main triggers deployment; no merge or production deployment was performed.

Public content is authored in repository files: Home in app/page.tsx and imported components; services in lib/services.ts, lib/service-planning.ts and lib/service-buyer-guides.ts rendered by app/services/[slug]/page.tsx; metadata in lib/seo-pages.json and lib/seo.ts; blogs in lib/blogs.ts; Contact in components/contact-page-content.tsx. No runtime content-editor fetch or dashboard override was found on these rendering paths. Admin analytics, email and lead editors do not author these public sections. No dashboard content was published.

Historical organic reports describe proposed changes that are not all present in current source. Their test/deployment labels were not treated as evidence for this implementation. Current titles/descriptions, routes, schemas and actual public HTML were inspected anew.

## Supplied keywords

The structured attachment contains 110 phrases. A second attachment repeats those phrases; the third adds overlapping variants and buyer questions. Across all three there are **210 normalised distinct phrases**, all preserved once in customer-keyword-inputs.json and keyword-implementation-audit.csv. Attachment IDs identify provenance. Search demand is unavailable: no authorised Search Console/Bing exports were supplied. No new demand, volume, difficulty, competition, ranking or sales figures were invented.

Disposition totals: 71 already covered; 31 useful gaps consolidated into current pages; 92 redundant/overlapping phrases; 15 requiring owner confirmation; one unsupported offering. The audit records intent, corrected destination where appropriate, action, source location, verification and confirmation. This is a semantic editorial audit, not an assertion that every exact phrase appears in copy.

Near-me and Roman Hindi variants inform location and buyer intent without awkward exact-match insertion. Cost phrases consolidate into genuine quotation factors, not invented prices. CCTV quotation research is mapped to the CCTV service page, which retains its existing service-preselected Contact link. Video doorbell installation is not established by an image filename and is excluded as an advertised offering. Existing CCTV maintenance and smart lighting scope is supported by the actual catalogue and buyer guides; particular models, contractual terms and integrations remain conditional.

## Before and after

Home already linked services and described installation in Lucknow. Added one visible planning section linking directly to CCTV, LAN, biometric and AMC guidance, explaining the site/equipment details that make an enquiry useful.

Six services already had tailored selection/handover guidance. Added seven missing guides for access control, video door phones, smart locks, automation, PA speakers, glass-break alarms and emergency alerts. Expanded WiFi guidance with the mesh/extender decision. These sections explain model compatibility, wiring, access ownership, handover checks and practical quotation inputs. Comparisons distinguish lighting from broader automation, digital from traditional locks, PA speech from music needs, and glass-break detection from entry contacts. Alarm guidance avoids unsupported certification or fire-compliance promises.

All thirteen service documents receive contextual LAN/AMC planning links where relevant, with self-links replaced by references to their own guidance. Existing enquiry destinations remain actual catalogue service titles. No form logic or submitted payload changed.

CCTV, LAN, biometric, AMC and Contact already cover the principal recommendations: recording/storage, PoE/cabling, shifts/report export, preventive tasks, written exclusions and useful enquiry details. These were retained rather than duplicated. Existing distinct titles, descriptions, H1s, canonical paths and shared business/provider entities were preserved. No meta-keywords, new public pages, hidden lists, locality variants, review/rating claims or FAQ eligibility promises were added.

## Authored application scope

- app/page.tsx: visible Home planning and four contextual links.
- app/services/[slug]/page.tsx: contextual planning links on thirteen real services.
- lib/service-planning.ts: seven new tailored guides and WiFi comparison; flexible paragraph array type.

All other authored files are the focused browser/checker scripts and SEO handoff/evidence listed below. Authentication, dashboards, lead persistence/validation/statuses, legacy locality/PIN display, optional-email handling, duplicate protection, notifications, integrations, consent and analytics remain on the clean base's existing implementation. The newer address/reminder/dashboard branch is preserved separately and is not part of this PR.

## Deliverables

- keyword-implementation-audit.csv: every unique supplied phrase and disposition.
- customer-keyword-inputs.json: provenance and source recommendations.
- keyword-implementation-report.md: this review and deployment handoff.
- bing-submit-urls.txt: only freshly verified live canonical public URLs.
- seo-monitoring-guide.md: account-side monitoring and conversion definitions.
- customer-keyword-live-checks.json: bounded fresh public production evidence.
- customer-keyword-render-checks.json: independent local rendered evidence.
- check-customer-keywords.py and verify-submission-urls.py: reproducible read-only checkers.
- tests/customer-keywords-ui.spec.cjs: desktop/mobile readability and preselection coverage.

## Current live and proposed implementation

Fresh bounded public GETs rediscovered 28 source public pages and 28 live sitemap entries. All 28 returned HTTP 200 with self-canonicals, indexable public HTML and no failed final requests. Home's observed canonical is https://visionsecuretech.in (root slash is equivalent). No local-only URL enters the Bing payload. Three root aliases redirect to the intended HTTPS/non-www origin. Eighteen declared Googlebot/Bingbot/OAI-SearchBot samples on six priority pages returned public HTML. Genuine bot-IP access, hosting/firewall logs, Search Console indexing, rankings, profile facts and AI citations remain unverified. No private/admin/API pages were crawled or submitted.

The live evidence is timestamped independently from local implementation. New buyer copy is proposed local/review-branch content, not a claim of deployment. Local response HTML and browser checks verify readability without treating HTTP status or structured data as proof of indexing or demand.

## Verification

Passed on the independent clean main-based review source:

- Full npm run lint and explicit npx tsc --noEmit --incremental false.
- Production build via npm run build -- --webpack, generating 82 framework/static pages; the independently discovered canonical public count is 28.
- Five structured-data regressions: one business identity, accurate service/provider references and safe JSON-LD serialization.
- Existing mocked enquiry regression: optional email, legacy locality persistence/default, validation, duplicate/rate limits, provider failure isolation, admin auth, analytics privacy/failure isolation, all 13 service values and sitemap.
- Existing analytics regression: authorization, dates, conversion, sanitised errors and no-store behavior.
- All 28 local pages: exact current title/description, one expected H1, production canonical, JSON-LD parsing, shared business identity, public internal-link destinations and thirteen service-preselected enquiries. Nine new content markers verified outside scripts. The sitemap exactly equals the rediscovered public catalogue, without a hard-coded count assertion.
- Eight browser regressions: new guidance at 390/1440px with no horizontal overflow; four existing priority buyer guides; contextual blog handoff; Contact/Home/popup mocked submissions, error retention, optional email, event success gating and mobile/Hindi behavior. External browser requests were blocked; only mocked enquiry POSTs were fulfilled.
- CSV validation: all 210 unique source phrases, eight required fields and valid live destinations. The spreadsheets skill parser imported all 210 records without loss. No measured-demand claims were added.
- Mobile video-phone and desktop Home screenshots visually inspected after animation completion. Representative coverage is not a complete device/accessibility audit.

The default Turbopack build passed on the preserved workspace snapshot (83 generated pages, including its existing extra follow-up route). In the clean Git worktree, default Turbopack failed because the test-only node_modules junction points outside its filesystem root. The supported webpack production build passed without source/config changes, disabling checks or copying production settings. A standard fresh dependency install/default Turbopack build in the eventual CI environment remains to be verified. No tests were weakened. Both baseline differences and compiler limitation are kept explicit. Testing uses synthetic loopback Mongo/auth values and reused dependencies; no production environment file or stored credential was read. No production test lead, message, email, notification or account event was sent.

## Owner confirmations

The retained published PIN is 227107; earlier owner reports specify 226101 for the intended Kakori/Pili Market office. Confirm correct staffed address, PIN and Maps identity before a separately reviewed correction across visible text, schema and business records. No address or Google Business Profile was silently changed.

Confirm written support/AMC visit frequency, response commitments, spares/labour exclusions, supported biometric/server maintenance and migration scope, exact lock/switch/doorbell models, background music scope, cable/testing specification and equipment-specific compatibility. Confirm genuine project/photo provenance and customer publication permission; this work adds no new project evidence. Existing free-site-visit wording and legacy reviews/projects/experience claims were not newly substantiated by keyword recommendations; owner evidence is needed. The dated automation/fire-safety articles warrant editorial/qualified safety review; no unsupported compliance assurance was introduced.

## Review, deployment and rollback

Review only the clean branch diff against main; the current workspace additionally retains previous admin/address work. Build and test the review branch using isolated configuration. No database migration is required. Approve the keyword copy and owner facts, review an available preview, then explicitly authorise any main merge through the normal repository process. This task does not merge, deploy production, publish dashboard content or submit URLs. After an approved release, verify priority pages and production sitemap/robots read-only before selectively submitting materially changed pages.

Rollback through a reviewed revert of the keyword implementation commit. Do not reset the repository or revert prior admin/address changes. No customer data rollback is involved.

Remaining account-side work: authorised Search Console/Bing sitemap/index inspection and performance exports; GA4 event ingestion/consent/key-event verification; qualified lead/sales review in the existing workflow. No account configuration or indexing guarantee is claimed.

## Priority review pages and preview

Review Home, /services/cctv-surveillance, /services/networking-solutions, /services/biometric-attendance, /services/it-support-amc and /contact first. Review the seven newly expanded service guides next. The production origin is https://visionsecuretech.in; the sitemap is https://visionsecuretech.in/sitemap.xml and robots is https://visionsecuretech.in/robots.txt.

Local preview was verified at http://localhost:3013 using the isolated clean review build. No Vercel preview URL was available at preparation time. A branch push is not proof of a successful preview or production deployment.

Official monitoring references: [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start), [Bing URL submission help](https://www.bing.com/webmasters/help/URL-Submission-62f2860b) (JavaScript/account UI required), [OpenAI crawler distinctions](https://developers.openai.com/api/docs/bots), [GA4 recommended events](https://support.google.com/analytics/answer/9267735). Existing custom enquiry event names are preserved rather than silently renamed to Google's recommended generate_lead.
