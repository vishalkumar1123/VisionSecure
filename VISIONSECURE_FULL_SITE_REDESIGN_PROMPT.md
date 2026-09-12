# VisionSecure Full Website Redesign — Master Prompt

Paste this entire prompt into an AI coding tool working in this repository.

---

## Role

You are a senior frontend engineer and UI/UX designer specialising in premium,
conversion-focused websites for security and smart-technology brands. Redesign
the complete public-facing frontend with production-quality Next.js code. Do
not build a disconnected demo or replace working backend functionality.

## Project and goal

Redesign **VisionSecure Smart Technologies** (`visionsecuretech.in`), a Lucknow,
India company providing CCTV, biometric attendance, access control, networking,
home automation, fire alarm, video door phone, and AMC services.

Brand position: **a trusted local security expert with enterprise-grade
technology**. The result should feel safe, capable, contemporary, and premium:
never like a generic low-cost installer, a cold SaaS dashboard, or a flashy
"hacker" theme.

The current codebase is a Next.js App Router project. Redesign every public
marketing page as one coherent system, while preserving current routes,
working forms, API integrations, analytics, schema/SEO plumbing, and the admin
area. Do not redesign `/admin`, `/profile`, `/register`, `/login`, or API routes
unless a small shared-layout change is essential to keep them working.

## Scope: pages to redesign

Keep these URLs and make their navigation, footer and visual language consistent:

| Route | Required page purpose |
|---|---|
| `/` | High-converting overview and lead-generation homepage |
| `/about` | Company story, values, local expertise, process and trust signals |
| `/services` | Service overview with clear categories and individual solution detail |
| `/projects` | Project/case-study gallery with outcomes and service categories |
| `/gallery` | Visual installation gallery with filtering/lightbox where content supports it |
| `/blog` | Educational article index with categories and prominent article cards |
| `/blog/[slug]` | Readable article layout with table of contents/share/related content where data exists |
| `/faq` | Searchable or categorised FAQs, plus a contact fallback |
| `/contact` | Clear contact methods, service-area information, working enquiry form and map/location block if already available |

Retain the existing inquiry/lead submission flow. Public CTAs must point to the
real contact or inquiry experience already implemented; never create a fake
success screen or a dead form. Preserve WhatsApp behaviour if present.

## Existing content/assets to use

Use real repository assets from `public/images` wherever appropriate. Important
assets already include product/service imagery for CCTV, biometric, automation,
access control, networking, smoke/fire detection and video door phone; project
images; page hero images; service videos; the partner-brand logos; and the
canonical `Visionsecuretech_logo.png`. Use the same canonical logo in header and
footer. Do not introduce unrelated stock imagery or invent customer names,
certifications, project metrics, addresses, awards, review ratings, or partner
relationships.

Keep existing factual copy where it is accurate, but improve hierarchy,
readability and calls to action. If a statistic/testimonial/case-study detail is
not backed by current content, use a clean component state that does not claim
it as fact.

## Technical requirements

- Next.js 16 App Router, TypeScript and Tailwind CSS.
- Use the existing shadcn/ui primitives as customised building blocks, not raw
  default-looking components.
- Use Lucide outline icons only.
- Use `next/image` for raster imagery and explicit dimensions or `fill` layouts
  that prevent layout shift. Preserve video assets and provide controls/poster
  handling suitable for mobile.
- Framer Motion handles JS animation. CSS is acceptable for the logo marquee.
- Typed props everywhere; no `any`; no new dependency unless truly necessary.
- Retain existing server/client boundaries and do not convert pages to client
  components without need.
- Keep existing APIs, authentication, analytics, metadata, JSON-LD/schema,
  sitemap and robots functionality intact. Improve page-level metadata where
  appropriate.
- Do not alter database models, API contracts, environment variables, admin
  workflows or lead/inquiry storage as part of this visual redesign.

## Design system

Use these colours exactly. Do not substitute or generate additional brand
colours.

