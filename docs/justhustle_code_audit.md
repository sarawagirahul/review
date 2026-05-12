# JustHustle — Code Audit Report

> Comparing existing codebase against finalized scope (Owner + Customer + Admin docs).
> Last audited: May 2026

---

## Legend
- ✅ **SOLID** — built correctly, keep as-is
- ⚠️ **NEEDS UPDATE** — exists but has wrong content, pricing, or minor bugs
- 🔨 **SCAFFOLDED** — page/route exists but is a placeholder ("coming soon")
- ❌ **MISSING** — doesn't exist at all, needs to be built from scratch
- 🐛 **BUG** — exists but broken in a way that affects the live experience

---

## Infrastructure & Config

| Item | Status | Notes |
|---|---|---|
| Next.js 16 + TypeScript | ✅ | Running Next 16.2.5, React 19 |
| Tailwind v4 (CSS-based config) | ✅ | Design tokens in globals.css |
| Supabase SSR client (browser + server) | ✅ | Correctly set up |
| Middleware (auth + role routing) | ✅ | Clean, complete |
| Framer Motion | ✅ | Installed, used |
| qrcode.react | ✅ | Installed (not wired up in UI) |
| canvas-confetti | ✅ | Installed |
| Gemini AI client | ✅ | Working |
| Razorpay | ✅ | Installed (routes scaffolded) |
| Resend | ✅ | Installed (route scaffolded) |
| **Charting library** | ❌ | **NOT installed** — recharts/chart.js needed for all dashboard charts |
| Package name | ⚠️ | Still `next-temp` in package.json — should be `justhustle` |

---

## Auth & Onboarding

| Item | Status | Notes |
|---|---|---|
| Google OAuth flow | ✅ | Correct callback at `/api/auth/callback` |
| sync-profile route | ✅ | Creates users + owner_details correctly, trial set to 7 days |
| Login page UI | ⚠️ | Good design but: (1) brand still says "ReviewBoost" not "JustHustle", (2) requests `business.manage` scope — should be `email + profile` only per Path A decision |
| **Owner profile journey page** | ❌ | **Entirely missing.** After signup, owner goes straight to setup without collecting phone, WhatsApp, GST. This page needs to be built. |
| Session duration (30 days) | ⚠️ | Not explicitly configured — default Supabase session, needs cookie max-age set to 30 days |

---

## Landing Page

| Item | Status | Notes |
|---|---|---|
| Navbar | ✅ | Responsive, glassmorphic on scroll, mobile menu works |
| Hero section | ⚠️ | Good design but has gradient background — violates design system rule ("hero must be clean white"). Fix: remove gradient divs |
| HowItWorks section | ✅ | Exists |
| Features section | ✅ | Exists |
| Pricing section | ⚠️ | **Wrong prices**: shows ₹999/month and ₹7,999/year. Must be ₹599/month and ₹4,999/year. Save label says ~33%, update to ~30% |
| Testimonials | ✅ | Exists |
| CTABanner | ✅ | Exists |
| Footer | ✅ | Correct branding (JustHustle + Goself) |
| `/privacy` page | ✅ | Exists (content needs legal review) |
| `/terms` page | ✅ | Exists (content needs legal review) |
| `/contact` page | ✅ | Exists |
| `/about` page | ✅ | Exists |

---

## Owner Dashboard

### Layout & Navigation
| Item | Status | Notes |
|---|---|---|
| Dashboard layout shell | ✅ | Sidebar, trial banner — well built |
| Trial banner (with countdown) | ✅ | Correctly calculates days remaining, colour-coded |
| Sidebar navigation | ⚠️ | Exists but sidebar items don't match final scope — missing Profile Settings, correct nav structure |
| Owner profile settings page | 🔨 | Settings page exists but is a placeholder: "Settings panel coming soon." |

### Dashboard Overview Page
| Item | Status | Notes |
|---|---|---|
| Page structure | ⚠️ | Exists but stats are hardcoded zeros for reviews + feedback |
| Total QR scans stat | ⚠️ | Reads from `businesses.total_scans` — column exists but is never incremented (events table is the real source) |
| Review clicks stat | 🐛 | Hardcoded `0` — never reads from DB |
| Private feedback stat | 🐛 | Hardcoded `0` — never reads from DB |
| Analytics charts | ❌ | None built — requires charting library |
| Conversion funnel | ❌ | Not built |
| Peak times heatmap | ❌ | Not built |
| Top performers panel | ❌ | Not built |
| Per-business breakdown table | ⚠️ | Shows businesses but no stats per row |
| Recent activity feed | ❌ | Not built |

