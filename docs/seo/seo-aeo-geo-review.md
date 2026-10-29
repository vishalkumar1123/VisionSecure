# SEO, local search and AI-search review

Observation date: **2026-10-29 (IST)**. Starting source revision: `18f48e0`. Applicable README/package/routes, actual service/blog sources, sitemap/robots, metadata/schema and prior docs/seo reports were inspected; no applicable AGENTS.md was found in the workspace search. The repository is Next.js 16.3.5/React 19. No app source or public content was edited. Existing work was preserved.

## Existing/live findings

- The actual catalogue has 13 service slugs and 7 blog slugs. Together with Home and seven public landing/index pages, they match the 28 entries observed in the live sitemap and historical public inventory. No live-sitemap-only or catalogue-only page was found.
- All 28 pages returned 200 indexable, self-canonical HTML, with one H1 and unique nonempty titles/descriptions. Current observed title/description values match the current source catalogue, including the blog title suffix. This does not establish any deployment timestamp or prove that the separate organic-services patch has been applied.
- Service pages expose readable scope, applications, buyer questions and enquiry links in returned HTML. Site/index navigation links expose the real service catalogue. The map labels each proposed link separately from a link already observed in a source page. No new locality pages or unsupported service slugs are proposed.
- Each observed document has one LocalBusiness entity using `https://visionsecuretech.in/#business`, plus WebSite. Each of the 13 real service documents has one Service entity whose provider references that same business identity. No duplicate/conflicting identity or JSON-LD parse error was observed. The current source serializer escapes HTML-significant characters before JSON-LD is inserted. No new ratings, reviews, coordinates, certifications or service areas were added.
- Public responses for Googlebot, Bingbot and OAI-SearchBot user-agent strings returned 200 on Home, CCTV, Networking, Biometric, AMC and Contact (18 checks). The live wildcard robots group permits these pages. This is a declared-user-agent test, not verification from genuine crawler IPs or hosting logs.
- The source keeps admin/API/account routes outside the sitemap, with relevant noindex and authorization protections. No private routes, enquiry submissions or external accounts were accessed.

## Business accuracy and remaining owner checks

Live visible business details and LocalBusiness schema still use the Lucknow address with **PIN 227107**, phone **+91 98721 33840**, and **info@visionsecuretech.in**. The earlier owner handoff records the intended Kakori/Pili Market office PIN as **226101** and says address/Maps correction was explicitly deferred. This is an unresolved owner-evidence conflict, not permission to change either value here. Confirm the actual office/PIN, signage and correct map/profile association before a separately authorized correction across visible text, schema and Business Profile.

Existing confirmed hours remain Monday–Saturday 09:00–20:30 and Sunday 10:00–16:00 in the schema. Do not infer extra locations or a separate Mohanlalganj/Salempur office from historical profile discussions. Lucknow is the only geographic modifier in the recommendations. Detailed service coverage, travel limits and eligibility outside that market need owner confirmation.

Visible free-site-visit claims and any quotation/maintenance/support terms should be confirmed operationally before future copy expansion. The automation article still has 2024 framing and some blog content needs factual freshness review. Fire/emergency information must not imply fire-compliance certification or regulated approval that has not been evidenced. No such claims were added to the keyword map. Actual credentials, warranty terms, brand partnerships, stock, project permissions and customer testimonials remain owner-supplied facts, not assumptions.

## Keyword recommendations and targets

There are **105 distinct editorial recommendations, mapped to 23 existing canonical pages**. They are not 105 new pages. No authorized Search Console/Bing query exports were supplied or accessed. Demand, search volume, competition, difficulty, rankings and conversions are unmeasured. Manufacturer/technical references corroborate selected terminology and buyer distinctions only; they do not prove local demand, dealer status or that a specific device/integration is offered.

