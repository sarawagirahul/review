# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: JustHustle

A B2B SaaS platform that helps Indian small/medium businesses collect more 5-star Google reviews via AI-generated review drafts delivered through QR codes. Business owners place a QR in their shop → customers scan → get 3 AI-generated review options → submit to Google in under 30 seconds.

**Key Features:** Review Shield (catches negative reviews as private feedback instead of posting), AI reply generator for existing reviews, Razorpay subscription billing, multi-business support per owner.

**Users:** Super Admin | Business Owner | Customer/Reviewer

## Getting Started

**Prerequisites:** Node.js 18+, npm/yarn

```bash
npm install                    # Install dependencies
cp .env.example .env.local     # Create env file (ask Rahul for secret values)
npm run dev                    # Start dev server at http://localhost:3000
npm run build                  # Build for production
npm run lint                   # Check TypeScript + ESLint
```

Website runs on `localhost:3000`. No tests configured yet (Phase 1).

## File Structure

Code lives in `src/`:
- `src/app/` — Next.js app router (pages, layouts, API routes). Routes grouped by feature using `(group)` folders
- `src/components/` — React components organized by feature (landing/, dashboard/, review/)
- `src/lib/` — Shared utilities: Supabase client, Google API wrappers, Gemini client, email templates
- `src/middleware.ts` — Auth + role-based route protection (runs on every request)
- `src/types/` — TypeScript types (database.ts is auto-generated from Supabase)
- `docs/` — Complete product + technical documentation (read first)

Routes follow this structure:
- `(marketing)` — Public landing pages (/, /about, /privacy, /terms) — SSR
- `(auth)` — Public auth pages (/login, /auth/callback) — SSR
- `(dashboard)` — Protected owner pages (/dashboard/...) — CSR
- `(admin)` — Protected admin pages (/admin/...) — CSR
- `(customer)` — Protected customer pages (/profile) — CSR
- `r/[slug]` — Customer review page (public, SSR, one page per business QR)

## Critical Architecture Rules (From AGENTS.md + Docs)

### Rule 1: Next.js 16.2.5 with Breaking Changes
**This is NOT standard Next.js from your training data.** APIs, conventions, and file structure may differ. Before writing any code:
- Read `node_modules/next/dist/docs/` for the actual behavior
- Check the docs/ folder in this repo
- Heed all deprecation warnings
- When in doubt about APIs, always verify in Next 16 docs

### Rule 2: Supabase = Database Only
Supabase is used EXCLUSIVELY as:
- Postgres database (via `@supabase/supabase-js` client library)
- OAuth provider (Google sign-in)
- File storage (logo uploads)

**NEVER use:**
- Supabase Edge Functions ❌
- Supabase Realtime ❌
- Supabase triggers/hooks ❌
- Supabase background jobs ❌

All business logic lives in Next.js API Routes (`src/app/api/**`). This keeps the backend portable and testable.

### Rule 3: 3-Layer Security Model
Authentication and authorization use **defense in depth**:

```
Layer 1: Next.js Middleware (edge-computed)
  → Runs before page renders
  → Checks session cookie, validates JWT
  → Redirects based on role (owner/admin/customer)
  
Layer 2: Page/API route server check
  → Verifies user actually owns the requested resource
  → Validates business_id, parent relationship, etc.
  
Layer 3: Supabase RLS (Row-Level Security) policies
  → Database physically refuses cross-user data access
  → Works even on direct API calls (defense if layer 2 fails)
```

Always implement all 3 layers. See `src/middleware.ts` + any `/api/**/route.ts` for patterns.

### Rule 4: Rendering Strategy (SSR vs CSR)
```
/                               → SSR (static, SEO critical)
/about, /privacy, /terms        → SSR (static, SEO)
/r/[slug] (customer review)     → SSR (dynamic, SEO + performance)
/login, /auth/callback          → SSR (simple, fast)
/dashboard/** (owner dashboard) → CSR (rich web app, no SEO)
/admin/** (admin panel)         → CSR (admin tool, no SEO)
/profile (customer profile)     → CSR (personal data)
```
Never mix SSR and client-side data fetching in the same page.

### Rule 5: Google OAuth Must Include Offline Access
To get refresh tokens (needed for Google My Business API calls later):
```typescript
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
      scope: 'profile email https://www.googleapis.com/auth/business.manage'
    }
  }
})
```

### Rule 6: Review Posting Uses Deep-Link + Clipboard
Google forbids programmatic review posting via API. We use:
1. Customer rates business + picks a review option
2. Review text is copied to clipboard: `navigator.clipboard.writeText(selectedReview)`
3. Deep-link opens Google Maps: `window.open('https://search.google.com/local/writereview?placeid=ChIJ...')`
4. Customer pastes (Ctrl+V) and submits manually on Google
5. Confetti fires **immediately on button tap** (rewards intent), not after Google submission

### Rule 7: Review Shield: <3 Stars = Private Feedback
Negative reviews are intercepted before they reach Google:
```typescript
if (rating < 3) {
  // Show private feedback form (Review Shield)
  // Never show the Google link
} else {
  // Show AI-generated review options
  // Show "Post to Google" button
}
```