| Role | Hex | Use |
|---|---|---|
| Primary deep navy | `#0B2545` | Navigation, footer, dark surfaces |
| Secondary ocean blue | `#13315C` | Hero surfaces, headings, navy gradients |
| Signal teal | `#00B4A0` | Links, icons, hover/focus states, badges |
| CTA amber | `#FF7A29` | Primary conversion buttons only |
| Cloud white | `#F7F9FB` | Light section surfaces |
| Slate gray | `#4A5568` | Body copy on light surfaces |
| White | `#FFFFFF` | Cards and text on dark backgrounds |

Rules:

- Amber is only for a primary CTA such as “Get Free Quote” or “Book Site Visit”.
  Keep only one amber CTA visible in a viewport. Use dark brown `#4A1B0C` text
  on amber, never white.
- WhatsApp remains `#25D366`, visually distinct from the primary CTA.
- Use white/cloud-white text on navy or ocean-blue surfaces, never slate gray.
- Headings: Plus Jakarta Sans, weights 600/700. Body: Inter, weights 400/500.
  Update the current font setup accordingly and use no third display font.
- Body copy is at least 16px with 1.6–1.7 line-height. Use a deliberate desktop
  type scale that reduces cleanly on mobile.
- Section padding: 96px desktop / 56px mobile. Grid gaps: 24px. Other spacing
  follows an 8px scale. Cards use 16px radii; buttons 10px radii; shadows are
  soft (`shadow-lg` maximum). No glassmorphism, neon glow, neumorphism or harsh
  drop shadows.

## Global layout and navigation

Create a shared public-site shell rather than duplicating navigation/footer per
page. The header must be transparent over image-led hero sections and become a
solid navy surface with a subtle shadow after scrolling. Include a clearly
structured desktop navigation for Home, About, Services, Projects, Gallery,
Blog, FAQ and Contact; make the long list usable, for example through an
intentional Services menu or a compact menu pattern. The primary navigation CTA
is “Get Free Quote”.

Mobile navigation slides in from the right, traps focus while open, closes with
Escape and includes the same useful links and contact CTA. Maintain visible
keyboard focus states. Footer must use the canonical logo, key service links,
all public page links, real contact/social details already in the project, and
no placeholder content.

Each inner page gets a tailored hero with breadcrumb, concise title, supporting
copy and one appropriate CTA. Do not use a generic page banner repeatedly.

## Page content direction

### Homepage (`/`)

Build in this order: navigation, hero, trust indicators, solutions/services,
about preview, why choose VisionSecure, selected projects preview (restore it
only if real content exists), testimonials, partner logos, high-energy CTA,
contact preview, footer and existing lead popup. The hero should lead with the
outcome—protecting homes and businesses—and provide a real product/installation
visual. Include real service links and an accessible secondary action. Remove
the duplicated stats block; counters belong in one clear trust section only.

### About (`/about`)

Tell a grounded company story: local Lucknow presence, technical capability,
customer-first service and end-to-end support. Use a company/process layout,
not a generic corporate timeline. Include values, a simple consult-to-install
process, relevant service coverage, and a quote CTA.

### Services (`/services`)

Present CCTV, biometric, access control, networking, home automation, fire
alarm/smoke detection, video door phone and AMC as distinct solution cards.
Give each a suitable image/icon, short benefits, key capabilities and clear
enquiry CTA. Add a decision-help section (home, retail/office, apartment,
warehouse/industrial, etc.) only using categories supported by existing copy.

### Projects and gallery (`/projects`, `/gallery`)

Show only actual project/gallery assets. Projects should read as proof of
capability with category, solution and result where information is available.
Gallery is more visual: compact filters only when they genuinely map to content,
consistent aspect ratios, accessible lightbox with keyboard controls and image
alt text. Optimise media loading; do not load every full-size image on first
paint.

### Blog (`/blog`, `/blog/[slug]`)

Make the index editorial and easy to scan: featured/latest content, topic labels,
reading affordances and service-related CTA. The article page prioritises long
form readability with sensible max width, heading hierarchy, useful inline CTA,
and related articles only when data exists. Preserve current slug/content data
and static generation behaviour.

