# Consolidated SEO/AEO content-quality update

Prepared 2 November 2026 (IST). Review branch: feat/consolidated-seo-aeo-quality. Fetched main is a07ca3b, merge of PR #6; it was inspected rather than assumed. The original workspace remains on feat/workbook-sage-performance at user commit 471e47d. Its only source-tree difference from current main is the user's tracked portable patch, which is preserved and excluded from this clean main-based review worktree (.consolidated-seo).

Result: corrected two priority guides and the article-rendering defect, replaced shared service boilerplate with 13 distinct explanations and an AMC workflow, qualified FAQ promises, and added accurate article/breadcrumb data. All requested analysis, code and validation handoffs are provided; release and account-side outcomes remain separate.

## Source ownership and scope

No applicable AGENTS.md was found in the inspected worktree or ancestors. README, package scripts, Next deployment/redirect/security configuration, current SEO/schema/content, enquiry and analytics code, earlier SEO handoffs and relevant tests were inspected. README says main merges deploy; no merge or production deployment was performed.

Public content on these paths is repository-owned: lib/blogs.ts and app/blog/[slug]/page.tsx; lib/services.ts, lib/service-planning.ts and lib/service-buyer-guides.ts; lib/seo-pages.json and lib/seo.ts; components/contact-page-content.tsx and components/faq-page-content.tsx. No dashboard content-editor override was found in these rendering paths. New article parsing/rendering and service explanation data are server-side. No runtime Markdown dependency, new page, script, animation or popup was added.

Dashboard, authentication, API callers, lead persistence/statuses/duplicates, address/legacy locality compatibility, optional email, notifications, integrations, consent and analytics event logic are unchanged. Existing Home image-loading and language improvements, all real service options, Call/WhatsApp links and enquiry preselection are retained. No VBMS or unrelated application was touched.

## Actual inputs and measured baseline

The exact suffixed (2)/(1)(1) copies named in the attachment were not present. Available matching files were resolved by their real paths and read completely, including Filters/Metadata. They are listed with SHA-256 and sheet names in consolidated-source-evidence.json:

- Downloads/visionsecure-keyword-map-v21.xlsx (the exact file supplied in the current user message): 946 unique master recommendations; mirrored sheets are not added again.
- Downloads/visionsecuretech.in-Performance-on-Search-2026-11-02.xlsx and the (1).xlsx copy: all cell matrices identical, counted once.
- Downloads/visionsecuretech.in-Coverage-Valid-2026-11-02.xlsx.
- Downloads/visionsecuretech.in-Performance-on-Search-Generative-AI-Features-2026-11-02.xlsx.

Both performance exports' date charts cover 1 August?31 October 2026. Filters say Web (text-based), Last 3 months. Recomputed normal Web totals are **21 clicks and 1,134 impressions** (CTR about 1.85%). The file-labelled Google Generative AI chart totals **112 impressions**. It has no clicks/lead/ChatGPT metric and is not added to overlapping Web totals. No new keyword volume, difficulty or lead forecast is invented from these observations.

Coverage's latest chart point is **23 October 2026, 24 affected pages**; its table has 24 rows including host aliases and Metadata says All known pages. Daily page counts were not summed. This lagged snapshot is not the current canonical route inventory; an absent URL is not called unindexed without current URL Inspection evidence.

The baseline CSV keeps property, page, query, device and Google-AI dimensions distinct. Historical www/non-www records are not silently merged into property totals. Separate Queries and Pages summaries do not establish an exact query-to-page relationship.

### Evidence supporting the priorities

| Existing page | Independent Web page summary | Google AI page-summary impressions | Editorial decision |
| --- | --- | ---: | --- |
| CCTV buying guide | 0 clicks / 77 impressions; average position 8.53 | 18 | Direct selection answer and removal of unsupported technical/count promises |
| Networking guide | 1 click / 298 impressions; average position 29.99 | 44 | Practical comms/server-room planning, testing and handover guidance |
| Access-control service | 0 clicks / 46 impressions; average position 63.65 | Not asserted | Distinct reader/controller/credential/exit explanations |

Relevant query examples include server room structured cabling design (53 impressions), comms room structured cabling design (45) and smart access control (29). These are topical recommendations, not observed query-to-page joins. Unrelated/ambiguous names such as live secure vision, vsecure360, visionverse technologies and dynacom, Pondicherry automation, and video DRM/encryption queries were not turned into offerings, identities, locations or page copy.

## Implemented corrections

### Article renderer first

The old parser checks the previous line for BHK and uses lines.indexOf(line). In the untouched baseline, the source contains 2 Cameras Needed after a BHK heading, but the returned visible HTML omits it. Repeated label fixtures also expose the indexOf/previous-line association risk. The observation is recorded in consolidated-renderer-reproduction.json; no lost source text was mistaken for a ranking or indexing problem.

