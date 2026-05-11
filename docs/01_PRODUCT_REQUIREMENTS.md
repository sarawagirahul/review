# Product Requirements Document (PRD)

## 1. Product Overview

**Name:** ReviewBoost  
**Target Market:** Indian small and medium businesses registered on Google Business Profile  
**Core Problem:** Most customers never leave a review even when they have a great experience. Writing a review takes effort. ReviewBoost removes that friction entirely.

**Core Value Props:**

1. Customer scans QR → AI writes the review → Customer posts in under 30 seconds
2. Review Shield — negative reviews (< 3 stars) are intercepted privately, never reaching Google
3. Business owners reply to all Google reviews using AI-generated professional responses

---

## 2. User Types

### Type 1: Super Admin (Product Owner)

- Full CRUD over all data
- Sees platform-wide analytics (revenue, users, businesses)
- Can deactivate/delete any account
- Access: `/admin/**`

### Type 2: Business Owner (e.g. Rahul)

- Registers via Google OAuth
- Links one or more Google Business locations
- Gets unique QR code per business
- Manages reviews, replies, private feedback
- Pays via Razorpay subscription
- Access: `/dashboard/**`

### Type 3: Customer/Reviewer (e.g. Shyam)

- Scans QR code at a physical shop
- Signs in with Google One-Tap (session cached 30 days)
- Rates the business, picks AI-generated review, submits to Google
- Can view their review history on their profile
- Access: `/r/[slug]` and `/profile`

---

## 3. Pricing (v1 — Simple)

| Plan    | Price       | Billing                                 |
| ------- | ----------- | --------------------------------------- |
| Trial   | Free        | 7 days, full features, no card required |
| Monthly | ₹999/month  | Razorpay recurring                      |
| Annual  | ₹7,999/year | Razorpay recurring (save ~33%)          |

All paid plans include ALL features. No feature gating in v1.

**After trial expires:** User drops to a "paused" state. Dashboard shows upgrade prompt. The `/r/[slug]` QR page still works but shows a basic "Review on Google" link without AI generation.

**Phase 2:** Introduce Silver/Gold/Platinum tiered pricing with feature gating.

---

## 4. Core Features (v1 — Phase 1)

### Business Owner Features

- [ ] Google OAuth sign-in with `business.manage` scope + `offline_access`
- [ ] Auto-fetch Google Business Profile locations matching owner's email
- [ ] Select and link a location to ReviewBoost
- [ ] Multi-business: link unlimited locations per account
- [ ] Unique UUID-based QR code generated per business
- [ ] QR customization: colors, embedded logo, frame text, frame style
- [ ] QR download: PNG and PDF
- [ ] Owner dashboard: total scans, review clicks, feedback received
- [ ] Private feedback inbox (Review Shield catches)
- [ ] Fetch existing Google reviews for their business
- [ ] AI-generated replies to Google reviews (one click → Gemini → post via API)
- [ ] Fuzzy Match Verification: Attempt to match fetched Google reviews with users who clicked "Post to Google" (UI disclaimer: "Match is approximate")
- [ ] Flag reviews as inappropriate
- [ ] Razorpay subscription (monthly + annual)
- [ ] Trial → paid flow with Razorpay
- [ ] Resend email notifications:
  - Trial ending (Day 5 warning, Day 7 expired)
  - New private feedback received
  - Payment failed

### Customer/Reviewer Features

- [ ] Mobile-first review page at `/r/[slug]`
- [ ] Google One-Tap sign-in (cached session)
- [ ] 5-star rating selector with animations
- [ ] AI generates 3 review options (Gemini 2.5 Flash)
- [ ] Language toggle: English / Hindi / Hinglish
- [ ] Regenerate: get 3 fresh AI options
- [ ] Review selection + inline editing
- [ ] "Post to Google" button:
  - Copies text to clipboard automatically
  - Opens Google Maps write-review deep link in new tab
- [ ] Confetti animation fires immediately on button tap
- [ ] Thank You page: confetti + instruction + social CTAs
- [ ] Review Shield: rating < 3 → private feedback form instead of Google link
- [ ] WhatsApp number entry + OTP verification (via Interakt)
- [ ] Customer profile page: view all past reviews across businesses

### Admin Features