### FAQ (`/faq`)

Organise FAQ accordions by service or buyer question. Accordions use correct
button semantics, `aria-expanded` state and keyboard support. End with a short
contact/quote path for unanswered questions.

### Contact (`/contact`)

Make conversion and reassurance the priority. Show phone, email, WhatsApp,
office/service area and service-hours information only as currently known in the
repository. Keep the working contact/enquiry form with clear labels, validation,
consent/help copy if already present, success/error feedback, and a safe
alternative contact method. Include the map/location component only if existing
business location data is available.

## Motion and interaction

Motion should reinforce confidence and hierarchy, not distract.

- All animation honours `prefers-reduced-motion`, with an immediate static
  fallback. Use one shared reveal pattern: `viewport={{ once: true, margin:
  "-100px" }}`.
- Navigation: scroll transition; nav link underline draws left-to-right;
  mobile links stagger by 0.05s.
- Homepage hero: word-level fade-up at 0.08s stagger; supporting copy and CTAs
  follow; use a restrained teal 8–10% grid/particle pattern—never fake code,
  binary, terminal copy or cyberpunk effects. Hero visual floats ±8px over 3s.
- Stat counters trigger once when in view. Service cards reveal with 0.1s
  stagger; hover lifts 6px, gains teal border, and subtly scales/rotates its
  icon. Feature tags arrive after the card.
- Section headings fade up and draw a small teal underline. SVG feature icons
  can use a restrained stroke-draw reveal.
- Testimonials can cross-dissolve every five seconds or use an accessible
  horizontal carousel; pause automatic motion on focus/hover and give manual
  controls. Cards remain neutral white.
- Partner logos use a transform-only, duplicate-track CSS marquee, grayscale by
  default and colour on hover; turn it off under reduced motion.
- The final CTA band uses an ocean/navy gradient and a subtle background
  parallax. Its CTA may have a very low-opacity 2s glow ring.
- Form fields transition navy-to-teal focus ring. Invalid fields have a small
  300ms, three-oscillation shake; submit state changes to an accessible success
  confirmation/checkmark after the real request succeeds.
- Route transitions are a 200ms fade without disrupting browser history or
  sensible back-navigation scroll restoration.

Keep interaction animation below 400ms and scroll reveals at 600–800ms maximum.
Use transform and opacity for animated properties whenever possible.

## Accessibility, responsiveness and performance

- Target Lighthouse Performance 90+ and Accessibility 95+.
- Test 375px, 768px, 1280px and 1920px widths. Build mobile-first; no clipped
  text, horizontal scrolling, hover-only action, unreadably small touch target,
  or content hidden on mobile.
- Every text/background pairing must satisfy WCAG AA; especially validate amber
  CTA text, teal links, form controls and image overlays.
- Semantic landmarks, one logical H1 per page, descriptive image alt text,
  labelled icon buttons, visible focus, skip link, usable keyboard menus,
  accessible dialogs/lightboxes, and error/success announcement via `aria-live`.
- Lazy-load below-the-fold media. Avoid layout shifts, JS-driven marquee motion,
  large client bundles and autoplay video with sound. Use responsive image sizes.

## Execution and acceptance criteria

1. Audit existing public page components, route data and APIs before editing.
2. Establish shared tokens, fonts, header/footer and reusable page-hero,
   section-heading, CTA, card and motion utilities.
3. Rebuild all public pages in the scope above, maintaining valid routes and
   functionality.
4. Test navigation, mobile menu, forms, inquiry submission, blog routes,
   gallery/lightbox if included, keyboard interaction and reduced-motion mode.
5. Run lint/typecheck/build and fix errors. Do not leave TypeScript errors,
   broken imports, placeholder copy, dead CTAs or console errors.

At completion, provide a concise summary of changed files, tests run, any real
content deliberately retained due to lack of source data, and any optional
follow-up content needed from the business.
