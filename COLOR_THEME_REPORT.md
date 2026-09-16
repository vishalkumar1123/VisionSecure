# Color, theme and account-security update

Scope: color consistency only; preserve existing layouts, carousels, content, media, routes, APIs and admin data workflows. Add shared light/dark controls and connect the existing self-service password system. The untracked app/admin/notifications file is existing user work and remains untouched.

## Route inventory (before implementation)
- [ ] /
- [ ] /about
- [ ] /admin
- [ ] /blog
- [ ] /contact
- [ ] /faq
- [ ] /gallery
- [ ] /profile
- [ ] /projects
- [ ] /services
- [ ] /services/[slug]
- [ ] /blog/[slug]
- [ ] /admin/analytics
- [ ] /admin/dashboard
- [ ] /admin/leads
- [ ] /admin/login
- [ ] /admin/settings
- [ ] /admin/users
- [ ] /admin/users/create
- [ ] /admin/leads/[id]
- [ ] /(auth)/register

Dynamic service and blog templates cover all existing slugs in lib/services.ts and lib/blogs.ts.

## Plan
1. Centralize navy, green, cyan and semantic light/dark colors.
2. Migrate public/admin color utilities without changing content or layout.
3. Add accessible, persistent icon toggles to public/admin navigation and standalone account/article screens.
4. Connect Settings to the shared password form; improve validation, JSON errors and user notifications.
5. Check both themes, password errors/success with mocked requests, lint, types and production build.