A small cursor-based parser now consumes each line once and renders semantic headings, paragraphs, ordered/unordered lists, safe inline links/bold, rules and comparison tables. Raw HTML is escaped. JavaScript/data/protocol-relative/control-character link targets are not activated. Malformed table rows remain visible text instead of disappearing. No heavy Markdown package or unsafe raw-HTML rendering was introduced. Regressions check every meaningful source line of all seven articles, plus repeated-label/BHK fixtures and hostile links/text.

Tables have labelled focusable horizontal-scroll regions, column/row headers, mobile instructions and min-width containment; the page itself does not overflow. Stable heading IDs permit references. Existing router/switch and contextual enquiry sections remain.

### CCTV buying guide

Replaced the generic introduction and fixed bedroom-to-camera-count prescriptions with a direct selection answer. Coverage, required detail/viewing distance, lighting, lens, storage/retention, power and secure remote access are assessed together. A four-row camera-style comparison and a quotation checklist replace universal specifications.

IP ratings, PTZ rotation/tracking, audio, cloud accounts/subscriptions and WiFi power are model-dependent. Removed automatic IP66/IP67, cable-free power, tamper-proof cloud and absolute protection assumptions. Retained actual CCTV/AMC destinations and service-preselected enquiries. The H1/URL/title remain; the description now accurately states the guide's selection scope rather than promising a perfect camera.

### Networking/server-room guide

Replaced universal rack/switch sizes, front/rear clearances, UPS topology, patch-cord sizing, fixed cooling and broad equipment prescriptions with project inputs and selected-equipment requirements. The comparison table covers points/routes, uplinks/PoE, rack capacity, load/runtime, ventilation, testing and records. Handover covers labels, configuration ownership, known issues and explicit migration/restore responsibilities.

Connectivity checks, application qualification and standards-based cable certification are distinguished. A ping, cable label or generic testing claim is not represented as certification. Existing useful router/switch explanation and real networking/server/AMC enquiry links remain. Metadata drops the zero-downtime promise; no certified installer/partner claim was added.

### Shared services and access control

Added 13 service-specific sets of component/benefit explanations, replacing the same generic sentences across 52 component and 52 benefit paragraphs. All 104 explanation strings are distinct. Existing titles, catalogue offerings, benefits labels and useful planning/buyer answers are retained; no duplicate FAQ set was appended.

Access-control copy covers readers, credentials, door/lock fit, controller/power, revocation, supported logs and assessed exit/failure arrangements. Attendance is clearly distinguished from door-entry control. AMC now has an asset/fault/coverage/visit/check/report/renewal process, maintenance-specific quotation text and maintenance records instead of installation-only instructions.

### FAQ and article presentation

Retained the 27 distinct FAQ questions and existing interaction. Qualified unsupported prices, financing, free visits, universal installation/warranty/AMC/response terms, fixed recording/night distances and blanket payroll/offline/upgrade claims. Answers now explain actual quotation/model checks and written inclusions without visible placeholders or invented facts.

Removed the unsubstantiated Verified Security Guide/absolute-advice sidebar label and a generic blueprint assurance; the article enquiry/card copy is neutral and its real destinations remain. Home, Contact and the four existing priority service guides already contained useful selection/enquiry wording; those good sections were not copied again. Conditional outside-Lucknow wording remains, without repeated city lists or new locality pages.

## Technical SEO and AEO

All existing public URLs and appropriate titles/canonicals remain. Only the two corrected article descriptions change; their Open Graph and Twitter metadata now agree with visible intent. Every article has one clear H1. No keyword meta-tag expansion or hidden keyword list.

One shared LocalBusiness identity and existing Service provider references remain. Seven BlogPosting entities use visible headline/description/image and the existing publisher identity. Unverified authorship, review/modified dates and credentials are omitted rather than fabricated. Existing visible historical team/date labels are not newly certified facts. BreadcrumbList matches visible article/service breadcrumbs and uses page-scoped identities. No FAQ/HowTo/Speakable/AI schema or rich-result/ranking promise was added.

Current catalogue, local sitemap and observed live sitemap each contain **28 real canonical public URLs**; no route was added or removed. See consolidated-public-urls.txt. The bounded production audit fetched all 28 public pages plus metadata, representative declared crawler agents and root aliases; all final page requests passed. Current www-to-non-www redirects and clean Contact canonicals are verified. Two public GETs retain service query parameters while declaring /contact; interactive preselection is tested locally. No private/admin/API crawling or production form submission.

HTTP 200, robots permission, sitemap inclusion and schema do not prove Google-selected indexing, genuine crawler-IP/firewall access or AI citation. No current URL Inspection/account-side result was obtained. Google AI impressions are not ChatGPT traffic or leads. OAI-SearchBot search access and GPTBot training preferences remain distinct and unchanged.

