# JustHustle — Claude Code Development Workflow

---

## Tech Stack (Confirmed)

| Layer | Tool | Status |
|---|---|---|
| Framework | Next.js 16 + TypeScript | ✅ In repo |
| Styling | Tailwind CSS v4 | ✅ In repo |
| Components | Shadcn/ui | ❌ Needs init |
| Animations | Framer Motion | ✅ In repo |
| Charts | Recharts | ❌ Needs install |
| AI | Gemini 2.5 Flash | ✅ In repo |
| Auth + DB | Supabase SSR | ✅ In repo |
| Payments | Razorpay | ✅ In repo (not wired) |
| Email | Resend + React Email | ✅ Resend in repo, templates need install |
| Design skill | UI/UX Pro Max | ✅ At `.agent/skills/ui-ux-pro-max/` |
| DB skill | Supabase Best Practices | ✅ At `.agents/skills/supabase-postgres-best-practices/` |

---

## How Claude Code Sessions Work

**Golden rules:**
1. **One sprint per session.** Never ask Claude Code to "build everything." One focused sprint = one session.
2. **Always start with context.** Every session begins by pointing Claude Code at the docs and design system files.
3. **Always end with review.** Run `npm run dev`, open browser, check the output. Commit before moving to next sprint.
4. **Use the skills.** Claude Code must run the UI/UX Pro Max skill before building any UI component. It must reference the Supabase skill before writing any DB query.

**Session template (copy this into every Claude Code session):**
```
Read these files for context before doing anything:
- docs/owner_scope.md
- docs/customer_scope.md  
- docs/admin_scope.md
- docs/design_system.md
- docs/code_audit.md
- design-system/MASTER.md (if it exists)
- design-system/pages/[relevant-page].md (if it exists)

Then complete this task: [SPECIFIC TASK]
```

---

## Pre-Work (Do Before Any Claude Code Session)

### 1. Save the 5 scope documents into the repo

Create a `docs/` folder in your repo root and save these files there:
- `docs/owner_scope.md` — The owner scope document
- `docs/customer_scope.md` — The customer scope document
- `docs/admin_scope.md` — The admin scope document
- `docs/design_system.md` — The design system v2 document
- `docs/code_audit.md` — The code audit document

These are the 5 documents generated in our planning sessions. Claude Code reads them at the start of every session.

### 2. Verify your `.env.local` has all required values
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_GENAI_API_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=hello@justhustle.in
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Sprint Sequence

### 🔧 SPRINT 0 — Foundation (Session 1)
**Goal:** Fix all bugs, install packages, generate design system, update tokens  
**Estimated time:** 2–3 hours  
**See:** Sprint 0 Prompt below

### 🔐 SPRINT 1 — Auth + Owner Profile (Session 2)
**Goal:** Fix login page branding + scope, build owner profile journey  
**Key deliverables:**
- Login page: JustHustle brand, remove `business.manage` scope
- New page: `/dashboard/profile-setup` (collect phone, WhatsApp, GST)
- Middleware: redirect to profile-setup if profile incomplete
- Update `sync-profile` to detect incomplete profile

### 🌐 SPRINT 2 — Landing Page Refresh (Session 3)
**Goal:** Update landing page to match final scope and new design system  
**Key deliverables:**
- Hero: remove gradient, clean white, correct CTA copy
- Pricing: ₹599/month + ₹4,999/year single plan
- Features: update feature list to match actual product scope
- Add competitor analysis, Shield, and QR management as highlighted features
- Ensure all static pages (privacy, terms, contact, about) have real content

### 📱 SPRINT 3 — Customer Review Page (Session 4)
**Goal:** Full rebuild of `/r/[slug]` — the most critical user-facing page  
**Key deliverables:**
- Fix all 7 bugs (especially Place ID bug)
- Mobile-first design with new palette
- Google One-Tap auth gate (Option B — post-rating)
- Language toggle wired to AI API call
- `reviews` table insert on Post click
- All events tracked correctly
- Marketing consent checkbox on thank-you screen
- Full animated flow (Framer Motion throughout)

### 📊 SPRINT 4 — Dashboard Core (Session 5)
**Goal:** Real analytics dashboard with dark sidebar  
**Key deliverables:**
- New dark navy sidebar (`#131842`) with correct nav items
- Dashboard overview: real stats from DB (not hardcoded zeros)
- Install + wire recharts: scan trend, conversion funnel, Shield catch chart
- Peak times heatmap
- Recent activity feed (real data)
- Fix billing page: single plan (₹599/₹4,999), wire Razorpay

