# VisionSecure SEO monitoring guide

Use the existing authorised accounts; account configuration and reporting access were not verified in this implementation. No measured query demand, volume, ranking or lead forecast was supplied.

## Google Search Console

Select the verified production property. In Performance > Search results, compare complete 28-day periods using the same country, device and search-type filters. Record impressions, clicks, CTR and average position by page and query. Prioritise Home, CCTV, Networking, Biometric, AMC and Contact. Separate branded queries from service research and installation enquiries. Average position is an aggregate, not a guaranteed rank.

Export page and query tables with extraction date and filters. Record the approved release date before comparing periods. A content change, URL submission, indexing and a customer enquiry are separate events; comparisons alone do not establish causation. Use URL Inspection for selected materially updated pages after an approved release. Inspect selected canonical, crawl/indexing status and rendered content. Submit the production sitemap only if absent or unsuccessful; avoid repeated requests for unchanged URLs.

## Bing Webmaster Tools

Review Search Performance with comparable dates and filters, by page and query. Save exports rather than assuming submissions produced impressions. Inspect indexing/crawl issues and the production sitemap status. `bing-submit-urls.txt` is a verified-live URL payload only; use the account's displayed submission quota. Keyword audit rows do not belong in Submit URLs.

## GA4 and enquiries

Existing public tracking separates `enquiry_saved`, `call_click` and `whatsapp_click`. Confirm events in authorised GA4 DebugView/Realtime using an isolated test property or consent-aware test provider. Do not create production test leads or click-to-message customers for verification. No GA4 configuration or key-event toggle was changed here.

`enquiry_saved` must follow both an OK API response and confirmed success. A failed/rate-limited/duplicate request must not count as a saved enquiry. Calls and WhatsApp clicks measure intent, not saved records, connected calls or sales. Preserve consent controls. Event payloads should contain only controlled form labels and sanitised page paths: never names, phone numbers, email addresses, full addresses, free-text requirements, passwords or recordings. Existing event tests use mocks; they do not demonstrate account ingestion.

## Qualified leads and sales

Within the existing authorised lead workflow, review the relevant date cohort, service, status, assigned staff and follow-up outcomes. Count genuine qualified enquiries, quotations and won/installed outcomes separately. Deduplicate according to the existing workflow; do not equate a click or a generic success screen with a qualified lead. Do not export customer personal details into SEO spreadsheets or analytics. Do not assume historic leads can be attributed to individual search queries without consent and a verified attribution design.

## Weekly review

Record public page availability, sitemap/canonical consistency, Search Console/Bing issues, impressions/clicks, saved enquiries, click events and qualified outcomes. Note release dates, tracking changes, seasonality and missing data. Investigate unexpected drops before adding phrases. Review useful buyer questions and confirmed service facts rather than expanding keyword count mechanically.

## Crawler preferences

Public robots rules allow the existing public catalogue while private route protections remain in place. Declared Googlebot, Bingbot and OAI-SearchBot samples returned public pages during this review; they do not verify genuine crawler IPs, firewall logs, indexing or AI citations. OAI-SearchBot search discovery and GPTBot training preferences are separate decisions. No crawler/firewall setting was changed.

Official references: [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start), [Bing URL submission](https://www.bing.com/webmasters/help/URL-Submission-62f2860b), [GA4 events](https://support.google.com/analytics/answer/9267735), [OpenAI crawlers](https://developers.openai.com/api/docs/bots). Bing account UI requires JavaScript and was not accessed.
