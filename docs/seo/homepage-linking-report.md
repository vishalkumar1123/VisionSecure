# Homepage linking and carousel update

2026-11-11. Scope: active VisionSecure homepage and shared footer only. User-provided copy is treated as owner editorial content; the keyword export informs relevant topic/anchor choices, not new service claims or guaranteed organic performance.

## Source inspection

Read the supplied UTF-16 tab-separated Keyword Stats 2026-11-06 at 16_33_27.csv in full: 1,174 rows, 1,174 unique normalized phrases, zero exact normalized duplicates. Reporting period October 1, 2025 through September 30, 2026. Source SHA and selected intent mapping in homepage-linking-keyword-evidence.json. The source workbook v21 had already been audited in the existing consolidated reports; this task used the newly supplied CSV for additional homepage link choices and retained existing useful links.

The export does not supply location/network/language targeting filters. Do not label its monthly figures as Lucknow demand. Competition/indexed value and bid columns concern advertising, not organic difficulty. Semantic variants such as CCTV installation and CCTV camera installation share the existing CCTV route; awkward repeated variants, mechanical near-me wording, product-only/superlative/unsupported city or guard-service intents were not injected into Home. No hidden keyword list or new page created. This is a selective homepage linking pass, not a new per-row disposition of every supplied phrase.

## Implementation

- Four readable owner-supplied footer paragraphs beside the logo, with grammar/punctuation corrected. Existing full service list, coloured YouTube/Instagram/Facebook/WhatsApp icons, text-only Support WhatsApp link and existing embedded-office-profile map destination retained.
- Centred the property-planning heading, paragraphs and buyer question, with bounded paragraph width. Retained existing CCTV/cabling/attendance/AMC contextual links and added access-control, Wi-Fi/mesh and enquiry links where those topics are discussed.
- Linked the six requested feature headings: Premium Quality Products to Services; Professional Technical Support and Warranty & AMC Support to IT Support & AMC; Experienced Technical Team to About; Responsive Service and Customized Solutions to Contact.
- Linked the four trust labels to the matching Services, Contact or AMC pages. Existing feature descriptions retained; no invented certifications, response guarantees, prices or product availability.
- Each of the four existing hero background images is now a real accessible link to its matching canonical service page. Inactive links excluded from pointer/keyboard/accessibility interaction. Text and enquiry buttons retain separate destinations and no nested anchors.
- Added 8-second autoplay, Previous/Next and Play/Pause buttons. Pauses on pointer hover and keyboard focus; reduced-motion preference starts paused. Manual Previous/Next pauses playback; leaving hover/focus resumes only when not manually paused. Initial server/client state matches, selector hydration readiness retained, first image priority and deferred other images retained. No additional dependency or image asset.
- Existing public URLs, metadata, shared business identity, forms/storage/optional email/service selection/analytics/integrations untouched. Repeated contextual links to an existing canonical page are intentional navigation, not duplicate landing pages or duplicated content sections. Did not force links onto testimonial names or decorative/irrelevant text.

Files: app/page.tsx; components/footer.tsx; components/hero-slider.tsx; components/why-choose-us.tsx; tests/footer-ui.spec.cjs; tests/homepage-linking-ui.spec.cjs. Root copies and review branch copies match. Existing root unfinished merge and staged patch files preserved.

## Validation

Full lint passed; 10 schema/content unit tests passed; existing mocked enquiry regression passed, including all 13 service handoffs and 28 sitemap URLs. Production webpack build including TypeScript passed with 83 generated framework/public pages. Browser validation recorded below after final run. No production leads/notifications, external URL submission, merge or production deployment.

Initial browser run: a stale test expected the former wording emergency alarms instead of the requested emergency alarm systems. Updated the expected visible text. One first service-image navigation exceeded the original 5-second URL expectation during cold development compilation; trace confirmed the actual clicked IMG belonged to the correct service anchor. Added a bounded explicit navigation wait and reran; did not force click or remove the destination assertion.

The separate legacy Get Directions/Contact Maps CID conflict and published PIN conflict remain owner follow-ups documented in earlier reports. No new legal/registration, location, ranking or AI-citation claim.

Final result: 11/11 browser tests passed on the actual localhost:3000 workspace, including three responsive widths, real navigation through all four linked banner images, six feature-heading links, four trust labels, centred planning content, four footer paragraphs/coloured socials/map link, clock-controlled autoplay/hover pause/manual pause/reduced-motion behavior, Hindi heading, and existing mocked Contact/Home/popup success/failure/analytics isolation. Final source has no application edits after its successful production build; only browser expectation/source-report changes followed.

Final isolated production audit: all 28 canonical public pages pass metadata/H1/JSON-LD/internal-route/service-provider checks and sitemap count remains 28. Evidence: homepage-linking-render-checks.json. Visually reviewed centred desktop planning content and the footer with logo/socials beside the four paragraphs. No Lighthouse/field-speed improvement claim. Preview: http://localhost:3036 (synthetic backend); root owner dev remains http://localhost:3000. No production deployment.

## Remove extra slideshow controls

2026-11-11. Per owner request, removed the visible Previous, Play/Pause and Next controls from the homepage hero. The four existing service selectors and service/image/enquiry destinations remain. Autoplay still advances every eight seconds and retains the existing hover/focus and reduced-motion behaviour; removed obsolete manual-pause state. Root and review copies match. Focused clock-driven browser regression passed: extra controls absent, automatic advance works, hover pauses and leaving resumes, reduced-motion starts static. No dependency, URL or lead behaviour changes. No new full production build for this small UI removal; lint/TypeScript checks run separately. Root staged merge work preserved; no production deploy.

Final control-removal verification: focused browser regression, ESLint, TypeScript noEmit and diff checks passed.
