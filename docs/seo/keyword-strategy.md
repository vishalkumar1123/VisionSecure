# Lucknow keyword strategy — 20 October 2026

## Scope and counting

This review branch builds on merged PR #4. It does not deploy to production. Existing URLs, enquiries, dashboards and integrations are preserved.

Editorial recommendations (distinct from the observed Search Console data below): 6 priority page intents + 18 distinct supporting phrases = 24 editorial targets in this phase. This counts phrases assigned to pages, not repetitions or Google ranking keywords. Titles/headings already covered the six primary intents before this change. Supporting phrases now appear in visible homepage guidance, four service buying guides and Contact guidance. No keyword-density threshold, minimum count or ranking guarantee is claimed.

Across Home, all 13 services and Contact, the existing site has 15 primary topic assignments. The remaining nine service topics retain their current content; this phase does not claim 45 or 60 implemented keywords. Informational blog pages keep their separate article intent.

## Priority mapping (recommendations)

| Existing URL | Primary topic (existing title/H1) | Supporting phrases added to visible copy | Purpose |
| --- | --- | --- | --- |
| https://visionsecuretech.in/ | Security and networking solutions in Lucknow | security system installation; office networking; smart home installation | Help choose the right service |
| https://visionsecuretech.in/services/cctv-surveillance | CCTV camera installation in Lucknow | IP camera installation; CCTV recording storage; CCTV remote viewing setup | Installation or maintenance requirements |
| https://visionsecuretech.in/services/biometric-attendance | Biometric attendance installation in Lucknow | fingerprint attendance system; face recognition attendance system; attendance software integration | Installation or maintenance requirements |
| https://visionsecuretech.in/services/networking-solutions | LAN networking and structured cabling in Lucknow | LAN cabling installation; office network setup; structured cabling testing | Installation or maintenance requirements |
| https://visionsecuretech.in/services/it-support-amc | CCTV and IT maintenance / AMC in Lucknow | CCTV maintenance contract; IT AMC service; network troubleshooting | Installation or maintenance requirements |
| https://visionsecuretech.in/contact | Contact VisionSecure in Lucknow | installation quotation; site assessment enquiry; maintenance enquiry | Contact enquiry |

## Implementation

- Preserve existing focused titles, H1s and canonical URLs. Avoid making Home compete with the detailed CCTV service page for the same primary intent.
- Replace four generic service descriptions with distinct equipment, compatibility and quotation details.
- Add 12 visible buyer questions/answers across CCTV, Biometric, Networking and AMC. Explain limitations and quotation scope; do not invent prices, guarantees or integrations.
- Add descriptive homepage links to CCTV, LAN cabling and home automation.
- Explain on Contact what to share for installation, assessment and maintenance enquiries. Existing service preselection and lead workflow remain unchanged.
- No hidden keyword lists, keyword meta-tag expansion, artificial locality pages or unsupported “best/no.1/authorised dealer” claims.

## Placement rules

Use the primary intent naturally in a unique title and stable main heading. Use related language where it answers a real customer question, including descriptions and internal link text. Image alt text must describe the actual image. Do not append “near me” everywhere or repeat every variation in headings. Do not rename established URLs to insert keywords.

## Historical Search Console claims supplied in the patch (not verified in this run)

The attached patch reports a review on 19 October 2026. No Google account access or historical metrics were independently verified in this execution. Treat the following supplied claims as unverified historical context, not evidence collected by this branch run. Reported scope: Web search, 3-month chart range 18 July–17 October 2026, all countries/devices. Totals: 37 clicks, 1,050 impressions, CTR 3.5%, average position 17. The query table exposed 76 rows. These are historical property observations, not keyword-volume estimates or results of the proposed content changes. Table totals need not equal chart totals.

| Observed query | Clicks | Impressions | Interpretation |
| --- | ---: | ---: | --- |
| server room structured cabling design | 0 | 23 | Relevant informational query; landing page verified below |
| comms room structured cabling design | 0 | 20 | Related cabling topic; landing page not individually inspected |
| structured cabling system design | 0 | 11 | Relevant topic; landing page not individually inspected |
| glass break alarm | 0 | 18 | Relevant service topic; landing page not individually inspected |
| smart access control | 0 | 16 | Relevant service topic; landing page not individually inspected |
| how to choose cctv camera for home | 0 | 7 | Relevant informational topic; landing page not individually inspected |
| cctv near me | 0 | 1 | Too little evidence for a stable ranking conclusion |
| cctv service near me | 0 | 1 | Too little evidence for a stable ranking conclusion |