### 🏢 SPRINT 5 — Business Management (Sessions 6–7)
**Goal:** Build all 7 tabs for individual business pages  
**Deliverables:**
- Supabase: create `qr_codes` table (see DB note below)
- Add Business: convert from separate page to popup/modal
- Tab 1: QR Codes (nicknames, create, download PNG/PDF, per-QR analytics)
- Tab 2: Shield Inbox (real data, mark resolved, internal notes)
- Tab 3: Reviews (Places API integration, sync button, greyed reply)
- Tab 4: Customisation (logo upload, colours, tagline, live preview)
- Tab 5: Settings (business contact, notification toggles)
- Tab 6: Competitor Analysis (Places API nearby search, AI insights)
- Tab 7: Social & Web placeholder

### 🛡️ SPRINT 6 — Admin Panel (Sessions 8–9)
**Goal:** Build all admin pages from scratch  
**Deliverables:**
- Admin layout with `#1E104E` sidebar (visually distinct from owner)
- Admin dashboard (platform stats)
- Owners: list + detail + actions (extend trial, pause, deactivate, delete, email)
- Businesses: list + detail + pause/deactivate/delete
- Customers: list + detail + review history
- Reviews & Feedback: platform-wide view
- Revenue: Razorpay data
- Settings: platform config

### 📧 SPRINT 7 — Notifications + Billing Wiring (Session 10)
**Goal:** Complete Razorpay integration + all Resend email templates  
**Deliverables:**
- Razorpay: subscription creation + webhook fully implemented
- Resend email templates (React Email): trial ending, trial expired, Shield catch, payment failed
- Trial enforcement in middleware (grace period logic)
- Billing page fully wired with Razorpay checkout

### 👤 SPRINT 8 — Customer Profile (Session 11)
**Goal:** Build minimal customer profile page  
**Deliverables:**
- `/profile` — review history across businesses
- Review history card design
- Empty state

### 🚀 SPRINT 9 — Polish + Responsive QA (Session 12)
**Goal:** Full responsive check + production readiness  
**Deliverables:**
- Test every page at 375px, 768px, 1024px, 1280px
- Fix any responsive issues
- Loading states on every async action
- Empty states on every list
- Error boundaries on every page
- 404 page
- OG image + meta tags
- Vercel deployment

---

## New Database Table Needed (Sprint 5)

Before Sprint 5, run this in Supabase SQL editor:

```sql
-- QR Codes table (multiple QRs per business with nicknames)
CREATE TABLE qr_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  nickname      TEXT NOT NULL,
  qr_slug       TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  fg_color      TEXT DEFAULT '#131842',
  bg_color      TEXT DEFAULT '#ffffff',
  dot_style     TEXT DEFAULT 'square' CHECK (dot_style IN ('square', 'rounded', 'dots')),
  embed_logo    BOOLEAN DEFAULT FALSE,
  frame_title   TEXT,
  frame_tagline TEXT,
  total_scans   INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qr_codes_business ON qr_codes(business_id);
CREATE INDEX idx_qr_codes_slug ON qr_codes(qr_slug);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qr_codes_owner_all" ON qr_codes
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Add missing columns to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS social_whatsapp TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS review_page_thank_you_message TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS total_feedback INT DEFAULT 0;

-- Add marketing consent to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;
```

---

## Sprint 0 — Full Prompt (Copy-Paste Into Claude Code)

