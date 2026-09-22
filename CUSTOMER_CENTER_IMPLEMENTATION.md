# VisionSecure implementation report — September 2026

Code is implemented locally. Production deployment, real Google OAuth consent, Meta phone/webhook activation and live OpenAI acceptance remain external setup steps. AI defaults to disabled / Draft. No real customer emails or WhatsApp messages were sent while testing.

## 1. Existing architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind, Mongoose/MongoDB, NextAuth credentials and the existing admin shell/theme. Existing CRM analytics remains separate from Google Website Analytics. No replacement authentication or theme provider was introduced.

## 2. Models reused

Lead, User, ActivityLog, Notification, EmailConfiguration and EmailDeliveryLog. Existing notification delivery and email activation/event preferences still apply.

## 3. Models created

`models/CustomerCenter.ts`: ChannelIdentity, Conversation, CustomerMessage, AIKnowledgeEntry, AIAgentSettings, CustomerRequest, CustomerJob. A Mongo rate-limit collection enforces bounded provider/admin calls. `GoogleApplication` stores the encrypted OAuth app secret.

## 4. Existing model changes

Lead gains optional sparse-unique `customerCenterIdentity`. ActivityLog supports Customer Center system events without an invented user. Notification reference types include Customer Center. Google integration/token models retain their existing purpose.

## 5. Files created

- `lib/customer-center/`: normalized inbound persistence, policy, agent, knowledge retrieval, CRM actions, delivery locks/outbox, worker, API, audit/notifications and security.
- `lib/channels/`: WhatsApp Cloud API adapter and channel contract.
- `components/admin/customer-center/`: inbox, context, directory, request management, knowledge editor, AI settings and integrations.
- Google setup/sign-in components and configure route; `lib/email/brand-template.ts`, `activity-template.ts`, `alert-template.ts`.
- `components/admin/follow-up-scheduler.tsx`, `lib/follow-up-time.ts`, focused unit/browser tests and sample previews in `docs/previews/`.
- [Operational guide](WHATSAPP_AND_SCHEDULING_GUIDE.md).

## 6. Files modified

Admin sidebar/integrations, lead detail/API, dashboard schedule/service chart, activity list/service, Google OAuth/security/API/models, new-lead and legacy inquiry templates, security/settings alerts, WhatsApp template sender, shared activity types, `.env.example`, package manifest/lock and Google guide. OpenAI SDK is the only new runtime package.

## 7. Admin routes

`/admin/inbox`; `/admin/customer-center/customers`, `/requests`, `/knowledge`, `/agent`; expanded `/admin/settings/integrations`. All use the existing administrator access boundary.

## 8. API and webhook routes

`/api/admin/customer-center/[...path]` handles conversations/messages/read/mode/assignment/reply/drafts/CRM actions, knowledge, settings, integrations, customers, requests, team and controlled job processing. `/api/webhooks/whatsapp` verifies subscription GET and signed POST. `/api/internal/customer-center/process` is a secret-authenticated recovery worker. `/api/admin/integrations/google/configure` saves encrypted app credentials.

## 9. WhatsApp architecture

Official Meta Cloud API only. Signed messages normalize to channel identities and canonical Mongo history. Transactional inbound deduplication and one debounced durable job per conversation group fast message bursts. Incoming media is marked for human review; no arbitrary media fetch occurs. Outbound delivery receipts update stored status. No auto-retry of uncertain external sends. [Meta setup reference](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api).

## 10. OpenAI architecture

