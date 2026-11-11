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

## Follow-up with terminal log and installed toolbar evidence

2026-11-11. Read the complete attached terminal log b8d23312-7734-4f87-9793-fde177d1522f/Pasted text.txt. It shows Next dev Turbopack serving successful GETs and forwarding the same browser warning with the extra header top:40px style; it does not show a build/server crash.

A read-only inspection of installed extension manifests and program code found a specific matching mechanism in Chrome Default profile:

- SBMM - SEO Signals & Etsy Toolkit, version 1.7.6, extension ID mcpbnnimghofcmgofcjkcmlbejokmmnf.
- Its toolbar content script matches all URLs (apart from specified exclusions), so localhost is in scope. It executes at document_idle, which can precede React hydration on a slow development bundle.
- toolbar.js creates sbmm-toolbar-host and sbmm-toolbar-page-nudge; selects header/banner/fixed/sticky elements; computes the existing top and adds the toolbar offset using style.setProperty with important priority. This is a concrete matching implementation of the reported header mutation.
- Its manifest declares Alt+Shift+K as toggle-top-bar. The toolbar has 40px bar styling. No extension settings, cookies, passwords, credentials or browser profile databases were read or modified.
- This makes SBMM the identified matching source candidate, rather than a generic extension guess. Runtime attribution in the affected normal-profile tab still needs a toggle/reload comparison; browser DOM connector was unavailable. Do not claim that comparison was performed.

Recommended narrow fix: on the affected tab hide SBMM's Top Bar (Alt+Shift+K per installed manifest), then clear the console and hard reload with Ctrl+Shift+R. Confirm header has no inline top offset and warning does not recur. If needed, use Chrome Extensions > SBMM > Details to restrict its site access so it does not inject into localhost, and retain the extension on intended SEO audit sites. This preference/access change must be made by the owner or explicitly approved; no broad extension disable/uninstall or security weakening is necessary.

If the warning persists after the bar is off, use an extension-free Guest profile to distinguish another injector and inspect an attribute-modification breakpoint. No application changes, suppressHydrationWarning or 40px workaround introduced. The root unfinished merge and staged patches remain untouched.

The toolbar constant is explicitly Ae=40 (additional optional colour-bar height Ue=36). Fresh follow-up localhost checks: 3/3 passed in 16.3s, including the deterministic 40px reproduction. Application source unchanged.