```
You are building JustHustle — a B2B SaaS for Indian businesses to collect Google reviews via QR codes.

STEP 1: READ CONTEXT FILES
Read all of these before doing anything else:
- docs/owner_scope.md
- docs/customer_scope.md
- docs/admin_scope.md
- docs/design_system.md
- docs/code_audit.md

STEP 2: RUN UI/UX PRO MAX SKILL — Generate and persist the design system
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "B2B SaaS reputation management local business India review QR professional modern" --design-system --persist -p "JustHustle" --stack nextjs

Then generate page-specific design guides:
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "dashboard analytics sidebar owner SaaS modern dark" --design-system --persist -p "JustHustle" --page "dashboard" --stack nextjs
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "mobile customer QR scan review experience minimal" --design-system --persist -p "JustHustle" --page "review-page" --stack nextjs
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "admin panel platform management data tables" --design-system --persist -p "JustHustle" --page "admin" --stack nextjs
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "SaaS marketing landing page pricing hero" --design-system --persist -p "JustHustle" --page "landing" --stack nextjs

STEP 3: INSTALL MISSING PACKAGES
npm install recharts
npm install @react-email/components react-email
npx shadcn@latest init
(When prompted: TypeScript=yes, src/=yes, App Router=yes, import alias=@/*)

Add recommended shadcn components:
npx shadcn@latest add button input label card badge tabs dialog sheet select switch toast progress avatar separator skeleton

STEP 4: UPDATE package.json
Change "name": "next-temp" to "name": "justhustle"

STEP 5: UPDATE globals.css WITH NEW DESIGN TOKENS
Replace the existing @theme block with exactly these tokens:

@theme {
  /* Primary palette — Deep Navy + Warm Coral */
  --color-primary: #131842;
  --color-primary-hover: #1a2155;
  --color-accent: #E68369;
  --color-accent-hover: #d9705a;
  --color-accent-light: #f5d5cc;

  /* Surfaces */
  --color-canvas: #ffffff;
  --color-canvas-warm: #FBF6E2;
  --color-surface-soft: #ECCEAE;
  --color-surface-mid: #f0ebe0;
  --color-surface-dark: #131842;
  --color-sidebar: #131842;
  --color-sidebar-hover: #1e2760;
  --color-admin-sidebar: #1E104E;

  /* Text */
  --color-ink: #131842;
  --color-body: #2d3056;
  --color-muted: #6b7280;
  --color-on-primary: #ffffff;
  --color-on-accent: #ffffff;

  /* Semantic */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-star: #E68369;
  --color-hairline: #e5e0d8;
  --color-hairline-dark: #2a3068;

  /* Typography */
  --font-sans: var(--font-inter);
  --font-display: var(--font-inter);

  /* Spacing */
  --spacing-section: 96px;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(19, 24, 66, 0.06), 0 1px 2px rgba(19, 24, 66, 0.04);
  --shadow-modal: 0 20px 60px rgba(19, 24, 66, 0.15);
}

STEP 6: FIX ALL 10 PRIORITY BUGS (in this exact order)

Bug 1 — LOGIN PAGE SCOPE (CRITICAL):
File: src/app/(auth)/login/page.tsx
Change the OAuth scope from:
  scope: "profile email https://www.googleapis.com/auth/business.manage"
To:
  scope: "profile email"
Also fix branding: change "ReviewBoost" text and logo to "JustHustle" with Shield icon (not Star icon)

Bug 2 — POST TO GOOGLE URL (CRITICAL):
File: src/app/r/[slug]/ReviewPageClient.tsx
Find: const googlePlaceUrl = `https://search.google.com/local/writereview?placeid=${business.id}`
Replace with: const googlePlaceUrl = business.review_link || `https://search.google.com/local/writereview?placeid=${business.google_place_id}`

Bug 3 — MISSING FIELDS IN SERVER QUERY (CRITICAL):
File: src/app/r/[slug]/page.tsx
Add these fields to BOTH select() calls:
  google_place_id,
  review_link,
  city,
  description

Bug 4 — EVENT TYPE MISMATCH:
File: src/app/r/[slug]/ReviewPageClient.tsx
Find all instances of: event: "review_posted"
Replace with: eventType: "review_clicked"
Also check the fetch body — the API expects field named "eventType" not "event"

Bug 5 — MISSING SCAN EVENT:
File: src/app/r/[slug]/ReviewPageClient.tsx
Add a useEffect at the top of the component that fires on mount:
  useEffect(() => {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: business.id, eventType: 'scan' })
    })
  }, [business.id])

Bug 6 — MISSING REVIEWS TABLE INSERT:
File: src/app/r/[slug]/ReviewPageClient.tsx
In handlePostToGoogle(), after the event track call, add:
  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessId: business.id,
      rating,
      aiGeneratedOptions: aiReviews,
      finalText: review,
      language: selectedLanguage,
      submittedToGoogle: true
    })
  })
Create the API route: src/app/api/reviews/route.ts

Bug 7 — FEEDBACK COLUMN MISMATCH:
File: src/app/api/feedback/submit/route.ts
Find: feedback_text or feedback in the insert
Replace with: message (matching the DB schema column name)
Also in: src/app/(dashboard)/dashboard/feedback/page.tsx
Update the select query: change feedback_text to message