- [ ] Platform dashboard: total owners, customers, businesses, revenue
- [ ] CRUD: business owners (view, edit, deactivate, delete)
- [ ] CRUD: businesses (view, deactivate, delete)
- [ ] CRUD: customers (view, edit, deactivate, delete)
- [ ] View any customer's review history across all businesses
- [ ] View all private feedback (all businesses)
- [ ] Revenue analytics (Razorpay data: MRR, active subs, churn)
- [ ] View all review replies posted via ReviewBoost

---

## 5. Key Technical Rules

### Rule 1: Google OAuth with offline_access

```typescript
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    queryParams: {
      access_type: "offline",
      prompt: "consent",
      scope: "profile email https://www.googleapis.com/auth/business.manage",
    },
  },
});
```

### Rule 2: Review Submission (Deep-Link + Clipboard)

Programmatic Google review posting via API is NOT possible (Google policy).
We use the deep-link + clipboard approach:

```typescript
await navigator.clipboard.writeText(selectedReview);
window.open(business.review_link, "_blank");
// review_link = "https://search.google.com/local/writereview?placeid=ChIJXXX"
```

### Rule 3: Review Shield Gate

```typescript
if (rating < 3) {
  showPrivateFeedbackForm(); // never shows Google link
} else {
  showAIReviewOptions();
}
```

### Rule 4: Supabase = Database Only

- No Supabase Edge Functions
- No Supabase triggers or background jobs
- Supabase used ONLY as a Postgres database via `@supabase/supabase-js` client
- All business logic in Next.js API Routes (our backend)

### Rule 5: Review Reply via API (This IS Possible)

Replying to existing reviews as the business owner IS supported:

```
PUT accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply
```

This uses Rahul's stored OAuth token. This is legitimate and fully supported.

### Rule 6: Session Caching for Customers

Customer's Google session cached in secure cookie (30-day expiry).
On repeat visits to any `/r/[slug]`, they skip the sign-in step entirely.

---

## 6. Google My Business API Data Points

When a business is connected, we fetch and store:

**From API (automatic):**

- Business name, primary/additional categories
- Structured address (line1, line2, city, state, pincode)
- Primary phone + additional phones
- Website URL
- Regular hours + special hours
- GPS coordinates (lat/lng)
- Google rating + review count
- Google Maps URL
- Write-review deep link URL
- Business description
- Opening date
- Google attributes (WiFi, wheelchair access, card payments, etc.)
- Social links from Google profile
- Listing status (published/suspended)

**Owner provides in ReviewBoost:**

- WhatsApp business number (+ OTP verification)
- Instagram, Facebook, YouTube, Twitter URLs
- Custom logo upload (stored in Supabase Storage)
- QR customization settings (colors, frame style, frame text)
- Custom review page tagline
- Custom thank-you message
- Notification preferences

---

## 7. Confetti Timing Decision

Confetti fires **immediately when "Post to Google" is tapped** — not after Google confirms receipt (which is impossible via API).

Rationale: Rewards the intent and action. Provides immediate positive feedback. The instruction overlay tells them what to do next on Google.

---

## 8. Review Reply Capability

| Operation                        | Possible via API                                 |
| -------------------------------- | ------------------------------------------------ |
| Fetch all reviews for a business | ✅ Yes                                           |
| Post/update owner reply          | ✅ Yes                                           |
| Delete owner's own reply         | ✅ Yes                                           |
| Flag review as inappropriate     | ✅ Limited                                       |
| Delete a customer's review       | ❌ Impossible (Google policy)                    |
| Get reviewer's Gmail/account ID  | ❌ Privacy protected — display name + photo only |

---

## 9. Notifications

### Phase 1 (Resend — Email)

- Trial ending warning (Day 5)
- Trial expired (Day 7)
- New private feedback received (Review Shield catch)
- Payment failed / subscription expired

### Phase 2 (Interakt — WhatsApp)

- Instant alert when Review Shield catches 1-2 star review
- New 5-star review posted via ReviewBoost
- Weekly analytics summary

---

## 10. Out of Scope (v1)

- WhatsApp notifications (Phase 2)
- Tiered pricing / feature gating (Phase 2)
- Mobile app (Phase 3)
- White-label (Phase 3)
- Multi-language admin panel (Phase 3)
- Third-party API (Phase 3)