### My Businesses
| Item | Status | Notes |
|---|---|---|
| Business list page | ✅ | Shows businesses correctly |
| Business list references `total_reviews`, `total_feedback` | 🐛 | These columns don't exist in schema — only `total_scans` exists. Will throw query errors |
| Add Business flow | ✅ | Setup wizard with mock GBP fallback |
| Add Business popup (Path A + disabled Path B) | ❌ | Currently goes to a separate `/dashboard/setup` page, not a popup — needs redesign per spec |

### Individual Business Page (`/dashboard/businesses/[id]`)
| Item | Status | Notes |
|---|---|---|
| Business detail page | ⚠️ | Exists, shows business info |
| Stats cards | 🐛 | Uses `NEXTAUTH_URL` env var (wrong — should be `NEXT_PUBLIC_APP_URL`) for the stats API call. Also event type keys are wrong (`qr_scan` vs `scan`) |
| **QR Code display** | 🐛 | Shows a grey placeholder box — `qrcode.react` is installed but not wired up here |
| QR Download | 🐛 | Button exists, not functional |
| QR nicknames | ❌ | No nickname system — schema has no QR codes table; all QRs are just one per business |
| Multiple QRs per business | ❌ | Schema has no `qr_codes` table — currently one QR per business only. Need new table. |
| Tab structure (QR / Shield / Reviews / Customisation / Settings / Competitor) | ❌ | No tabs exist — page is a single scrolling view |

### Business Tabs (all need building)
| Tab | Status | Notes |
|---|---|---|
| Tab 1: QR Codes | ❌ | Needs new `qr_codes` DB table + full UI |
| Tab 2: Shield Inbox | 🔨 | Feedback page exists but at wrong route (`/dashboard/feedback` not `/dashboard/businesses/[id]`) |
| Tab 3: Reviews | 🔨 | Placeholder "Reviews panel coming soon." |
| Tab 4: Customisation | ❌ | Not built |
| Tab 5: Settings (business-level) | ❌ | Not built (dashboard settings is account-level placeholder) |
| Tab 6: Competitor Analysis | ❌ | Not built |
| Tab 7: Social & Web | ❌ | Not built (Phase 2 placeholder needed) |

### Billing
| Item | Status | Notes |
|---|---|---|
| Billing page structure | ⚠️ | Exists with trial status detection |
| **Plan structure** | 🐛 | **Wrong plan model** — shows 3 tiers (Starter/Professional/Enterprise) at ₹499/999/2499. Should be single plan at ₹599/month + ₹4,999/year |
| Razorpay integration (frontend) | ❌ | Subscribe button not wired to Razorpay |
| Razorpay webhook | 🔨 | Route exists, needs full implementation |

---

## Customer Review Page (`/r/[slug]`)

| Item | Status | Notes |
|---|---|---|
| Server component + subscription check | ✅ | Correctly checks trial/subscription before rendering |
| Business data query | 🐛 | Doesn't fetch `google_place_id` or `review_link` — needed for Post button |
| Star rating component | ✅ | Exists in components/review/ |
| Review Shield gate (< 3 stars) | ✅ | Correctly routes to private feedback |
| Google One-Tap auth gate (Option B — post-rating) | ❌ | Not built. Currently no auth prompt at all on customer page |
| AI generation call | ✅ | Works (Gemini connected) |
| Language toggle (EN/HI/Hinglish) | 🐛 | Language hardcoded to `"english"` — toggle component exists but not wired |
| AI review cards with typewriter | ✅ | AIReviewCards component exists |
| Editable text area after card selection | ⚠️ | Need to verify this is wired correctly |
| Regenerate button | ⚠️ | In scope but needs verification |
| **Post to Google button** | 🐛 | **CRITICAL: uses `business.id` (Supabase UUID) not `google_place_id`** — opens broken Google page |
| Confetti on Post | ✅ | canvas-confetti called correctly |
| Thank you screen | ✅ | ThankYouScreen component exists |
| Scan event on page load | ❌ | Not tracked |
| AI generated event | ❌ | Not tracked |
| review_clicked event | 🐛 | Sends `event: "review_posted"` — doesn't match schema CHECK constraint |
| Insert into `reviews` table on Post | ❌ | Not implemented |
| Private feedback form (Shield) | ✅ | PrivateFeedbackForm component exists |
| Shield form uses `feedback_text` column | 🐛 | Schema has `message` column — mismatch |
| Marketing consent checkbox on thank you | ❌ | Not built |

---

## API Routes