Bug 8 — WRONG BUSINESS STATS COLUMNS:
File: src/app/(dashboard)/dashboard/businesses/page.tsx
Remove: total_reviews, total_feedback from the select (these columns don't exist)
Keep: total_scans only. Other stats come from the events API.

Bug 9 — BILLING PAGE WRONG PRICING:
File: src/app/(dashboard)/dashboard/billing/page.tsx
Remove the 3-tier PLANS array entirely.
Replace with a single plan structure:
  Monthly: ₹599/month
  Annual: ₹4,999/year (save ~30%)
  Trial: 7 days, full features

Bug 10 — LANDING PAGE WRONG PRICING:
File: src/components/landing/Pricing.tsx  
Change: ₹999 → ₹599 (monthly)
Change: ₹7,999 → ₹4,999 (annual)
Change: "Save ~33%" → "Save ~30%"

After completing all steps:
1. Run: npm run build (fix any TypeScript errors)
2. Run: npm run dev
3. Open http://localhost:3000 and verify the landing page loads with new colors
4. Open http://localhost:3000/login and verify it says "JustHustle" (not ReviewBoost)
5. Report what's working and any errors found
```

---

## Sprint 1 Prompt (After Sprint 0 Is Complete)

```
Context: Read docs/owner_scope.md, docs/design_system.md, design-system/MASTER.md, design-system/pages/dashboard.md

Task: Build the owner onboarding profile journey.

WHAT TO BUILD:

1. New page: src/app/(dashboard)/dashboard/profile-setup/page.tsx
   - This is a forced step after first login before accessing the dashboard
   - Collects: phone number, WhatsApp number (+91 format), GST number
   - Fields pre-filled where possible from Google auth data
   - Progress indicator (Step 1 of 1 — or show as "Complete your profile")
   - On save: POST /api/auth/update-profile → updates users table
   - On success: redirect to /dashboard/setup (first business) or /dashboard (if business exists)
   - Design: centered card, max-w-lg, use new design tokens (primary: #131842, accent: #E68369)
   - Framer Motion: fade-in entrance animation

2. New API route: src/app/api/auth/update-profile/route.ts
   - PATCH method
   - Updates: phone, whatsapp_phone fields in users table
   - Updates: GST number — add this column to owner_details if not present
   - Returns: { success: true }

3. Update middleware (src/middleware.ts):
   - After role check for /dashboard routes, also check if phone is set in users table
   - If phone is null AND user is hitting any /dashboard route EXCEPT /dashboard/profile-setup: redirect to /dashboard/profile-setup
   - If on /dashboard/profile-setup and profile IS complete: redirect to /dashboard

4. Update sync-profile (src/app/api/auth/sync-profile/route.ts):
   - Add isProfileComplete field to response (true if phone is set, false if not)
   - Auth callback should use this to decide where to redirect

Run the UI/UX Pro Max skill for the profile form before building:
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "onboarding profile form step SaaS" --domain ux --stack nextjs

Use Shadcn components: Input, Label, Button, Card
Use Framer Motion for entrance animation
Ensure fully responsive: works on 375px mobile
```

---

## How to Prompt Claude Code for Each Sprint

Use this template for every sprint after Sprint 0:

```
CONTEXT (read these first):
- docs/owner_scope.md (or customer/admin as relevant)
- docs/design_system.md
- design-system/MASTER.md
- design-system/pages/[page-name].md

RUN SKILL (before building any UI):
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[describe what you're building]" --domain [style/ux/chart] --stack nextjs

FOR DATABASE WORK (read this skill):
Reference: .agents/skills/supabase-postgres-best-practices/references/[relevant-file].md

TASK:
[Describe exactly what to build — be specific about:
- File paths to create or modify
- Component names
- Data to fetch (which Supabase tables/columns)
- Interactions and animations
- Which Shadcn components to use
- Responsive requirements (375px → 1280px)
]

AFTER BUILDING:
- Run npm run build and fix any TypeScript errors
- Test on mobile viewport (375px) and desktop (1280px)
- Report what's done and any issues
```

---

## Useful Reference Commands for Claude Code

```bash
# Run the design system skill
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[query]" --design-system --stack nextjs

# Run a domain-specific search
python3 .agent/skills/ui-ux-pro-max/scripts/search.py "[query]" --domain [style|ux|chart|typography|landing] --stack nextjs

# Add new Shadcn components as needed
npx shadcn@latest add [component-name]

# Check what Shadcn components are available
npx shadcn@latest add --help

# Type-check without building
npx tsc --noEmit

# Run dev server
npm run dev
```
