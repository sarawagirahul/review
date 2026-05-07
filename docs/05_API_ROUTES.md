# API Routes

All routes live under `/api/**` in the Next.js App Router.
All routes return JSON. Auth is validated via Supabase session cookie.

## Auth Requirements Legend
- 🔓 Public — no auth required
- 👤 Any auth — any logged-in user
- 🏪 Owner — must be a business owner
- 🛡️ Admin — must be an admin

---

## Auth Routes

### POST `/api/auth/sync-profile`
**Auth:** 👤 Any auth (called immediately after OAuth callback)  
**Purpose:** Creates or updates user row on first login  
```typescript
// Request: none (uses session from cookie)
// Action:
//   1. Get user from Supabase auth session
//   2. Upsert into users table
//   3. If owner (came from /login page): create owner_details row, set trial_ends_at
// Response:
{ user: User, isNewUser: boolean }
```

### POST `/api/auth/whatsapp/send-otp`
**Auth:** 👤 Any auth  
**Purpose:** Send OTP to WhatsApp number for verification  
```typescript
// Request: { phone: string }  // +91XXXXXXXXXX
// Action:
//   1. Validate Indian phone format
//   2. Generate 6-digit OTP
//   3. Hash OTP with bcrypt
//   4. Insert into whatsapp_otps (expires 10 min)
//   5. Send via Interakt WhatsApp API
// Response: { sent: true, expiresIn: 600 }
```

### POST `/api/auth/whatsapp/verify-otp`
**Auth:** 👤 Any auth  
**Purpose:** Verify OTP and mark WhatsApp as verified  
```typescript
// Request: { phone: string, otp: string }
// Action:
//   1. Find latest OTP record for user+phone
//   2. Check: not expired, not verified, attempts < 3
//   3. Compare bcrypt hash
//   4. If match: update users { whatsapp_phone, whatsapp_verified: true }
//   5. If no match: increment attempts
// Response: { verified: boolean, attemptsRemaining?: number }
```

---

## AI Routes

### POST `/api/ai/generate`
**Auth:** 🔓 Public (called from /r/[slug] page)  
**Purpose:** Generate 3 AI review options for customer  
```typescript
// Request:
{
  rating: number,       // 3 | 4 | 5
  businessName: string, // "Rahul Industries"
  city: string,         // "Mumbai"
  language: 'en' | 'hi' | 'hinglish'
}

// Gemini Prompt (English):
// "Generate 3 distinct, genuine {rating}-star Google reviews for {businessName} in {city}, India.
//  Each: 40-70 words, natural Indian customer voice, no star count, different aspects.
//  Return JSON array: ["review1", "review2", "review3"]"

// Response: { reviews: string[] }
```

### POST `/api/ai/generate-reply`
**Auth:** 🏪 Owner  
**Purpose:** Generate AI reply for a Google review  
```typescript
// Request:
{
  reviewId: string,
  reviewerName: string,
  reviewText: string,
  rating: number,
  businessName: string
}

// Gemini Prompt:
// Tone varies by rating:
// 5★ = warm + grateful, 4★ = appreciative, 3★ = acknowledging
// 2★ = empathetic + apologetic, 1★ = deeply apologetic + urgent
// Under 80 words, human not corporate, light Hinglish OK

// Action: Save to google_reviews.ai_generated_reply
// Response: { reply: string }
```

---

## Business Routes

### POST `/api/businesses/create`
**Auth:** 🏪 Owner  
**Purpose:** Create a business from a selected Google location  
```typescript
// Request: { googleLocationId: string }
// Action:
//   1. Fetch full location data from Google My Business API
//   2. Build review_link from google_place_id
//   3. Create businesses row with all Google data
//   4. Generate UUID qr_slug
// Response: { business: Business }
```

### PATCH `/api/businesses/[id]`
**Auth:** 🏪 Owner (must own the business)  
**Purpose:** Update business settings (contact, social, branding, QR)  
```typescript
// Request: Partial<Business> (only owner-provided fields)
// Response: { business: Business }
```

### GET `/api/businesses/[id]/stats`
**Auth:** 🏪 Owner  
**Purpose:** Get analytics for a specific business  
```typescript
// Response:
{
  totalScans: number,
  reviewClicks: number,
  feedbackCount: number,
  conversionRate: number,   // reviewClicks / totalScans
  last30Days: DailyStat[],
  recentEvents: ReviewEvent[]
}
```

---

## Google My Business Routes

### GET `/api/google/locations`
**Auth:** 🏪 Owner  
**Purpose:** Fetch all GBP locations for the logged-in owner  
```typescript
// Action:
//   1. Get owner's Google OAuth access_token from Supabase session
//   2. Refresh token if expired (using refresh_token)
//   3. Call: GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations
//   4. Return formatted list
// Response: { locations: GBPLocation[] }
// Note: Returns mock data if GBP API not yet approved
```

