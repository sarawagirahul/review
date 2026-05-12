# JustHustle — Customer Side: Finalized Scope v1.0

> Covers the end-user (customer) experience from QR scan to completion.
> Status: **Finalized**

---

## 1. Entry Point

Customer scans a QR code (at a restaurant table, front counter, receipt, window sticker, etc.)
→ Phone opens `justhustle.in/r/[qr_slug]`
→ Server checks business status before rendering anything:

| Business status | What customer sees |
|---|---|
| Active + trial/subscription valid | Full AI review experience (this document) |
| Trial expired / subscription lapsed | Basic fallback: business name + "Leave a Google Review →" deep link |
| Business deactivated by owner | Same basic fallback |

The QR never 404s. A physical sticker on the wall must always resolve to something useful.

---

## 2. Review Page (`/r/[slug]`) — What the Customer Sees

**Rendered server-side (SSR) for fast mobile load.**

Page elements, top to bottom:
- Business logo (if uploaded by owner)
- Business name (always shown)
- Business description / tagline (owner-customised in Customisation tab — e.g., "Mumbai's favourite biryani since 2009")
- Headline prompt: "How was your experience today?"
- 5 animated star buttons

Branding (logo, primary colour, secondary colour) pulled from business customisation settings — every business looks like its own branded page, not a generic JustHustle template.

---

## 3. Authentication Gate (Option B — Post-Rating)

Customer taps their star rating first. **Then**, before AI generation begins, a sign-in prompt appears:

> "Sign in to save your review history and unlock rewards coming soon"
> [Continue with Google] [Skip for now →]

**If customer signs in:**
- Google One-Tap — minimal friction
- Session persists for 30 days (auto-refreshing cookie)
- On first sign-in: row created in `users` table with `role = 'customer'`
- All subsequent events on this session linked to `customer_id`

**If customer skips:**
- Flow continues anonymously
- Events tracked without `customer_id`
- Cannot earn rewards later (Phase 3/4 implication)
- Can review without restriction

The gate must feel inviting, not blocking. "Skip for now" must be clearly visible — this is never a hard wall.

---

## 4. Happy Path — 3, 4, or 5 Stars

### Step 1: AI Generation
Immediately after rating (and sign-in gate), call `POST /api/ai/generate`:
```
{
  businessName: string,
  city: string,
  rating: 3 | 4 | 5,
  language: 'english' | 'hindi' | 'hinglish'
}
```
Gemini 2.5 Flash generates **3 distinct review options**.

**Tone is automatic, based on star count:**
| Stars | Tone |
|---|---|
| 5 ★ | Enthusiastic, warm, highly recommending |
| 4 ★ | Positive, appreciative, specific |
| 3 ★ | Measured, fair, constructive |

Event tracked: `ai_generated` → `review_events`

### Step 2: Language Toggle
Customer can switch language at any time before posting.
Options: **English / हिंदी / Hinglish**
Switching language re-calls the API and regenerates all 3 options in the new language.

### Step 3: Review Selection & Editing
- 3 AI-generated cards displayed (typewriter animation as they appear)
- Customer taps any card → text drops into an **editable text area** below the cards
- Customer can:
  - Edit the text freely (no restrictions)
  - Tap **"Regenerate"** to get 3 fresh options (re-calls API, same language + star count)
  - Switch between cards (selecting a different card updates the text area)

### Step 4: Post to Google
Customer taps **"Copy & Post to Google →"**

Simultaneously, in this exact order:
1. `navigator.clipboard.writeText(selectedReviewText)` — copies to clipboard
2. `window.open(business.review_link, '_blank')` — opens Google Maps write-review dialog in new tab (using `google_place_id`)
3. `POST /api/events/track` — event: `review_clicked`, with `business_id`, `customer_id` (if signed in), `rating`, `language`, `qr_slug`
4. `POST /api/reviews` — insert row into `reviews` table: `customer_id`, `business_id`, `rating`, `ai_generated_options` (all 3), `final_text` (what was in the text area), `language`, `submitted_to_google: true`
5. Confetti fires immediately (`canvas-confetti` — 150 particles, amber + white)

### Step 5: Thank You Screen
Appears 500ms after Post click (after confetti has started):

```
🎉 Your review is copied!

Switch to Google and paste it → tap Submit to publish.

[Business Logo]  [Business Name]
```

No further CTAs needed in Phase 1. Screen stays up until customer navigates away.

