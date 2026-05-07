# Development Phases

## Phase 1 — Core MVP
**Goal:** Functional product that a business owner can sign up for, get a QR code, and start collecting reviews.

---

### Sprint 1: Project Setup + Landing Page + Login
**Estimated time:** 2-3 days

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Install all dependencies:
  ```
  @supabase/supabase-js @supabase/ssr framer-motion lucide-react
  qrcode.react @google/generative-ai razorpay resend
  canvas-confetti @types/canvas-confetti
  ```
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Set up Google Fonts (Inter + Bricolage Grotesque)
- [ ] Create global CSS with glassmorphism utilities
- [ ] Build Landing Page sections:
  - [ ] Navbar (floating, glassmorphic)
  - [ ] Hero section (animated, strong CTA)
  - [ ] How It Works (3-step animated flow)
  - [ ] Features bento grid (6 cards)
  - [ ] Review Shield dedicated section
  - [ ] Pricing section (Monthly / Annual toggle, ₹ pricing)
  - [ ] Testimonials (3 cards)
  - [ ] CTA banner
  - [ ] Footer
- [ ] Build static pages (Required for Google API approval):
  - [ ] `/privacy` (Privacy Policy)
  - [ ] `/terms` (Terms & Conditions)
  - [ ] `/contact` (Contact Us)
- [ ] Build Login page (`/login`)
  - [ ] Glassmorphic card layout
  - [ ] "Sign in with Google" button
  - [ ] Animated background orbs
- [ ] SEO: meta tags, OG image, title tags

---

### Sprint 2: Supabase Schema + Auth + Middleware
**Estimated time:** 1-2 days

- [ ] Apply full database migration (see `04_DATABASE_SCHEMA.md`)
- [ ] Set up Supabase client (browser + server)
- [ ] Configure Google OAuth in Supabase with `business.manage` + `offline_access`
- [ ] Build `/auth/callback` route handler
- [ ] Build `POST /api/auth/sync-profile` route
- [ ] Write `middleware.ts` with role-based route protection
- [ ] Build dashboard layout shell (`(dashboard)/layout.tsx`):
  - [ ] Glassmorphic sidebar with nav items
  - [ ] User avatar + name
  - [ ] Active route highlighting
  - [ ] Mobile responsive (collapsible sidebar)
- [ ] Trial expiry check in dashboard layout

---

### Sprint 3: Google My Business API + Setup Wizard
**Estimated time:** 2-3 days

- [ ] Set up Google Cloud Console:
  - Enable Google My Business Business Information API
  - Enable Google My Business Account Management API
  - Create OAuth 2.0 credentials
  - Configure consent screen (Testing mode)
- [ ] Build `GET /api/google/locations` with OAuth token refresh
- [ ] Implement mock location data for dev (before API approval)
- [ ] Build Setup Wizard (`/dashboard/setup`):
  - [ ] Step 1: Location picker (fetches from GBP API)
  - [ ] Step 2: Contact + social links form
  - [ ] Step 3: QR ready screen
- [ ] Build `POST /api/businesses/create`
- [ ] Build QR code display with `qrcode.react`
- [ ] Build QR download (PNG + PDF)
- [ ] Build `PATCH /api/businesses/[id]`

---

### Sprint 4: Customer Review Page + AI + Review Shield
**Estimated time:** 2-3 days  
**This is the most critical sprint.**

- [ ] Build `/r/[slug]` page (SSR, mobile-first)
  - [ ] Load business data by slug
  - [ ] Business name + logo display
  - [ ] Inactive/expired fallback: basic Google review link
- [ ] Star Rating component:
  - [ ] 5 animated stars
  - [ ] Tap to select, hover effects, amber glow
- [ ] Review Shield gate logic (< 3 stars triggers private form)
- [ ] Build `POST /api/ai/generate` with Gemini 2.5 Flash
  - [ ] English, Hindi, Hinglish prompts
  - [ ] Returns 3 distinct review options
- [ ] AI Review Cards:
  - [ ] Typewriter animation (Framer Motion)
  - [ ] Language toggle (EN / HI / Hinglish)
  - [ ] Select + inline edit
  - [ ] Regenerate button
- [ ] "Post to Google" button:
  - [ ] Clipboard copy
  - [ ] Open review deep-link in new tab
  - [ ] `POST /api/events/track` (event: review_clicked)
- [ ] Confetti animation on button tap (canvas-confetti)
- [ ] Thank You screen:
  - [ ] Confetti + message
  - [ ] Social CTAs (Instagram, WhatsApp)
- [ ] Private Feedback Form (Review Shield):
  - [ ] Smooth transition animation
  - [ ] Form fields
  - [ ] `POST /api/feedback/submit`
  - [ ] Resend email to owner
- [ ] Google One-Tap sign-in for customers
- [ ] Customer session caching (30-day cookie)

---

### Sprint 5: Owner Dashboard + Multi-Business + Analytics
**Estimated time:** 1-2 days

- [ ] Build `/dashboard` overview page:
  - [ ] Aggregate stats cards (all businesses)
  - [ ] Business cards with QR thumbnails
  - [ ] "Add Another Business" CTA
- [ ] Build `/dashboard/businesses` list page
- [ ] Build `/dashboard/businesses/[id]` page:
  - [ ] QR display + download
  - [ ] 30-day scan analytics chart
  - [ ] Review clicks + feedback count
  - [ ] Business settings link
