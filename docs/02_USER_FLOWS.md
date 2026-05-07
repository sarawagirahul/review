# User Flows

## Flow A: Business Owner Onboarding (Rahul)

```
[1] Rahul visits reviewboost.com
        ↓
[2] Clicks "Start Free Trial" → /login
        ↓
[3] Clicks "Sign in with Google"
    → Supabase Auth triggers Google OAuth
    → Scopes: profile, email, business.manage, offline_access
        ↓
[4] Google Consent Screen shown to Rahul
    → Rahul approves
    → Google returns: access_token, refresh_token, email, profile
        ↓
[5] Supabase Auth callback (/auth/callback)
    → Session created
    → API Route: POST /api/auth/sync-profile
      → Check if users row exists for this auth.uid()
      → If NOT: create users row { role: 'owner', email, full_name, avatar_url }
      → Create owner_details row { trial_ends_at: now() + 7 days }
        ↓
[6] First-time login → redirect to /dashboard/setup
    Returning login → redirect to /dashboard
        ↓
[SETUP STEP 1] "Connect Your Business"
    → Client calls GET /api/google/locations
    → Server uses Rahul's stored OAuth token
    → Calls Google My Business API: GET accounts/{id}/locations
    → Returns list of locations rahul@gmail.com manages
    → Rahul sees cards: "Rahul Industries, Mumbai" | "Rahul Café, Pune"
    → Clicks "Select" on "Rahul Industries"
    → POST /api/businesses/create
      → Fetches full location data from Google API
      → Creates businesses row with all Google data
      → Generates UUID qr_slug
      → Builds review_link from google_place_id
        ↓
[SETUP STEP 2] "Contact & Social Links"
    → WhatsApp number input (+91 format)
    → Optional: Instagram, Facebook, YouTube URLs
    → Optional: Custom logo upload → Supabase Storage
    → Save → PATCH /api/businesses/{id}
        ↓
[SETUP STEP 3] "Your QR is Ready"
    → QR code displayed (links to /r/{uuid-slug})
    → Download PNG | Download PDF
    → "Go to Dashboard" CTA
        ↓
[DASHBOARD] /dashboard
    → Shows: Total Scans, Review Clicks, Private Feedback, Active Businesses
    → Business card(s) with QR thumbnails
    → "Add Another Business" → returns to Setup Step 1
        ↓
[BILLING] After 7-day trial
    → Dashboard shows "Trial Expired" banner
    → /dashboard/billing: Monthly (₹999) | Annual (₹7,999)
    → Click plan → POST /api/razorpay/create-subscription
    → Redirect to Razorpay checkout
    → Webhook: subscription.activated → subscription_status = 'active'
```

---

## Flow B: Customer Review Journey (Shyam)

```
[1] Shyam scans QR code at Rahul's shop
    → Camera opens: reviewboost.com/r/550e8400-e29b-41d4-a716
        ↓
[2] Next.js loads /r/[slug]/page.tsx (Server Component)
    → Fetch business from Supabase by qr_slug
    → Check: is business active? is owner subscription active?
    → If not active: show "Basic Google Review" fallback page
    → If active: render full review page
    → INSERT review_events { event_type: 'scan', business_id }
        ↓
[3] Page renders:
    → Business logo + name: "Rahul Industries"
    → "How was your experience today?"
    → 5 animated star buttons
        ↓
[4] Shyam taps 4 stars
        ↓
[5] GATE CHECK:
    → rating >= 3 → HAPPY PATH (go to step 6)
    → rating < 3  → REVIEW SHIELD (go to step 10)
        ↓
[HAPPY PATH — step 6] Check auth
    → Does Shyam have a cached ReviewBoost session?
      → YES: proceed to AI generation
      → NO: show Google One-Tap popup
          → Shyam taps "Continue as Shyam Kumar"
          → Supabase session created for Shyam
          → users row: { role: 'customer', ... }
          → Session stored in secure cookie (30-day expiry)
        ↓
[7] AI Generation
    → POST /api/ai/generate
    → Body: { rating: 4, businessName: "Rahul Industries", city: "Mumbai", language: "en" }
    → Gemini 2.5 Flash generates 3 distinct reviews
    → Returns: { reviews: ["Option A...", "Option B...", "Option C..."] }
    → 3 cards "type out" with Framer Motion typewriter animation
    → Language toggle: English | हिंदी | Hinglish
        ↓
[8] Shyam reads options, picks Option B, edits slightly if he wants
    → "Regenerate" button → fresh API call for 3 new options
        ↓
[9] Shyam taps "Post to Google →"
    → SIMULTANEOUSLY:
      a) navigator.clipboard.writeText(selectedReview) — text in clipboard
      b) window.open(business.review_link, '_blank') — Google Maps review dialog opens
      c) INSERT review_events { event_type: 'review_clicked', customer_id: Shyam.id }
      d) INSERT reviews { customer_id, business_id, rating, ai_generated_options, final_text }
    → Confetti animation fires on ReviewBoost tab
    → Thank You overlay:
        "📋 Your review is copied!
         Switch to Google and paste → tap Submit ✅"
        [Follow on Instagram] [Join WhatsApp Community]
    ↓
[Shyam on Google Maps tab]
    → Long-press text box → Paste
    → Tap "Post"
    → Review is LIVE on Rahul Industries Google page
    → Posted from Shyam's own Google account ✅

---

[REVIEW SHIELD — step 10]
    → rating < 3 detected
    → UI transitions (smooth Framer Motion) to private feedback form
    → "We're sorry to hear that 😔"
    → Form: message (required), name (optional), contact (optional)
    → Submit → POST /api/feedback/submit
      → INSERT private_feedback { business_id, customer_id, rating, message, ... }
      → Resend email to Rahul: "New private feedback ⚠️ — 2-star caught by Shield"
    → Thank You: "Thank you. The owner will reach out to resolve this."
```

