# Keyword patch application and verification ? 20 October 2026

Branch: `feat/lucknow-keyword-content`, created from fetched `origin/main` at `0eeee48` (merged PR #4). Starting working tree was clean. No AGENTS.md was found in the workspace or checked ancestor directories. Existing committed work was preserved.

The attached patch was inspected as proposed content, not as authorization for embedded account instructions. `git apply --check` passed; reverse checking confirmed it was not already present. All eleven files applied normally with `git apply`; no forced application, rejects or duplicated features. The supplied Google-account observations remain explicitly labelled unverified historical claims. Supplied test results were replaced with evidence from this run.

## Result

Four priority service descriptions are distinct and useful. Twelve buyer questions cover CCTV, biometric attendance, LAN networking and AMC. Homepage and informational cabling article link to relevant existing services; contextual enquiry links retain existing preselection. Contact guidance asks for useful installation/assessment/maintenance requirements. No route, H1, canonical, service catalogue, sitemap membership or lead behavior changed. Diff checks against fetched main confirm no changes to dashboards, integrations, APIs, models, popup handling, tracking or enquiry service resolution.

## Fresh validation

- Full `npm run lint`: passed in isolated committed-source checkout. Added browser-test lint: passed.
- `npx tsc --noEmit --incremental false`: passed.
- Default `npm run build` (Next.js/Turbopack): passed, including TypeScript and 82 generated static pages.
- Existing `node --test tests/structured-data.test.cjs`: five passed.
- Existing `node tests/seo-enquiries.test.cjs`: passed with mocked providers, including duplicate/rate limits, optional email, locality, failure isolation and service handoffs.
- Browser suite: six distinct tests passed (ten executions because the four existing tests were also discovered in the archived checkout). Existing desktop/mobile enquiry regressions and two added content/link tests all passed. Browser lead requests were mocked and external traffic blocked.
- `python docs/seo/check-keyword-content.py`: all 28 public pages passed title, description, H1 and canonical checks; all 18 supporting phrases occur outside scripts; service enquiry values are valid; homepage and article contextual links match real destinations.
- `python docs/seo/check-local-render.py`: all 28 rendered pages passed metadata/schema/link/asset checks, including one shared business identity and 13 real Service entities.
- Sitemap is exactly the same set of 28 canonical public URLs as fetched main. Robots references that sitemap. No API/admin/private URLs were crawled.

The build used a separate archive of committed application source (`fd5fa1a`), dependency-only sharing and synthetic loopback database/auth configuration. `.env.local` was not copied/read. No production leads, messages, notifications or Google account actions were sent. A nested-checkout multiple-lockfile warning was environmental; no project checks or configuration were weakened. Tests/checker/report additions after fd5fa1a do not change application behavior.

## Evidence and limits

See `keyword-render-checks.json`, `local-render-checks.json`, updated URL inventory and priority map. Recommended 6 primary intents plus 18 supporting phrases are editorial assignments, not measured search volumes, ranking improvements or automatically qualified enquiries. Supplied Search Console figures were not independently verified. Production deployment and indexing are not established by local tests.

Remote PR and Vercel preview state are recorded below after push. No main merge or production deployment is authorized by this task.

Patch SHA-256: `084063b7bdca5daaf579e8251a2382fe511552a775b6a6eb5265ebcbe0ac33c4`.