- [ ] Build `/dashboard/businesses/[id]/settings` page:
  - [ ] Edit contact info, social links
  - [ ] Logo upload (Supabase Storage)
  - [ ] QR customization (colors, frame text, style)
  - [ ] Review page tagline, thank-you message
- [ ] Build `/dashboard/feedback` page:
  - [ ] List all private feedback across businesses
  - [ ] Mark as resolved
  - [ ] Filter by business / status
- [ ] Build `GET /api/businesses/[id]/stats`

---

### Sprint 6: Google Reviews + AI Reply
**Estimated time:** 1-2 days

- [ ] Build `GET /api/google/reviews` with caching
- [ ] Build `POST /api/ai/generate-reply`
- [ ] Build `POST /api/google/reviews/post-reply`
- [ ] Build `DELETE /api/google/reviews/delete-reply`
- [ ] Build `POST /api/google/reviews/flag`
- [ ] Build `/dashboard/businesses/[id]/reviews` page:
  - [ ] Reviews list with filter (all / unanswered / by rating)
  - [ ] Per-review: generate reply, edit, post reply
  - [ ] "Sync Now" button + last synced timestamp
  - [ ] Reply status badges
  - [ ] UI Badge: "Fuzzy Matched" for reviews linked to internal users (with disclaimer)
- [ ] Implement Fuzzy Match Logic on sync: Attempt to match fetched Google review names with our `reviews` table. Mark matched records.

---

### Sprint 7: Razorpay + Trial Management
**Estimated time:** 1-2 days

- [ ] Set up Razorpay account + plan IDs (monthly + annual)
- [ ] Build `POST /api/razorpay/create-subscription`
- [ ] Build `POST /api/razorpay/webhook`
- [ ] Build `/dashboard/billing` page:
  - [ ] Trial countdown banner
  - [ ] Plan selection cards (Monthly / Annual)
  - [ ] Current subscription status
  - [ ] Cancel subscription option
- [ ] Trial expiry enforcement:
  - [ ] Dashboard shows upgrade banner after Day 7
  - [ ] `/r/[slug]` shows basic fallback when expired

---

### Sprint 8: Email Notifications (Resend)
**Estimated time:** 1 day

- [ ] Set up Resend account + verify domain
- [ ] Build email templates (React Email):
  - [ ] Trial Ending (Day 5 warning)
  - [ ] Trial Expired (Day 7)
  - [ ] New Private Feedback
  - [ ] Payment Failed
- [ ] Build `POST /api/resend/notify`
- [ ] Integrate notifications into:
  - [ ] `POST /api/feedback/submit` → send to owner
  - [ ] `POST /api/razorpay/webhook` → payment failed email
  - [ ] Cron job for trial emails (manual trigger initially)

---

### Sprint 9: Admin Panel
**Estimated time:** 2 days

- [ ] Build `(admin)/layout.tsx` (admin sidebar + auth guard)
- [ ] Build all admin API routes (`/api/admin/**`)
- [ ] Build `/admin/dashboard` (platform stats)
- [ ] Build `/admin/owners` (list + search)
- [ ] Build `/admin/owners/[id]` (profile + businesses)
- [ ] Build `/admin/customers` (list + search)
- [ ] Build `/admin/customers/[id]` (profile + review history)
- [ ] Build `/admin/businesses` (list)
- [ ] Build `/admin/feedback` (all private feedback)
- [ ] Build `/admin/revenue` (Razorpay data)

---

### Sprint 10: Customer Profile + WhatsApp OTP
**Estimated time:** 1 day

- [ ] Build `/profile` page (customer review history)
- [ ] Build `/profile/settings` page (edit name, WhatsApp)
- [ ] Build `POST /api/auth/whatsapp/send-otp`
- [ ] Build `POST /api/auth/whatsapp/verify-otp`
- [ ] WhatsApp OTP UI component in settings

---

### Sprint 11: Polish + Legal + Deploy
**Estimated time:** 1-2 days

- [ ] `/privacy` static page (legal, required for Google API)
- [ ] `/terms` static page
- [ ] Mobile QA: test all screens on iPhone Safari
- [ ] Performance: image optimization, lazy loading
- [ ] Error boundaries on all pages
- [ ] Loading states everywhere
- [ ] Empty states (no businesses, no reviews, no feedback)
- [ ] 404 page
- [ ] Deploy to Vercel
- [ ] Set all env vars in Vercel dashboard
- [ ] Set up Razorpay webhook URL (Vercel URL)
- [ ] Final end-to-end QA pass

---

## Phase 2 — Growth Features
**Start after Phase 1 is live and first paying customers onboarded.**

- [ ] WhatsApp notifications via Interakt (owner alerts)
- [ ] Tiered pricing (Silver / Gold / Platinum) with feature gating
- [ ] "Money Saved" dashboard metric
- [ ] QR kiosk templates (printable PDF designs)
- [ ] Advanced analytics (language breakdown, time-of-day scans)
- [ ] Review velocity tracking (are we getting more reviews over time?)
- [ ] Bulk email campaigns to trial users
- [ ] Referral program
- [ ] API for third-party integrations

---

## Phase 3 — Scale
**Start after reaching 100+ paying customers.**

- [ ] Mobile app (React Native)
- [ ] White-label option for agencies
- [ ] Multi-language admin panel
- [ ] Public API for third-party developers
- [ ] Separate Express.js backend (if needed)
- [ ] Enterprise plan with custom pricing
- [ ] Dedicated onboarding for large businesses