### GET `/api/google/reviews`
**Auth:** 🏪 Owner  
**Purpose:** Fetch and cache Google reviews for a business  
```typescript
// Query: ?businessId=xxx&sync=true
// Action:
//   1. If sync=false: return from google_reviews cache
//   2. If sync=true: call Google My Business API, upsert cache
// Response: { reviews: GoogleReview[], lastSynced: string }
```

### POST `/api/google/reviews/post-reply`
**Auth:** 🏪 Owner  
**Purpose:** Post AI-generated reply to a Google review  
```typescript
// Request: { reviewId: string, replyText: string }
// Action:
//   1. Verify owner owns the business with this review
//   2. Get owner's OAuth token
//   3. Call: PUT .../reviews/{googleReviewId}/reply
//   4. Update google_reviews: replied_via_portal=true, replied_at=now()
// Response: { success: boolean }
```

### DELETE `/api/google/reviews/delete-reply`
**Auth:** 🏪 Owner  
**Purpose:** Delete an owner reply from Google  
```typescript
// Request: { reviewId: string }
// Action: Call DELETE .../reviews/{googleReviewId}/reply
// Response: { success: boolean }
```

### POST `/api/google/reviews/flag`
**Auth:** 🏪 Owner  
**Purpose:** Flag a review as inappropriate for Google's review  
```typescript
// Request: { reviewId: string, reason: string }
// Action: Call POST .../reviews/{googleReviewId}:flag
// Response: { flagged: boolean }
```

---

## Feedback Routes

### POST `/api/feedback/submit`
**Auth:** 🔓 Public (from /r/[slug] page — Review Shield)  
**Purpose:** Submit private feedback for low-star ratings  
```typescript
// Request:
{
  businessId: string,
  rating: number,       // 1 or 2
  message: string,
  customerName?: string,
  customerContact?: string,
  customerId?: string   // if user is logged in
}
// Action:
//   1. Insert into private_feedback
//   2. Insert review_events { event_type: 'feedback_submitted' }
//   3. Send Resend email to business owner
// Response: { submitted: true }
```

---

## Event Tracking Routes

### POST `/api/events/track`
**Auth:** 🔓 Public  
**Purpose:** Track analytics events (scans, clicks, etc.)  
```typescript
// Request:
{
  businessId: string,
  eventType: 'scan' | 'ai_generated' | 'review_clicked' | 'regenerate_clicked',
  customerId?: string,
  rating?: number,
  language?: string
}
// Action: Insert into review_events
// Response: { tracked: true }
```

---

## Razorpay Routes

### POST `/api/razorpay/create-subscription`
**Auth:** 🏪 Owner  
**Purpose:** Create a Razorpay subscription for selected plan  
```typescript
// Request: { plan: 'monthly' | 'annual' }
// Action:
//   1. Get or create Razorpay customer
//   2. Create Razorpay subscription for selected plan ID
//   3. Return subscription details for frontend checkout
// Response: { subscriptionId: string, key: string }
```

### POST `/api/razorpay/webhook`
**Auth:** 🔓 Public (validated via Razorpay signature)  
**Purpose:** Handle Razorpay payment events  
```typescript
// Events handled:
// subscription.activated  → subscription_status = 'active'
// subscription.charged    → log payment, extend period
// subscription.cancelled  → subscription_status = 'cancelled'
// payment.failed         → subscription_status = 'past_due' + Resend email
// Validates signature: crypto.createHmac('sha256', WEBHOOK_SECRET)
```

---

## Notification Routes

### POST `/api/resend/notify`
**Auth:** Internal only (called from other API routes)  
**Purpose:** Send templated emails via Resend  
```typescript
// Request:
{
  template: 'trial_ending' | 'trial_expired' | 'new_feedback' | 'payment_failed' | 'new_review',
  to: string,
  data: Record<string, any>
}
```

---

## Admin Routes

All admin routes require `role === 'admin'`. They use the Supabase service role key to bypass RLS.

### GET `/api/admin/stats`
```typescript
// Response: platform-wide aggregate stats
{
  totalOwners: number,
  totalCustomers: number,
  totalBusinesses: number,
  totalReviews: number,
  totalFeedbackCaught: number,
  activeSubscriptions: number,
  trialUsers: number,
  mrr: number,   // from Razorpay
  arr: number
}
```

### GET `/api/admin/owners`
List all owners with pagination, search, filter by status.

### GET `/api/admin/owners/[id]`
Owner profile + their businesses + subscription history.

### PATCH `/api/admin/owners/[id]`
Edit owner: extend trial, change subscription status, deactivate.

### DELETE `/api/admin/owners/[id]`
Delete owner and all their data (cascade).

### GET `/api/admin/customers`
List all customers with pagination, search.

### GET `/api/admin/customers/[id]`
Customer profile + complete review history across all businesses.

### PATCH `/api/admin/customers/[id]`
Edit customer: deactivate, manually verify WhatsApp.

### GET `/api/admin/businesses`
List all businesses across all owners.

### PATCH `/api/admin/businesses/[id]`
Deactivate a business QR.

### GET `/api/admin/revenue`
Razorpay subscription data: MRR, ARR, plan distribution, failed payments.
