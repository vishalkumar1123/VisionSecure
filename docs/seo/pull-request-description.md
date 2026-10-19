# Improve Lucknow SEO and existing enquiry flows

Public pages and articles now have page-specific canonical metadata, stable headings, one sitemap/robots implementation and distinct service intent for Lucknow. The www host redirects permanently to the canonical host without affecting preview hosts. All 28 real public pages are inventoried with separate production evidence.

Contact preselects services and stores locality/PIN in the existing lead workflow. Home email is optional; the popup saves through the existing lead API. Saved-enquiry tracking is separate from Call/WhatsApp click intent and excludes personal fields. Business hours use the owner-confirmed schedule.

Validation: lint, TypeScript, production build, mocked enquiry regression tests, four desktop/mobile browser tests, and rendered metadata/headings/schema/link/sitemap checks for all 28 public pages passed. Production was checked read-only; no real test leads or customer notifications were sent.

See seo-setup-report.md for setup, remaining business-evidence checks, account-side actions and rollback. Pre-existing uncommitted integration work is excluded. Do not merge until reviewed; main merges automatically deploy according to the existing README.

Structured-data completion adds one LocalBusiness/WebSite graph and 13 catalogue-matched Service entities referencing the same business @id, with owner-confirmed hours and safe shared serialization. Focused identity/content/script-safety checks and a committed-source-only build are documented in the handoff.
