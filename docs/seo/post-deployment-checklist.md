# Review and post-deployment checklist

No merge or production deployment is part of this task. README says a merge to main triggers the existing deployment. Review the isolated branch and approve a release explicitly before these production steps.

## Before approving a release

- Review the exact changed files, the two corrected guides, all shared service explanations, FAQ qualifications and owner-confirmations.md. Keep unsupported facts pending.
- Verify lint, TypeScript, production build, renderer/schema, mocked enquiry/analytics and browser results. Dependencies were reused; run the normal fresh-install/default build in authorised CI too. Do not bypass failed checks.
- Inspect an actually obtained preview, including protection/access status. Do not call a deployment dashboard a verified preview. If a preview shares production providers/database, use read-only inspection; do not submit test customer leads.
- Review that no environment file, credential, dashboard/auth/API/integration logic or unrelated application entered the diff.

## After an explicitly approved release

1. Fetch the current sitemap and robots from https://visionsecuretech.in. Reconcile the real public route inventory; this implementation retains 28 URLs and adds none. Never force a count or invent last-modified dates.
2. Check all canonical public pages for status, expected title/description, one H1, clean HTTPS/non-www canonical and valid JSON-LD. Verify www redirects. A successful fetch is not proof of indexing.
3. Open Contact with a genuine existing service query parameter. Confirm preselection and a query-free /contact canonical; do not submit a production test enquiry.
4. Read both corrected guides on mobile and desktop. Check paragraphs after headings, lists, safe contextual links, the comparison tables and horizontal scrolling confined to the table region. Check the other five articles for omissions.
5. Check access-control readers/credentials/controller/power/exit guidance and the AMC-specific process. Existing planning answers should still be present once; no duplicated generic guide set.
6. Inspect the shared LocalBusiness identity, all Service provider references, article publisher and visible breadcrumb lists. No invented author, rating, coordinate, credential or review date. Markup does not guarantee rich results or AI citations.
7. Check the unchanged popup's mobile close control, Tab/Escape behavior and scroll access to the form. Any proposed timing/trigger change needs a separate decision, not an unnoticed performance workaround.
8. Collect new PageSpeed/local lab results under stated comparable settings and inspect actual LCP resources, image dimensions/loading and layout shifts. Keep earlier provided screenshots, this task's local lab and field data separate. Do not claim a score increase from local timings.

## Account-side monitoring - authorised owner actions

Use the existing verified Search Console property. Inspect current Google-selected canonical/index status for priority URLs when appropriate; an URL absent from an export is not automatically unindexed. Submit the existing sitemap only if needed and request recrawl selectively for materially updated pages through the owner's account. No submissions were made here.

The supplied baseline is Web (text-based), 1 August to 31 October 2026, 21 clicks/1,134 impressions. Two identical exports are one dataset. Compare future complete periods with the same filters; do not add page/alias summaries to property totals or infer query-to-page pairs. Coverage's latest chart point is 23 October with 24 affected pages, not a sum or a current canonical inventory. Google Generative AI file totals 112 impressions; it is not ChatGPT traffic, clicks or leads, and may overlap Web reporting.

Bing sitemap/index/performance review and GA4 ingestion/consent/key-event checks remain account-side. Preserve enquiry_saved after confirmed API success separately from call_click/whatsapp_click. Do not send customer names, phone, email, address, requirements, credentials or recordings to analytics. Review genuine qualified enquiries, quotations and won/installed outcomes within the existing workflow without inventing keyword attribution.

## Rollback

Use a reviewed revert of only the consolidated content-quality commit(s), then rerun affected page/renderer/schema checks. Do not reset main, undo unrelated dashboard work or delete customer data. No database migration, provider reconfiguration or lead-status change is involved. A portable patch must pass git apply --check in a compatible clean checkout and must not be reapplied where its changes already exist.