**On Google Maps (customer's action, outside our platform):**
Customer long-presses text field → Paste → Submit
Review is published from their own Google account. ✅

---

## 5. Shield Path — 1 or 2 Stars

Review Shield intercepts low ratings before they can reach Google.

### What the customer sees
Smooth transition (Framer Motion) — no jarring page change. The star rating UI slides away and a private feedback form appears:

> "We're sorry to hear that 😔  
> Please share what went wrong — the team at **[Business Name]** will personally reach out."

**Feedback form fields:**
- Message (required) — with an option: "Write my own" or "Help me write it" (AI-assisted using same Gemini call, negative tone, constructive language)
- Name (optional)
- Contact number or email (optional — for the business to follow up)

CTA: **"Send to [Business Name]"** — never says "Post to Google" or "Publish"

### What happens on submit
1. `POST /api/feedback/submit` — inserts into `private_feedback` table: `business_id`, `customer_id` (if signed in), `rating`, `message`, `customer_name`, `customer_contact`
2. `POST /api/events/track` — event: `feedback_submitted`
3. Resend email to owner's notification email for this business:
   > Subject: ⚠️ New private feedback for [Business Name]
   > Body: rating, message, customer contact (if provided), timestamp
4. Feedback appears in owner's Shield Inbox (Tab 2) marked as Open

### Thank You Screen (Shield path)
No confetti — this is a sensitive moment.

> "Thank you for letting us know.  
> The team at **[Business Name]** will review your feedback and follow up with you."

Warm, simple, no CTAs.

---

## 6. Data Captured Across the Full Journey

| Event | Trigger | Table | Notes |
|---|---|---|---|
| `scan` | Page loads | `review_events` | Always tracked, anonymous or identified |
| `ai_generated` | Gemini returns | `review_events` | Includes language, rating |
| `review_clicked` | Post button tapped | `review_events` + `reviews` | Best proxy for "review posted on Google" |
| `regenerate_clicked` | Regenerate button | `review_events` | Tracks how many customers needed new options |
| `feedback_submitted` | Shield form submit | `review_events` + `private_feedback` | 1-2 star path |

**Dashboard funnel (what owner sees):**
Scans → AI Generated → Clicked Post to Google

Labelled clearly as "Clicked Post" not "Confirmed Posted" — honest about the gap between click and actual Google submission.

---

## 7. Customer Profile — Phase 1 (Minimal)

Route: `/profile`

**Accessible only when signed in.** Redirects to `/login` if not.

**What it shows:**
- Customer name + profile photo (from Google)
- Review history: list of all businesses reviewed via JustHustle — business logo, name, star rating given, date
- "No reviews yet" empty state with prompt to scan a QR

**What it does NOT show in Phase 1:**
- Points balance (Phase 3/4)
- Coupons / rewards (Phase 3/4)
- Redemption options (Phase 3/4)

This page exists in Phase 1 primarily to give customers a reason to stay signed in and to establish the data relationships (customer ↔ business) needed for Phase 3/4 campaigns and fuzzy matching.

---

## 8. Fuzzy Match Logic (activates when GBP API approved)

When owner syncs Google reviews via GBP API, for each incoming review:
1. Check our `reviews` table: all rows for this business where `submitted_to_google = true`, within ±7 days of the Google review date
2. Run string similarity (Levenshtein) between Google reviewer display name and `users.full_name`
3. If similarity > 75%: mark `google_reviews.matched_customer_id`
4. Show in owner's Reviews tab as "Possible Match: Shyam K." with disclaimer

In Phase 1 (no GBP API): events and reviews rows are still captured faithfully so the retroactive match works when GBP is approved.

---

## 9. Known Bugs — Fix Before Any Launch

These are confirmed bugs in the existing codebase that will break the customer flow today:

| # | Bug | File | Fix |
|---|---|---|---|
| 1 | **CRITICAL:** Google deep-link uses `business.id` (Supabase UUID) instead of `business.google_place_id` | `ReviewPageClient.tsx` line ~90 | Change to `business.google_place_id`. Also add `google_place_id` and `review_link` to the server query in `page.tsx` |
| 2 | Event type `review_posted` fails DB CHECK constraint | `ReviewPageClient.tsx` | Change to `review_clicked` |
| 3 | Language hardcoded to `"english"` | `ReviewPageClient.tsx` | Wire up language toggle state to API call |
| 4 | `social_instagram` / `social_whatsapp` in review page don't match DB column names `instagram_url` / `whatsapp_business` | `ReviewPageClient.tsx` + `page.tsx` | Align field names — verify against actual Supabase schema |
| 5 | No `scan` event tracked on page load | `ReviewPageClient.tsx` | Add `useEffect` that fires `POST /api/events/track` with `event: 'scan'` on mount |
| 6 | No row inserted into `reviews` table on Post click | `ReviewPageClient.tsx` | Add insert call alongside the event track call |
| 7 | `review_link` not fetched in server query | `r/[slug]/page.tsx` | Add `review_link`, `google_place_id`, `city` to the Supabase select |

---

## 10. Out of Scope — Phase 3/4

| Feature | Phase |
|---|---|
| Points / coins system | 3 |
| Coupon generation by owner | 3 |
| Auto-coupon assignment on review | 3 |
| Customer rewards / wallet page | 3 |
| Points redemption | 4 |
| Targeted marketing campaigns | 4 |
| WhatsApp offers to customers | 4 |

---

## 11. Customer Scope — Confirmed Decisions

| Decision | Confirmed |
|---|---|
| Sign-in gate | Option B — after star tap, before AI generation |
| Sign-in type | Google One-Tap |
| Sign-in mandatory? | No — always skippable |
| Session duration | 30 days |
| AI options shown | 3 (typewriter animation) |
| Language toggle | EN / HI / Hinglish |
| Editing | Yes — selected card drops into editable text area |
| Regenerate | Yes — re-calls API, same language + rating |
| Post mechanism | Clipboard copy + Google deep-link (new tab) |
| Confetti | Yes — fires immediately on Post click |
| Review Shield threshold | < 3 stars (1 or 2) |
| Shield feedback | Manual or AI-assisted, sent privately to business |
| Shield CTA | "Send to [Business Name]" — never "Post to Google" |
| Rewards / points | Phase 3/4 — not in Phase 1 |