Official SDK Responses API with strict Zod structured output, server-only key/model, `store:false`, 35-second timeout and no SDK automatic retries. Context includes at most 16 text messages, bounded published knowledge and minimal service/status context. Canonical history stays in Mongo. A global 30-call/hour application limit bounds initial usage. Model access testing does not prove full generation compatibility; validate the selected model with a controlled draft before Auto. [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) and [data controls](https://developers.openai.com/api/docs/guides/your-data).

## 11. AI actions

Structured proposals: NONE, CREATE_LEAD, SITE_VISIT, SUPPORT and HANDOFF. Server predicates and mode/version leases authorize bounded CRM actions; the model never receives arbitrary database access. Draft mode performs no proposed CRM mutations or customer sends. Auto sends only the exact current published approved reply in an allowed category. Pricing and do-not-say categories never auto-send.

## 12. Knowledge Base

Draft/published/archived entries, categories, verified facts, keywords and separately approved English/Hinglish replies. Website import creates drafts only. Retrieval scores up to 300 published entries and selects five; no vector database. Revision checks prevent stale edits/sends. Larger libraries need paginated/search-index retrieval work.

## 13. Matching

Verified channel/phone identity, existing explicit lead link, then exact phone variants (including a recognized Indian local form). Never merge by display name. Ambiguous matches require review. Repeated lead creation uses a sparse unique identity field and reuses the CRM lead.

## 14. Human takeover

Conversation version compare-and-set plus a send lock serializes sends, takeover, assignment and resume. A successful takeover prevents subsequent AI sends. An already in-flight send cannot be recalled; takeover returns conflict until its lock clears. Expired sending work becomes uncertain and requires a human. Global settings leases prevent conflicting Auto setting changes during dispatch.

## 15. Site visits and follow-ups

Site visit requests start PENDING_CONFIRMATION. Scheduled/assigned requests require a date and active administrator assignee. This is request management, not a technician availability calendar. Lead follow-ups now have separate date/time inputs, explicit Save/Update/Clear, IST-to-UTC conversion, future-time validation and timeline records. Today's dashboard uses IST. Scheduling does not trigger automatic customer messaging or timed reminders.

## 16. Notifications and emails

Meaningful human handoffs, support requests and delivery failures use existing dashboard notifications with dedupe keys. Linked new leads use the existing new-lead notifier. Routine AI replies do not flood admin email. New-lead, status-change, failed sign-in and email-settings messages share the actual logo, navy/green brand palette and tagline. Status email includes safe previous/new status fields; confidential activity fields are excluded. Existing delivered mail/outbox snapshots are not rewritten.

## 17. Audit

Knowledge/settings changes, assignment, conversation mode, CRM actions and sends create Customer Center events in ActivityLog. The admin list shows the safe event name and System actor for automated events. Full prompts, tokens and passwords are excluded from audits.

## 18. RBAC

Active admin/super_admin users may operate the inbox, knowledge and requests. Only super_admin can change global AI controls, test provider configuration or save a Google OAuth app. Other roles remain denied. This initial release does not add employee/sales inbox permissions.

## 19. Security

Server-side authorization, same-origin mutation checks, body bounds, schema validation, HMAC timing-safe signature verification, rate limits, dedupe indexes, conversation/settings leases, opt-out and service-window enforcement, no arbitrary URL/media fetches and no raw provider error exposure. Google uses AES-256-GCM, PKCE and one-use state; encrypted secrets stay server-only. Email HTML escapes customer values and uses explicit field allowlists.

## 20. Environment

Retain Mongo/auth/email config. Set `META_APP_SECRET`, `META_VERIFY_TOKEN`, `META_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID`, `META_GRAPH_VERSION`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `CRON_SECRET`. Google credentials can be saved by Super Admin or provided through environment. Encryption uses a dedicated key or isolated strong-auth-secret derivation. See `.env.example` and the operational guides; no secret values are included here.

## 21. Meta setup still required

Register business number **+91 98721 33840**, obtain its actual Meta Phone Number ID/token, subscribe the app to the WABA/messages webhook and verify callback. Configure hosting secrets and test a consenting customer conversation. Existing phone app chat history/synchronization is not imported. Local Mongo must support transactions (replica set/Atlas). Configure the secret-protected worker scheduler and supported route execution duration.

## 22. OpenAI setup still required

Set a project key, choose an available compatible model, confirm billing/access, test configuration and review a real draft. Publish reviewed knowledge, then decide whether to enable the restricted Auto mode. No live AI provider call was used for acceptance during this implementation.

## 23. Indexes

Unique channel/external identity; unique conversation identity; message idempotency and partial unique channel/provider-message ID; conversation/message cursor and chronological indexes; conversation mode/assignee/lead indexes; knowledge state/category/text indexes; request idempotency/conversation/state-due indexes; job state/due/lease index; TTL rate-limit counters; sparse unique lead/customer identity. Inbound initialization ensures required unique indexes exist before transactional acceptance.

## 24. Dark mode

Existing semantic theme classes are reused. Browser fixtures cover inbox and analytics in light/dark mode; sample previews are saved locally. Email HTML is separately rendered; real email clients can alter colors or suppress remote images.

## 25. Responsive behavior

Inbox/analytics fixtures cover 320, 375, 430, 768, 1024, 1280, 1440 and 1920px. Mobile inbox separates list/chat/context. Scheduling/service-demand tests cover mobile/tablet/desktop. Service hover details appear beside the donut (below on narrow screens), with a matching color marker and visible center total; keyboard/touch service selection is supported.

## 26. Verification and limits

Regression suites cover auth/RBAC, analytics/dashboard, email queue/configuration, Google state/PKCE/encryption, webhook verification/signatures, duplicate inbound/batching, takeover/version races, opt-out, uncertain sends, lead matching/creation, unconfirmed visits, published knowledge, provider failures, HTML escaping and IST conversion. Provider and database behavior is mocked; these are not live Mongo transaction or external-delivery acceptance tests. Final validation: `npm run build`, `npm run lint`, `npx tsc --noEmit`, eight backend/template/time regression scripts and 78 Playwright checks passed. Scheduling browser tests deliberately run in America/Los_Angeles and verify correct IST-to-UTC storage. Next-sitemap has an existing environment-loader warning while still generating its output; this does not establish live integration readiness.

## 27. Deferred work

Instagram/Facebook/website chat adapters; phone app coexistence/history sync; media processing; campaign/template inbox composer; automatic timed customer outreach; technician availability/calendar conflict engine; quotation pricing/discount automation; installation/QA/reviews/referrals/AMC automation; vector search and advanced profitability/customer lifetime analytics. Existing human CRM flows remain available. Live deployment/provider acceptance is pending configuration, not represented as completed.