## Keyword and business-fact decisions

keyword-implementation-map.csv records all 946 distinct workbook recommendations once, with target, intent, evidence, disposition and confirmation status. Useful overlapping terms consolidate into the matching answer; no density, exact phrase count or 946 insertions target. Search Console page/query observations are independent context, not an invented volume or query-to-page attribution.

Unsupported brand/model/repair/special-offering claims and unverified city/locality targeting remain held. The single current owner checklist is owner-confirmations.md, covering PIN, Maps, YouTube, actual coverage, visit/travel terms, warranty/AMC/response and project/credential evidence. No office, routine coverage, response promise, partnership, project, testimonial or unsupported Fire Alarm/EPABX/doorbell scope was added.

## Validation and practical limits

Passed:

- Full lint and explicit TypeScript; focused lint reruns for final touched renderer/template/test code.
- Matched baseline and final proposed production webpack builds, each generating 83 framework/static pages. The canonical public count is separately 28. No check was disabled.
- Ten renderer/content/schema unit tests, including all seven source articles, safe serialization, shared business/provider identity and all 13 component/benefit records.
- Existing mocked enquiry and analytics regressions: saved address, optional email, legacy compatibility, validation, duplicate/rate limits, provider failure isolation, auth, privacy and success-only event gating.
- Twelve browser regressions: seven-article metadata/schema, mobile/desktop tables and no page overflow at 320/390/1440px, access/AMC copy, service preselection, mocked success/error handling and normal popup keyboard/close/session behavior. Final presentation/AMC-specific cases were rechecked after visual review.
- All 28 final local pages: retained metadata intent, single H1, canonical/indexability, valid JSON-LD/shared business identity, public internal destinations and actual service enquiry values. Canonical sitemap set reconciles with the source catalogue.
- Twenty-seven FAQ questions are distinct; 946 workbook phrases appear once in the map. Normal performance exports are counted once.

Testing used reused installed dependencies and ignored synthetic loopback DB/auth settings. No production environment file or customer record was read/copied, no real notification sent and no production test enquiry submitted. Standard fresh dependency installation/default Turbopack build in eventual CI and account-side configuration remain unverified. Representative browser coverage is not an exhaustive device/accessibility or historical-article fact certification; the other five article bodies were retained while their rendering was checked.

The original 4-second popup timing/trigger is unchanged. It interrupts mobile reading, but close control, Tab containment, Escape, scroll access to submit and one-time session behavior pass. An optional trigger proposal is documented separately in owner-confirmations.md, not silently implemented or used to inflate timings.

## Matched local performance

Final results are recorded in consolidated-performance.json after the final source is frozen. Both builds receive the same page/image warm-up, then three fresh contexts per article/device/variant are interleaved. Same Chrome executable, webpack compiler, viewport, CPU/network settings, disabled browser cache and external-request blocking. Two priority articles, mobile and desktop: 24 raw timing samples. Article pages have no lead popup in either build; Home's unchanged popup is audited separately.

No parallel build/browser-regression jobs run during final timing collection. An earlier partial trial was stopped for the visual-quality wording/hint corrections and is not the final evidence. Samples within the final collection are retained without cherry-picking. Local LCP/FCP/CLS and observed long-task blocking are not Lighthouse scores, Lighthouse TBT, INP or field data. Historical Home PageSpeed screenshots from 31 October are a different URL/date/settings and are not used as fresh before/after article measurements. No deployed speed or ranking outcome is claimed.

## Review, release and rollback

Work is isolated on a main-based branch. The original workspace/user patch stays intact. Source ownership and inputs are explicit; no prior patch was force-applied. The old workbook patch is incompatible with the current untouched index and includes overlapping guide sets, regional/backlink plans and stale generated evidence, so it was not imported wholesale; see consolidated-patch-review.json.

Use post-deployment-checklist.md for owner review, preview, authorised release verification, monitoring and rollback. README states merging main deploys; do not merge or deploy automatically. No database migration is needed. Rollback is a reviewed revert of only this consolidated content-quality change, not a reset or reversal of unrelated lead/dashboard work.

A public preview is reported only if obtained and verified. GitHub PR/permission, pushed commit and portable-patch details are recorded at handoff. No stored credentials are accessed as a fallback.

## Material technical references (checked 2 November 2026)