For the exact query `server room structured cabling design`, the Pages view showed only `https://visionsecuretech.in/blog/networking-structured-cabling-and-server-setup-guide`, 0 clicks / 23 impressions. Filtered aggregate average position was 36.6. This is an average over the range, not a current Lucknow position. Added contextual links from that existing article to LAN cabling, server infrastructure and a correctly preselected networking enquiry. Existing article URL/title remain intact. This supports the cabling topic without replacing the six-page 24-target editorial plan.

Unrelated brand-like searches and the Pondicherry query are not promoted to target keywords. A query appearing in the account is not automatically a service or area we should target.

All 28 canonical URLs were checked in the local rendered pass, including seven real blog slugs. The remaining 13-service primary intents come from existing titles/H1s; full URL inventory remains in public-url-inventory.csv. No duplicates/locality pages are introduced.

## Measurement and next review

Search Console Performance → Search results: compare equal date ranges by page and query. Separate the business name from non-brand queries; examine impressions, clicks, CTR and average position together. Attribute enquiries using saved-lead events separately from Call/WhatsApp clicks. No customer-entered data belongs in analytics. A Search Console click is not proof of a qualified lead.

Unverified account observations supplied by the patch author (not this execution): CCTV, Biometric, Networking and Contact were indexed. Home had an old duplicate/canonical assessment; a fresh live test confirmed successful fetch, indexing allowed and a non-www declared canonical. Home and CCTV recrawl requests were accepted. Overall indexing report was last updated 12 October: 23 indexed, 41 excluded, including legacy assets, query URLs and obsolete routes. These counts do not measure this branch or establish rankings for its recommended phrases.

Review after Google has recrawled deployed changes and sufficient impressions accumulate. Prioritise actual query/page evidence and enquiry quality; do not repeatedly submit the same URL or promise a fixed time to rank. GA4 receipt and Google Business Profile account edits have not been verified in this task.

## Evidence and verification

Current validation and remote handoff will be recorded below after this execution. The patch's supplied keyword-render-checks.json and prior test/push claims are not accepted as current evidence; the JSON will be regenerated from the resulting local build. No Google account actions are authorized or performed by this patch application.

## Deployment and rollback

Review this branch/PR before merging. The repository README states that merging main triggers deployment. After approval and deployment, inspect the six priority pages and sitemap, then compare Search Console data after recrawl. To roll back, revert the content commit through a reviewed PR; no database migration is involved.

## Google primary sources

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/crawling-indexing/special-tags

Google advises clear, descriptive page content and discourages keyword stuffing. Google Search does not use the keywords meta tag for ranking.

## Fresh execution ? 20 October 2026

The patch applied cleanly on fetched main (`0eeee48`) to feat/lucknow-keyword-content. Lint, standalone TypeScript, default production build, five schema tests, mocked enquiry regressions and six distinct desktop/mobile browser tests passed. The fresh rendered pass verified all 28 public pages, all 18 supporting phrases and contextual enquiry links. The sitemap remains exactly the original 28 canonical URLs. See keyword-application-report.md for reproducible checks, isolation and remote review state. No production or Google account actions were performed.

## Remote review result

Branch pushed successfully. GitHub connector PR creation returned 403 (Resource not accessible by integration). Automatic approval review rejected a fallback using the Git credential helper because that credential source was not explicitly authorized; the command did not execute and no credentials were retrieved. User choice/approval remains pending. No PR was created. Review/create link: https://github.com/vishalkumar1123/VisionSecure/compare/main...feat/lucknow-keyword-content?expand=1 ; ready description: keyword-pr-description.md.

For tested commit `6658ebb`, the repository Vercel status is success: https://vercel.com/vision-secure/vision-secure-tech/Ds6T9g1gn79tLLtL3Yhwj8UnswmK . This is the verified deployment status page, not a verified direct preview URL. Connected checks did not expose a direct preview address and browser access was unavailable. This documentation-only follow-up does not change the tested application code. See keyword-remote-review.json for exact observed state. No main merge or production deployment was performed.
