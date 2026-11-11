# Owner document homepage and LocalBusiness review

Reviewed 2026-11-11. Input: VISIONSECURE SMART TECHNOLOGIES.docx (read all document paragraphs) and four supplied homepage screenshots. Document recommendations were assessed against code, rather than executed as unconditional instructions.

## Changes

- Permanent, single homepage H1 and four distinct service panels matching the requested navy/lime presentation, using existing assets. Each has a service-specific heading, practical enquiry inputs, named selection button, canonical service link and correctly preselected Contact enquiry.
- Manual panel selection replaces automatic six-second rotation so the text and destination stay stable while reading or using the keyboard. Named buttons expose their pressed state; reduced-motion styles supported. First background image remains high priority and others deferred. No new asset/dependency added.
- Existing shared safely serialized LocalBusiness/WebSite graph moved to HTML head, with the same #business identity and existing Service references. No second entity added.
- Header and closing CTA now say Request a Quote; unsupported free-visit and unconditional warranty labels in those components replaced with qualified planning/warranty wording.
- Previous consolidated SEO article/service work is retained as the base. No dashboard/auth/API/lead/analytics/integration code changed.

## Recommendation disposition

| Recommendation | Result |
| --- | --- |
| LocalBusiness JSON-LD | Already present; moved once to head. Correct existing logo image URL retained, rather than homepage-as-image. |
| Provided coordinates / $$ / registered corporate body | Not verified; not added. Schema does not establish legal registration or guarantee rankings. |
| Address/PIN | Existing published 227107 retained pending reconciliation with earlier owner-provided 226101. Newly pasted example is not sufficient to resolve that conflict. |
| Opening hours | Existing confirmed Mon–Sat 09:00–20:30, Sun 10:00–16:00 retained. |
| Sitemap/robots | Existing routes retained; no submission or account changes made. |
| Map iframe | Existing Home/Contact office map retained. Avoided loading another iframe in every footer. Map embed and directions CID need owner confirmation; coordinates in pasted schema differ from embedded map. |
| Rename three service URLs | Skipped: meaningful current URLs already exist, and no migration benefit/evidence justifies churn. No duplicate routes/redirect aliases created. |
| Service H1s | Existing distinct service H1s retained; new homepage service H2s follow requested copy without unsupported “Best”. |
| Hyperlocal landing pages | Not created: no unique locality evidence/content supplied. |
| Image alt | Gallery/project images already have title-based alt; homepage assets described as illustrations, not claimed customer installations. |
| Blog allegedly blank | Seven existing guides retained; no duplicate articles created. |
| Device claims in document | Instant glass detection, guaranteed mobile alarms, universal automation compatibility and warranty/free claims not copied. |
| Reviews/brands | Existing sections retained; no invented review/brand partnership added. |

## Owner follow-up

Confirm official PIN and full GBP NAP, genuine map listing/CID, exact premises coordinates if desired, and written site-visit/warranty terms. Existing consolidated owner-confirmations.md covers other outstanding claims. No external GBP/Google/Bing submissions performed.

## Verification and delivery

Checks and screenshots are recorded below after execution. Run only against isolated synthetic backend settings; no production leads or notification providers used. Preview is local, not production. Root workspace's unfinished merge and two staged patch files are preserved; changes are in a separate review worktree/branch based on feat/consolidated-seo-aeo-quality. Review base must include that earlier branch to avoid losing its work.

References: https://developers.google.com/search/docs/appearance/structured-data/local-business and https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse . Structured data and geographic wording do not guarantee local rankings or legal status.

### Source integrity and limits

Source DOCX SHA256: BB574EEB3A0D9C45DDF4C2221E0259947FFFA410C36594CAE335CE81BCA667DE. Source file unchanged. This is a selective editorial implementation, not a wholesale copy of the document: existing planning guidance, service descriptions, reviews, gallery alt text, seven blogs, map and shared schema were not duplicated. No new locality routes were generated. The original root main workspace remains in its existing unfinished merge.

Live read-only observations on 2026-11-11: Home and Contact still show the old homepage heading/CTAs and published PIN 227107; these local changes are not deployed. A retrieved Blog listing contains seven articles; cached web results are not proof of the latest deployment. Source code is authoritative for this proposed change. No Google Business Profile access was available to verify exact NAP/listing ownership.

Initial browser run: 8/9 passed; new H1 missing from Hindi dictionary caused one regression. Added distinct Hindi headings/button translations and reran the final browser suite. Mobile review also led to spacing around floating support controls. Final results below supersede that initial run. No Lighthouse or measured performance improvement is claimed; asset loading priorities and dependencies were preserved.

### Final verification

- Full ESLint and explicit TypeScript noEmit checks passed; focused lint after the corrections passed.
- Production webpack build passed on final code, including TypeScript and 83 generated framework/public pages. Synthetic loopback Mongo URI and test-only auth secret; no .env.local copied.
- 10/10 existing structured-data/content tests passed. Existing mocked SEO-enquiry and analytics regressions passed, including optional email, address, duplicate/rate protection, provider isolation and analytics success/privacy.
- Final local rendered audit passed all 28 intended canonical public pages, one LocalBusiness identity per page, 13 Service-provider references, metadata/H1/canonical/internal links/service handoffs and sitemap count 28. Artifact: docx-render-checks.json.
- Eight screenshots cover four panels at 390px and 1440px; also checked no horizontal page overflow at 320px. Visually reviewed mobile networking and desktop CCTV; corrected mobile spacing for floating controls.
- Final browser suite outcome recorded below. Real Google Rich Results Test and Search Console account-side validation remain unverified; no indexing/ranking claim.

### Files and review

Application files: app/layout.tsx; components/hero-slider.tsx; components/navbar.tsx; components/cta-banner.tsx; lib/home-slides.ts; lib/seo-pages.json; lib/translations.ts. Test: tests/docx-homepage-ui.spec.cjs. Evidence: this report, docx-render-checks.json and screenshots/docx-home-*.png.

Preview: http://localhost:3032 (isolated local production server). No public preview verified. Branch: feat/docx-homepage-schema-review, based on 1ef7674 (the previous consolidated SEO branch). Review the incremental diff against that base; a main-target review also includes that prior, separately reviewed work if not yet merged. Do not blindly apply to a changed main. Roll back this homepage update by reverting its commit after approval, without reverting prior SEO changes. No merge or production deployment performed.

Final browser result: 9/9 passed after corrections (320/390/1440px panels, all four correct service preselection handoffs, keyboard activation, Hindi H1, existing buyer-guide links, mocked Contact/Home/popup save/failure/analytics behaviour).