- Axis image usability: https://whitepapers.axis.com/en-us/quality-with-a-purpose ? selection depends on scene, lighting and intended usable detail.
- Axis storage/bitrate: https://www.axis.com/insights/topics/video-surveillance-storage and https://help.axis.com/en-us/axis-p1265 ? recording/retention depends on the selected settings and system.
- TP-Link C200 example: https://www.tp-link.com/us/home-networking/cloud-camera/tapo-c200/ ? a WiFi product can still require a power adapter; functions/storage remain model-specific. This is a technical example, not a stock/dealership claim.
- Axis access-control manual: https://help.axis.com/en-us/axis-a1001 ? readers, locks, power, credentials and REX are configured together for the selected controller. No universal exit wiring or compliance assurance.
- Fluke testing distinction: https://www.flukenetworks.com/blog/cabling-chronicles/certification-vs-qualification-closer-look ? application checks and standards certification are different scopes.
- Cisco rack site preparation: https://www.cisco.com/c/en/us/td/docs/unified_computing/ucs/hw/rack_power/installation/guide/Rack_PDU/prep.html ? a model-specific planning example (legacy guide), not universal current rack clearances.
- APC selected-equipment instructions: https://www.apc.com/salestools/JGNY-9X784R/JGNY-9X784R_R0_EN.pdf ? ventilation/clearance requirements must be taken from the actual product's instructions.

Manufacturer references support technical qualifications; they do not establish VisionSecure brand authorisation, test certification or professional/project evidence.

### Final local medians (seconds)

| Article | Device | FCP before / after | LCP before / after | CLS before / after |
| --- | --- | --- | --- | --- |
| CCTV buying guide | mobile | 1.796 / 1.728 | 1.796 / 1.764 | 0.000000 / 0.000000 |
| CCTV buying guide | desktop | 0.416 / 0.420 | 0.416 / 0.420 | 0.000007 / 0.000007 |
| Networking guide | mobile | 1.292 / 1.676 | 2.392 / 1.676 | 0.000000 / 0.000000 |
| Networking guide | desktop | 0.520 / 0.444 | 0.536 / 0.464 | 0.000011 / 0.000011 |

Networking mobile FCP increased from 1.292s to 1.676s while LCP decreased from 2.392s to 1.676s. CCTV desktop timing was near-stable (4ms higher median). Layout-shift medians are unchanged. This is a mixed local result, not a guarantee that every metric improved. All raw samples are retained; no further timing samples were selected to force a pass. Public PSI/field verification remains a post-approval action.

The final comparison uses mobile 390x844 at 4x CPU, 150ms latency/1.6Mbps; desktop 1440x900 at 1x CPU, 40ms/10Mbps. External traffic is blocked on both variants, so production hosting/third-party overhead is not represented. Timings are not compared directly with the earlier Home screenshots.

### Reproduce checks

Build unchanged main and proposed source separately with synthetic provider-free settings using npm run build -- --webpack. Serve them on 3030 and 3031. Set SEO_TEST_BASE_URL=http://localhost:3031 and SEO_TEST_OUTPUT=consolidated-render-checks.json, then run python docs/seo/check-customer-keywords.py. Run node --test tests/structured-data.test.cjs tests/content-quality.test.cjs, the existing mocked enquiry/analytics tests, and npx playwright test tests/consolidated-content-ui.spec.cjs tests/seo-enquiries-ui.spec.cjs tests/keyword-content-ui.spec.cjs with the same base. For matched article measurements on otherwise idle completed builds, run node tests/consolidated-performance.cjs.

## Exact authored files

- app/blog/[slug]/page.tsx
- app/services/[slug]/page.tsx
- components/article-content.tsx
- components/faq-page-content.tsx
- docs/seo/consolidated-change-report.md
- docs/seo/consolidated-contact-query-checks.json
- docs/seo/consolidated-live-checks.json
- docs/seo/consolidated-patch-review.json
- docs/seo/consolidated-performance.json
- docs/seo/consolidated-popup-audit.json
- docs/seo/consolidated-public-urls.txt
- docs/seo/consolidated-render-checks.json
- docs/seo/consolidated-renderer-reproduction.json
- docs/seo/consolidated-source-evidence.json
- docs/seo/keyword-implementation-map.csv
- docs/seo/owner-confirmations.md
- docs/seo/post-deployment-checklist.md
- docs/seo/screenshots/consolidated-lab-after-desktop-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-lab-after-desktop-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-lab-after-mobile-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-lab-after-mobile-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-lab-before-desktop-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-lab-before-desktop-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-lab-before-mobile-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-lab-before-mobile-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-table-1440-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-table-1440-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-table-320-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-table-320-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/screenshots/consolidated-table-390-how-to-choose-the-right-cctv-camera.png
- docs/seo/screenshots/consolidated-table-390-networking-structured-cabling-and-server-setup-guide.png
- docs/seo/search-console-baseline.csv
- lib/article-content.ts
- lib/blogs.ts
- lib/schema.ts
- lib/service-content.ts
- tests/consolidated-content-ui.spec.cjs
- tests/consolidated-performance.cjs
- tests/content-quality.test.cjs

Generated .next output, dependency junctions, synthetic environment files, source workbooks and the original workspace/user patch are not included.
