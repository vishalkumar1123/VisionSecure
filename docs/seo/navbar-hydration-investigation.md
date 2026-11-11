# Navbar hydration investigation

2026-11-11. Reported URL: http://localhost:3000/ (user confirmed). Existing root main workspace and unfinished merge preserved. Application source unchanged by this investigation.

The reported mismatch is an extra DOM attribute: style="top:40px" on header, absent from React's expected Navbar props. The development server response contains a header without a style attribute. No source code assigning a header top offset was found in app/components/lib; scroll/mobile state initializes deterministically and updates in effects.

Read-only isolated Chrome tests against the user's running localhost:3000 Turbopack development server:

- 390px: no hydration errors/page exceptions, no injected top style, interactive mobile menu and Escape pass.
- 1440px: no hydration errors/page exceptions, no injected top style, interactive controls visible.
- Negative control: hold application script requests until header exists, assign top:40px, then release scripts. This reproduces the reported React attribute hydration warning including the 40px style. This is a test-only browser mutation; no server/source changes made.
- Final result: 3/3 tests passed. All external/non-GET browser requests blocked. The first reproduction attempt allowed scripts to race the DOM mutation and did not reproduce; replaced with a deterministic pre-hydration gate. Artifact: navbar-hydration-reproduction.json. No test lead or notification sent.

Evidence supports a pre-hydration DOM mutation in the affected browser environment. An extension, preview/inspection toolbar or other injected script is plausible; the actual injector has NOT been identified or verified. Clean-browser tests do not establish that every normal-profile extension or third-party script is harmless.

Next user-side isolation: open localhost:3000 in an extension-free Chrome Guest profile or Incognito with extensions disabled, clear the existing console, then hard reload. If clean, disable localhost site access for the extension/toolbar altering fixed headers, enabling extensions one at a time to identify it. If it persists in a clean profile, capture the new warning and inspect the header with a DevTools attribute-modification breakpoint to locate the changing script. Existing cached console warnings should be cleared before comparison.

No suppressHydrationWarning, forced 40px offset, client-only rendering, random state or CSS overwrite was added: none corrects an unknown external mutation. React documents suppression as an escape hatch, not a general fix: https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors . No production build rerun because no application code changed. No production deployment performed.

Run: HYDRATION_TEST_BASE=http://localhost:3000 npx playwright test tests/navbar-hydration-ui.spec.cjs --workers=1 (PowerShell uses $env:HYDRATION_TEST_BASE). The negative-control warning test requires a development build.