| Route | Status | Notes |
|---|---|---|
| `POST /api/auth/sync-profile` | ✅ | Correct |
| `GET /api/auth/callback` | ✅ | Correct |
| `POST /api/auth/logout` | ✅ | Exists |
| `GET /api/google/locations` | ✅ | Works with mock fallback |
| `POST /api/businesses/create` | ✅ | Clean implementation |
| `PATCH /api/businesses/[id]` | ✅ | Exists |
| `GET /api/businesses/[id]/stats` | ⚠️ | Logic correct but uses wrong event type keys |
| `POST /api/ai/generate` | ✅ | Works — uses `GOOGLE_GENAI_API_KEY` (docs say `GEMINI_API_KEY`) |
| `POST /api/events/track` | ⚠️ | Route works but event types sent from client are wrong |
| `POST /api/feedback/submit` | ⚠️ | Route works but column name mismatch (`feedback_text` vs `message`) |
| `POST /api/razorpay/create-subscription` | 🔨 | Route exists, not implemented |
| `POST /api/razorpay/webhook` | 🔨 | Route exists, not implemented |
| `POST /api/resend/notify` | 🔨 | Route exists, not fully implemented |
| `POST /api/ai/generate-reply` | ❌ | Not built (Path B — GBP API) |
| `GET /api/google/reviews` | ❌ | Not built (Path B) |
| `POST /api/google/reviews/post-reply` | ❌ | Not built (Path B) |
| **All `/api/admin/**` routes** | ❌ | **None exist** |

---

## Missing Database Tables

Based on finalized scope, these tables need to be added to Supabase:

| Table | Purpose | Priority |
|---|---|---|
| `qr_codes` | Multiple QRs per business with nicknames + individual tracking | P1 |
| `marketing_consents` | Customer opt-in for Phase 4 campaigns (or add column to `reviews`) | P1 |

Existing `businesses` table also needs these columns added:
- `description` (TEXT) — for review page display
- `social_instagram` / `social_whatsapp` — OR rename existing columns to match code (schema drift)
- `review_page_thank_you_message` — OR rename `thank_you_message`

---

## New Packages Needed

```bash
npm install recharts          # Charts for dashboard analytics
npm install @react-email/components react-email  # Email templates
```

---

## Priority Bug Fix Order

Fix these before building anything new:

1. 🔴 **Login page scope** — remove `business.manage` from OAuth, keep `email + profile` only
2. 🔴 **Post to Google URL** — `business.id` → `business.google_place_id` in ReviewPageClient.tsx
3. 🔴 **Fetch `google_place_id` + `review_link`** in `/r/[slug]/page.tsx` server query
4. 🔴 **Event types** — align all client-sent event types with schema CHECK constraint
5. 🔴 **Billing page** — rebuild with correct single-plan pricing (₹599/₹4,999)
6. 🟡 **feedback_text → message** in feedback submit route + feedback page query
7. 🟡 **Remove `total_reviews` / `total_feedback` column references** — query from events table
8. 🟡 **Login page branding** — "ReviewBoost" → "JustHustle"
9. 🟡 **Hero gradient** — remove gradient background, keep clean white
10. 🟡 **Pricing numbers** — ₹999/7,999 → ₹599/4,999 on landing page

---

## What's Left to Build (Grouped by Priority)

### P1 — Core product, needed for first customer
- Owner profile journey page (phone, WhatsApp, GST collection)
- QR codes table + Tab 1 UI (nicknames, download, per-QR analytics)
- Actual QR code rendering in business detail (wire up qrcode.react)
- Tab 2: Shield Inbox (move from wrong route, build correctly)
- Tab 3: Reviews (Places API — 5 reviews, sync button, greyed reply)
- Tab 4: Customisation (logo, colours, tagline, description)
- Tab 5: Settings per business (contact, notifications)
- Tab 6: Competitor Analysis (Places API nearby search)
- Dashboard overview with real analytics + charts (install recharts)
- Add Business as popup (not separate page)
- Google One-Tap auth gate on customer review page (post-rating, Option B)
- Language toggle wired to AI API call
- Marketing consent checkbox on thank-you screen
- Insert into `reviews` table on Post click
- Scan + ai_generated events tracked
- Billing page rebuilt (₹599/₹4,999 single plan, Razorpay wired up)
- Razorpay webhook fully implemented
- Resend email templates (trial, feedback, payment)

### P2 — Admin panel (all new)
- Admin layout + sidebar
- Admin dashboard (platform stats)
- Owners management (list + detail + actions)
- Businesses management (list + detail + actions)
- Customers management (list + detail)
- Reviews & Feedback (platform-wide)
- Revenue page (Razorpay)
- Platform settings

### P3 — Customer profile
- `/profile` page (review history)
- Profile settings (edit name, WhatsApp)

### P4 — Phase 2 features
- GBP API integration (Path B unlock)
- Social analytics placeholders (Tab 7)
- WhatsApp notifications (Interakt)