### Rule 8: Supabase Type Safety
Generated Supabase types live in `src/types/database.ts`. Regenerate when schema changes:
```bash
npm install -g supabase  # One-time
supabase gen types typescript \
  --project-id rhsjbcvnwjxhftifzbkc > src/types/database.ts
```

## Common Development Tasks

### Add a New API Route
1. Create file: `src/app/api/[feature]/[action]/route.ts`
2. Export `POST(request)`, `GET(request)`, etc.
3. Get authenticated user: `const { data: { user } } = await supabase.auth.getUser()`
4. Validate user owns the resource (layer 2 check)
5. Interact with database via Supabase client
6. Return `NextResponse.json()` or handle errors

Example:
```typescript
export async function POST(request: Request) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  
  // Fetch and validate ownership
  const { data: business } = await supabase
    .from('businesses')
    .select('owner_id')
    .eq('id', body.business_id)
    .single()
  
  if (business.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Proceed with operation...
  return NextResponse.json({ success: true })
}
```

### Add a New Dashboard Page
1. Create: `src/app/(dashboard)/dashboard/[feature]/page.tsx`
2. Middleware automatically protects `/dashboard/**` — only owners can access
3. Use `'use client'` if you need client-side state
4. Fetch data from API routes, NOT directly from Supabase client
5. Pages in `(dashboard)` layout have sidebar + auth guard

### Styling & UI
- **Tailwind CSS v4** (see `tailwind.config.ts`)
- **Framer Motion** for animations
- **Lucide React** for icons
- **canvas-confetti** for confetti effects
- Build reusable components in `src/components/ui/`

### Email Notifications (Resend)
1. Define React email template in `src/lib/email/templates.ts`
2. Send via API: `POST /api/resend/notify` with template name + data
3. Emails go to business owner when: trial ending, new feedback, payment failed

### Razorpay Subscription Webhook
1. Payment webhook handler: `src/app/api/razorpay/webhook/route.ts`
2. Validates signature with `RAZORPAY_WEBHOOK_SECRET` env var
3. Updates subscription status in database on success/failure
4. Webhook URL: `https://[domain]/api/razorpay/webhook`
5. Register in Razorpay Dashboard → Settings → Webhooks

## Environment Variables

See `docs/07_ENVIRONMENT_VARIABLES.md` for complete list. Minimum for local dev:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=...
```

Copy `.env.example` to `.env.local`. Ask Rahul for actual secret values (never commit them).

## Documentation Map

Start here when beginning a sprint or feature:
1. **`docs/00_README.md`** — Project overview + quick facts
2. **`docs/01_PRODUCT_REQUIREMENTS.md`** — What we're building + user types + pricing model
3. **`docs/02_USER_FLOWS.md`** — How each user type interacts with the app
4. **`docs/03_TECHNICAL_ARCHITECTURE.md`** — Tech stack + architecture decisions + folder structure
5. **`docs/04_DATABASE_SCHEMA.md`** — Postgres schema + RLS policies
6. **`docs/05_API_ROUTES.md`** — All backend endpoint specs
7. **`docs/06_PHASES.md`** — Sprint breakdown (Phase 1 has 11 sprints)
8. **`docs/09_PROGRESS.md`** — Current sprint status

## Key Database Info

**Supabase Project:** `rhsjbcvnwjxhftifzbkc.supabase.co`

**Main Tables:**
- `users` — App users (owner/admin/customer), stores role
- `businesses` — Business locations linked to owners
- `reviews` — Customer reviews (draft state)
- `feedback` — Private feedback (Review Shield catches)
- `subscriptions` — Owner billing info + trial tracking
- `events` — Analytics (QR scans, review clicks)

See `docs/04_DATABASE_SCHEMA.md` for full schema + RLS policies.

## Git Workflow

- **Branch naming:** `feature/name` or `fix/name`
- **Main branch:** `main`
- **Commit style:** Keep commits small, one feature per PR
- **Never commit:** `.env.local`, API keys, secrets, `node_modules/`

## Common Pitfalls

❌ **Don't use Supabase Edge Functions** — all logic in `/api/**`  
❌ **Don't skip RLS policies** — every table needs row-level security  
❌ **Don't trust user input** — validate on backend + RLS layer  
❌ **Don't skip layer 2 checks** — always verify user owns resource  
❌ **Don't hardcode API keys** — use environment variables  
❌ **Don't call Supabase client from client components** — use API routes  
❌ **Don't mix SSR + CSR on same page** — pick one  

## Debugging

- **Supabase logs:** Dashboard → Project Settings → Logs
- **Next.js logs:** `npm run dev` shows server output
- **Browser console:** F12 → Console for client errors
- **Network requests:** DevTools → Network tab
- **RLS policies:** Supabase Dashboard → SQL Editor (test as specific user)
- **TypeScript errors:** `npm run lint`

## When Stuck

1. Check the relevant doc in `docs/` — it's very complete
2. Look at existing code in `src/app/api/` + `src/components/` for patterns
3. Read AGENTS.md about Next.js 16 breaking changes
4. Check the git log for recent changes
5. Ask Rahul directly (context > guessing)