| Cluster | Existing main destination | Proposed supporting coverage |
| --- | --- | --- |
| Home/business navigation | `/`, `/about`, `/services` | Factual business identity and the service catalogue |
| Enquiries | `/contact` | Site-assessment and maintenance-enquiry information |
| CCTV | `/services/cctv-surveillance` | Placement, recording, remote access and compatibility; existing camera-choice/IP-vs-analog articles |
| Biometric | `/services/biometric-attendance` | Device suitability, reports, placement and shift questions; existing manual-attendance comparison |
| Networking | `/services/networking-solutions` | LAN points, structured cabling, switching, upgrades and troubleshooting; existing network planning guide |
| Wi-Fi/mesh | `/services/wifi-mesh-networking` | Weak zones, node placement, access points and mesh/extender comparison |
| IT support/AMC | `/services/it-support-amc` | Inspection, agreed tasks, parts/labour exclusions and support terms |
| Access control | `/services/access-control-system` | RFID/biometric selection, credentials, compatible doors/controllers; existing benefits article |
| Server/rack | `/services/server-networking-infrastructure` | Rack layout, documentation and site requirements; confirm migration scope |
| Video door phone | `/services/video-door-phone` | Entrance communication, displays and wiring compatibility |
| Smart locks | `/services/smart-door-locks` | Door fit, keyless access, credentials and model-dependent backup access |
| Home automation | `/services/home-automation` | Phased deployment, smart lighting and supported compatibility; review the existing features article |
| PA/speakers | `/services/speaker-solutions` | Speech/announcement use, coverage and equipment compatibility |
| Glass-break alarms | `/services/glass-break-alarm-system` | Placement, panel compatibility and inspection questions |
| Emergency alerts | `/services/emergency-alarm-system` | Site notification planning, compatible integration and agreed maintenance |

Use one primary topic per target, with supporting phrases in useful body sections or buyer answers. The map prioritizes Home, CCTV, Networking, Biometric, AMC and Contact. Do not paste all keywords into headings/meta descriptions, repeat near-me terms mechanically or create duplicate locality pages. Proposed placements and suggested links are not already-published content changes.

## Proposed factual answer improvements

These are editorial directions for later review, not content applied to the site:

- **How many CCTV cameras are needed?** Explain that entrances, coverage areas and layout determine the assessment. Do not claim a fixed camera count or price for every property.
- **Will mesh increase the ISP plan speed?** Explain coverage/placement separately from upstream internet capacity. Assess the layout before recommending equipment; selected-model compatibility matters. [TP-Link's coverage comparison](https://www.tp-link.com/us/support/faq/2927/) supports the technology distinction.
- **What does AMC include?** State equipment, visits, tasks, parts and labour exclusions only after the owner confirms written terms. Do not invent round-the-clock support or a response-time guarantee.
- **Can attendance devices work with existing software?** Ask for the device/software version and reporting/export needs; verify compatibility before promising integration.
- **Which network equipment is needed?** Explain the roles of cabling, switches, routers and supported access points, tied to the actual site requirements. [Cisco's small-business network guide](https://www.cisco.com/site/us/en/learn/topics/small-business/how-to-set-up-a-network.html) corroborates those roles, not a VisionSecure partnership.

## Search access and AI visibility

OAI-SearchBot search access and GPTBot training preferences are separate controls. The observed wildcard policy currently allows both on public pages; there is no explicit crawler-specific group. No preference was changed. If the owner later changes training preferences, do not accidentally block OAI-SearchBot or weaken private-route protection. Actual crawler IP access needs hosting/firewall logs and official IP verification, not a spoofed user-agent alone. [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots) describes the separate purposes.

Readable factual service answers, accurate business data, crawlable internal links and visible-content/schema agreement are appropriate improvements. No special AI markup, indexing guarantee or promised citation is supplied. Google's [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) says normal SEO fundamentals still apply and no special schema is required. [Business Profile guidance](https://support.google.com/business/answer/7091?hl=en) emphasizes accurate information; local results are influenced by relevance, distance and prominence. No account/profile edit or ownership claim was performed.

## Unverified and next checks

Actual Google/Bing index status, selected search-engine canonical, rankings, traffic, query demand, Business Profile ownership/accuracy, genuine crawler-IP access and AI citations remain unverified. Use the submission guide and owner-authorized account exports for those checks. All final direct public-page checks succeeded; the separate browsing-tool failure for sitemap/robots was resolved through direct HTTP verification and is not a site-failure finding.
