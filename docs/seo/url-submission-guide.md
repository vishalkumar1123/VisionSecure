# Verified URL submission handoff

Verified on **29 October 2026 (IST)** against public production responses. This is inspection and recommendations only. Website content, robots, schema, account settings and firewall rules were not changed. No URLs were submitted, no backlinks created, and no merge or deployment performed.

## Files to use

- `bing-submit-urls.txt`: 28 verified public canonical HTML URLs, one per line, ordered by business priority. Paste these real page URLs into Bing Webmaster Tools → Submit URLs. They are not keyword searches or backlink platforms.
- `verified-public-urls.txt`: the same deduplicated eligible page set for reference.
- `url-verification.csv`: 33 records: 28 pages, three HTTP/www root aliases, and two metadata utilities. Includes response status, redirect chain, canonical, directives, sitemap membership, title, description and H1.
- `lucknow-keyword-page-map.csv`: **105 unmeasured recommendations mapped to 23 existing canonical pages**. Intent, suggested placement, primary/supporting role, proposed/existing internal links and evidence are recorded for each recommendation. This file does not go in Bing's Submit URLs box.
- `public-crawler-checks.csv`: 18 representative declared-user-agent checks.
- `url-verification-evidence.json`: public response observations and readable server-rendered text/JSON-LD. No authenticated/customer data is included.
- `seo-aeo-geo-review.md`: findings, keyword clusters, owner checks and proposed content directions.

## Current page inventory

**28 live canonical public pages verified:** Home, seven other landing/index pages, thirteen service pages and seven blog articles. The current source catalogue, historical public inventory and live sitemap have the same path set. Previous counts were not used as a substitute for this check. Build-generated route totals include other routes and are not the public page count.

All 28 returned HTTP 200 HTML, one H1, a unique nonempty title and description, a matching self-canonical, index/follow metadata and no observed X-Robots-Tag noindex. The observed robots policy allows this public set. Each appears in the live sitemap.

The Home canonical is `https://visionsecuretech.in` while its sitemap entry uses `https://visionsecuretech.in/`. Empty root path and `/` are the same HTTP resource, so the lists use the observed canonical once. Other path/trailing-slash distinctions were not silently normalized. HTTP and www root aliases returned 308 redirects to the HTTPS non-www Home destination; do not submit those aliases separately.

### Exact metadata URLs

- Sitemap: **https://visionsecuretech.in/sitemap.xml**
- Robots: **https://visionsecuretech.in/robots.txt**

Use the sitemap URL in sitemap tools. Do not put robots.txt or sitemap.xml into a page submission batch.

### Five highest-priority pages

1. https://visionsecuretech.in
2. https://visionsecuretech.in/services/cctv-surveillance
3. https://visionsecuretech.in/services/networking-solutions
4. https://visionsecuretech.in/services/biometric-attendance
5. https://visionsecuretech.in/services/it-support-amc

Contact is the next priority: https://visionsecuretech.in/contact . Order reflects the owner's requested business priorities, not measured search demand, a known deployment date or a claim that every page has just changed.

## Bing Webmaster Tools

1. Sign in to the verified property for `https://visionsecuretech.in`.
2. Open **Submit URLs / URL Submission**, paste lines from `bing-submit-urls.txt`, review and submit within the quota displayed in your account. Start with the priority pages if batching is needed. Do not invent extra URLs to fill a quota.
3. When only a few pages are genuinely new or materially changed, submit those affected canonical URLs. No release dates were supplied, so this handoff does not assert which pages changed most recently. Avoid repeated submissions of unchanged pages.
4. Submit `https://visionsecuretech.in/sitemap.xml` under **Sitemaps** as well.
5. Use **URL Inspection**, including its live view where available, on Home, CCTV, Networking, Biometric, AMC and Contact. Check Bing's crawl/index information and any reported markup or SEO issues. No authenticated account results were accessed here.

Submission notifies Bing; acceptance of the submission is not confirmation of indexing, ranking or appearance in Copilot. Follow the account's actual status/limits rather than an assumed universal quota. See [Bing URL Submission](https://www.bing.com/webmasters/help/URL-Submission-62f2860b), [Sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed) and [URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305).

## Google Search Console

1. Use an owner-authorized Domain property or the matching HTTPS URL-prefix property.
2. Under **Sitemaps**, submit `https://visionsecuretech.in/sitemap.xml` and inspect processing/errors.
3. In **URL Inspection**, inspect selected priority canonical pages, run **Test Live URL**, and compare the declared canonical with Google's selected canonical and current indexing status.
4. Request indexing for important new/materially updated pages where the account permits it. Save observed results and dates; a live test and an indexing request are not proof the page has entered the index.
5. Revisit Page Indexing/Crawl Stats and performance data to prioritize real issues and queries. No Search Console/Bing performance exports were supplied for this task; no search volumes, traffic, rankings, difficulty or competition metrics are claimed.

Google treats a sitemap as a discovery hint rather than an indexing guarantee. See [Google sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Search Console usage](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Verification groups and limitations

| Group | Current result | Treatment |
| --- | --- | --- |
| A. Verified live canonical public HTML pages | 28 | Included once in both URL lists |
| B. Confirmed local-only/unreleased page routes | None found in this discovery set | No extra pages invented; proposed content in older patches is not a new URL |
| C. Blocked/failed/unverified page checks | None in the final direct-HTTP public-page pass | Three redirect aliases are separately excluded as duplicate entry points |
| D. Utility/private routes | Listed below as patterns only | Never fetched or exported to submission lists |

Excluded route patterns: `/admin/**` (including login and dynamic admin pages), `/api/**`, `/profile`, `/register`, and the `/inquiry` compatibility redirect. Dynamic IDs, private records, query secrets and authenticated URLs were not enumerated. `/robots.txt`, `/sitemap.xml`, static assets and framework resources are utilities rather than HTML submission pages. The source retains admin/API authorization and noindex headers; they were not weakened or tested by crawling private endpoints.

The final evidence pass made 51 top-level public GET checks (28 pages, two metadata utilities, 18 declared-bot checks and three root aliases), with redirect hops additional and at most three concurrent requests. The initial discovery/checker pass was repeated after correctly handling equivalent root canonical notation. No final transport failure or retry was needed. The browsing tool could not open sitemap/robots, but independent direct HTTP checks returned 200; this tool limitation is not evidence of a broken website.

Titles, descriptions, H1s, links and readable content were observed in returned server-rendered HTML. A full JavaScript/browser rendering, genuine crawler-IP/firewall access, Search Console/Bing account state, Google Business Profile ownership and AI citations remain **not verified**. Declaring a crawler user-agent from this audit machine does not impersonate its real source IP or establish indexing. Successful HTTP responses and valid JSON-LD are eligibility evidence, not search-result guarantees.

## File validation

The offline validator passed: 28 deduplicated canonical URLs in each submission list; 33 audit records; 105 distinct unmeasured keyword recommendations on 23 verified targets, with exactly one primary recommendation per target; 18 declared-bot checks. It rejects private/query URLs in the submission lists and checks the local/sitemap/verified set agreement. Website builds and application tests were not rerun because only inspection helpers and handoff files were created; application content/code was not edited.
