# Translucent dashboard polish

The dashboard now uses visibly translucent surfaces, soft static blue light fields, a faint technical grid, brighter glass edges and diagonal highlights. Dark mode remains navy/charcoal with restrained lime accents; light mode uses a cool pale backdrop. This is CSS presentation work in app/admin/admin-glass.css. No APIs, lead data, reminder behavior, authentication or public-site styling changed.

Glass surfaces use 60% light / 56% dark fills with 16px backdrop blur and controlled saturation. Mobile reduces blur to 10px. Browsers without backdrop-filter retain opaque surfaces. Text stays fully opaque; input, select, textarea and table backgrounds remain solid for readability. Existing focus rings, reduced-motion behavior, dialog layering and drawer controls are preserved. Background effects are static CSS with no image downloads, animation loop, tracking or added dependency.

Validation: isolated production build passed (including TypeScript, 83 pages); 26 dashboard and 24 shared-shell browser regressions passed. The final screenshot case passed again in both themes, and the changed browser test passed lint. Browser checks cover 320–1920px, notification/dialog interaction, keyboard focus, polling, filters, day-wise follow-ups, lead address/technician editing, Settings and Customer Center. Screenshots are local authenticated component fixtures with mocked API data, not production customer records.

Reviewed screenshots:
- screenshots/translucent-desktop-dark.png
- screenshots/translucent-desktop-light.png
- screenshots/translucent-mobile-dark.png
- screenshots/translucent-mobile-light.png

Work remains on feat/admin-glass-dashboard. Existing unrelated edits are preserved. No merge or production deployment is performed. Revert this visual-polish commit to return to the prior surface treatment; no data or configuration rollback is required.