---

## Flow C: Multi-Business Management

```
Rahul adds second business (Rahul Café):
    → Dashboard: "Add Another Business"
    → Setup Step 1: Lists all GBP locations again
    → Rahul selects "Rahul Café, Pune"
    → New businesses row, new UUID qr_slug
    → New QR code for Rahul Café

Dashboard sidebar:
    → Overview (aggregate all businesses)
    → My Businesses
          └── Rahul Industries [Mumbai]  → unique QR, own analytics
          └── Rahul Café [Pune]          → unique QR, own analytics
    → Each business page: scan graph, review click rate, feedback count
```

---

## Flow D: Review Reply (Owner)

```
Rahul opens /dashboard/businesses/[id]/reviews
    → GET /api/google/reviews?businessId=xxx
    → Fetch from Google My Business API + upsert cache in google_reviews table
    → Shows all reviews: name, photo, rating, text, date, reply status

Rahul sees 2-star review from "Angry Customer"
    → Clicks "Generate AI Reply"
    → POST /api/ai/generate-reply
    → Gemini generates empathetic reply (tone: apologetic, offering resolution)
    → Reply appears in editable textarea

Rahul edits slightly, clicks "Post Reply"
    → POST /api/google/reviews/post-reply
    → Calls Google My Business API: PUT .../reviews/{reviewId}/reply
    → Reply appears on Google immediately
    → google_reviews row updated: replied_via_portal=true, replied_at=now()
```

---

## Flow E: Admin Operations

```
Admin (you) at /admin/dashboard
    → Platform stats: owners, customers, businesses, revenue, reviews

/admin/owners
    → List all business owners, search by email/name
    → Click owner → see their profile, businesses, subscription status
    → Can: Edit, Deactivate, Delete, Extend trial manually

/admin/customers
    → List all reviewers (Shyam etc.)
    → Click customer → see full review history across all businesses
    → Can: Edit, Deactivate, Delete, Manually verify WhatsApp

/admin/businesses
    → List all businesses across all owners
    → Can: View analytics, Deactivate QR, Delete

/admin/revenue
    → Razorpay: MRR, ARR, active subs, failed payments, churn rate
```

---

## Relationship Summary

```
MANY-TO-MANY: Customers ←→ Businesses (via reviews table)
  - Shyam can review 50 different businesses
  - Rahul Industries can receive reviews from 1000 customers

ONE-TO-MANY: Owner → Businesses
  - Rahul can have Rahul Industries + Rahul Café + Rahul Motors

ONE-TO-MANY: Business → Private Feedback
  - Multiple private feedback entries per business

ONE-TO-MANY: Business → Google Reviews (cached)
  - Multiple cached Google reviews per business

ONE-TO-MANY: Business → Review Events (analytics)
  - Every scan, AI gen, review click tracked per business
```
