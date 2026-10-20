Improve Lucknow service buying guidance without changing existing enquiry behavior. Adds twelve buyer questions across CCTV, biometric attendance, LAN cabling and AMC, four distinct service descriptions, and contextual Home/blog links to real services and correctly preselected Contact enquiries.

Applied the supplied patch cleanly on fetched main (merged PR #4). Historical Google-account claims in the attachment are clearly distinguished from fresh evidence. No dashboard, integration, API, model, tracking, popup or lead-handling changes.

Validation passed: full lint, standalone TypeScript, default production build, five schema tests, mocked enquiry regressions, six distinct desktop/mobile browser tests, and rendered metadata/canonicals/headings/schema/link checks across all 28 public pages. All eighteen supporting phrases are visible outside scripts; the sitemap exactly retains the original 28 canonical public URLs. Isolated dummy configuration and mocked leads were used; no customer notifications or production test leads were sent.

See docs/seo/keyword-application-report.md and keyword-render-checks.json. Rankings, Search Console account claims and production deployment are not established by this work. Review before merging; main merges trigger the existing production workflow.
