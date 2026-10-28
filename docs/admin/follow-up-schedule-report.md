# Follow-up schedule correction

## Behavior

The previous KPI counted dated appointments today, so moving a lead to Follow-Up without scheduling a date did not increase it. The Follow-ups KPI now counts the actual Follow-Up pipeline status. Its detail separately reports today's appointments and overdue calls; its link opens the same status filter.

The schedule defaults to the current India business day. A date picker, previous/next day and Today button select another day's appointments. Calls are sorted by saved appointment time, excluding closed, cancelled, converted and installed leads. Each card shows customer, service, assigned person, current status, saved appointment time, latest saved follow-up note, Call and Review/reschedule links. No dates or notes are fabricated and no lead is mutated automatically.

Overdue calls remain visible separately, regardless of the selected calendar day. Follow-Up leads with no appointment appear under Follow-ups needing a date. Each list loads at most 20 records; full filtered lists are linked. The selected-day total is counted independently, and a count failure is explicitly labeled unavailable. Unscheduled and overdue query failures have separate feedback; dashboard abort, polling, refresh and last-good-data behavior remain in place.

The leads API supports validated followUpDay (IST boundaries) and unscheduled filters. Dashboard scheduleDate validation rejects invalid calendar dates. New queries use the existing administrator authorization and no-store response. Only the last note is projected into schedule responses; no provider or lead mutation changes were made.

## Appearance

Dark admin surfaces now use navy/charcoal (#101722 background, #1b2635 cards) with restrained lime brand accents and blue highlights. The green ambient wash was replaced by a subtle blue tint. Changes stay scoped to admin surfaces; public pages, login, light theme and existing theme persistence are preserved.

## Verification

Mocked dashboard API tests cover status totals, undated follow-ups, independent schedule totals, exact IST day boundaries, invalid dates, closed-status exclusion and filtered lead links. Existing account authorization and follow-up time tests also run without database writes.

Browser regressions cover selecting dates and previous/next/Today controls, stored notes, phone links, overdue and undated queues, status links, dark computed colors, responsive layout, notifications, scheduling, polling and shared admin pages. Production compilation, TypeScript and lint are run with isolated synthetic configuration. Final results and screenshots are recorded below after checks complete.

No production customer records were inspected or changed. Browser data is mocked, so this verifies implementation behavior rather than confirming the contents of the owner's live database. Existing unrelated SEO/report, generated preview/cache and next-env edits are preserved outside this commit. No merge or production deploy is performed.

## Final results

- Final isolated production build passed (82 pages); TypeScript and full isolated lint passed. Final source/test lint passed after the last alignment change.
- 52 browser tests passed using immutable CSS copied from the isolated build. The two focused follow-up/theme checks passed again after final card alignment and consistent fixture screenshots.
- Mocked dashboard API, account authorization and IST follow-up validation tests passed. Projection/count-failure tests also passed.
- Visually inspected final desktop/mobile navy screenshots: screenshots/follow-up-desktop-dark.png and screenshots/follow-up-mobile-dark.png. These are local mocked screenshots, not live customer data.
- Existing branch: feat/admin-glass-dashboard. Review changes before merging; production deployment is not performed here. A standalone follow-up patch applies on parent d0c0223, after the earlier admin redesign.
