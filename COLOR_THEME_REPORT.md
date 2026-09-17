# Color, theme and activity-log update

## Completed

- Shared homepage navy, green and cyan colors across public and admin templates.
- Saved light/dark icon controls in navigation, admin toolbar and standalone account pages.
- User Management has a last-column key icon on each row for changing that user's password. The dialog shows the selected name/email, new/confirm password, visibility controls, validation and loading/success/error notifications. Settings links to Users instead of showing the password form. The profile self-service form remains available.
- Password API returns consistent JSON and checks session, active account, current password, request origin, new password requirements and per-process attempt limits.
- Contact heading visibility corrected. Form cards, support panel, dropdown selection and buttons now use the shared theme tokens.
- Dark-mode logos retain a light backing for readability.
- Admin Activity Log at `/admin/activity-logs`, positioned directly below Settings in the sidebar, with activity/date filters, refresh, pagination, loading, empty and error states.
- Successful login/logout, password changes and lead updates/notes are recorded. Existing stored activity remains available; older unrecorded actions are not reconstructed. Passive session expiry does not create a logout event.
- Activity list validates filters, caps pagination and limits non-admin permitted users to their own records. The list excludes raw change payloads, IP addresses and user agents.
- Existing layouts, content, sliders and public contact submission handlers are retained.

## Verification

- Production build and TypeScript passed, including the protected activity-log route.
- Final lint passed with no errors or warnings. Production build and final TypeScript validation passed.
- `node tests/account-activity.test.cjs`: passed mocked password validation, JSON error responses, authentication, origin, attempt limits, password update/audit, activity filter and role-scope checks.
- Isolated Chrome: homepage, contact, about, services, CCTV detail, projects, gallery, blog, FAQ, admin login and register checked in both light and dark mode. Saved preference persists across navigation.
- Contact screenshots visually inspected in both modes. At 390px mobile width, document width was also 390px (no horizontal overflow).
- Unauthenticated activity-log page correctly redirected to admin login.

## Limits

- Live database writes, actual password changes and authenticated admin UI were not exercised; API tests use mocked dependencies.
- Activity logging is best-effort through the existing service. It does not block business operations if logging storage is unavailable.
- Password attempt limits use the existing process-local limiter, not a shared distributed store.
- The existing next-sitemap environment-parser warning remains; sitemap generation and the build still exit successfully.

## Per-user password management

- Uses the existing `/api/users/[id]/reset-password` endpoint with fresh administrator account verification, target ID validation, matching strong-password rules, request-origin checks and attempt limiting.
- Admin and super-admin actors can reset any user's password, including their own, as requested. Target role does not restrict this action.
- Passwords are hashed through the existing service. Responses and activity events do not include passwords or password hashes.
- Audit events identify the acting administrator and target user.
- Additional mocked tests passed for selected-user targeting, successful resets, all target roles, missing/invalid users, weak/mismatched passwords, unauthorized requests and rate limits.

## User-management permission correction

- Both administrator roles manage every other user: creation, role changes, lock/unlock, reversible deactivation and password reset.
- Own role and lock/unlock controls are disabled, with explanations. PATCH, activate, deactivate and soft-delete endpoints independently reject attempts to change the acting user's own role/status.
- User API authorization checks the current database account, not only the role stored in a session token. Session refresh also checks the current role and lock state.
- User actions consistently use the API's `id` field. All paginated users are loaded into the searchable grid instead of only the first ten.
- Role selectors now use the same five roles as the database; permissions are synchronized when roles change.
- Fixed the activate endpoint, which previously deactivated the account.
- Account access and role changes create audit records and show success/error notifications.
- Mocked tests cover both administrator roles against every target role, self-protection via all mutation endpoints, invalid roles/status, missing users, unauthenticated/forbidden requests and permission synchronization.
