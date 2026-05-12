# JustHustle — Business Owner Side: Finalized Scope v1.0

> This document defines the complete product scope for the Business Owner side of JustHustle.
> Status: **Finalized** (pending answers to 3 open questions at the bottom)

---

## 1. Authentication & Signup

- Google OAuth sign-in — `email + profile` scope only at signup (no `business.manage`)
- First login → forced profile completion (cannot skip, cannot access dashboard until done)
- Subsequent logins → redirect to Dashboard (if businesses exist) or My Businesses (if none)

---

## 2. Owner Profile Journey (one-time, mandatory)

> **Account-level profile** — about the owner as a person. Separate from any individual business profile.

Collected once at signup. Owner cannot access the dashboard until this is complete.

| Field | Source | Notes |
|---|---|---|
| Full name | Google (pre-filled) | Editable |
| Profile photo | Google (pre-filled) | Editable |
| Personal email | Google (pre-filled) | Read-only |
| Personal phone | Manual | Required |
| Personal WhatsApp | Manual | Required (+91 format) |
| GST number | Manual | Required (for invoicing/billing) |

On completion → land on Dashboard (if businesses exist) or My Businesses (if none).

**Session duration:** 30 days via Supabase SSR refresh token rotation. Owner stays logged in across visits as long as they return within 30 days. No manual re-login required.

---

## 2b. Business Profile (per business — separate from owner profile)

> **Business-level profile** — each business has its own, independent of the owner's personal profile above.

Business profile data comes from two sources:

**Auto-fetched from Google Places API (read-only in the UI):**
- Business name, address, category, phone, website, opening hours
- Google star rating + review count
- GPS coordinates (used for competitor analysis)

**Owner-provided in JustHustle (editable via Tab 4 — Customisation and Tab 5 — Settings):**
- Business logo (used on review page header + embedded in QR)
- Primary + secondary brand colours
- Business description (shown prominently on `/r/[slug]` customer review page)
- Review page tagline (e.g., "How was your visit today?")
- Thank-you message (shown after review is posted)
- QR frame title + tagline (printed on downloaded QR)
- Contact email for this business (can differ from owner's personal email)
- Contact WhatsApp for this business
- Notification preferences (per business, independent of other businesses)

Both profiles are always accessible separately — owner reaches their personal profile via sidebar "Profile Settings" and each business profile via that business's management tabs.

---

## 3. Sidebar Navigation

1. **Dashboard** — aggregate analytics across all businesses
2. **My Businesses** — list + manage all linked businesses
3. **Billing** — subscription management via Razorpay
4. **Profile Settings** — edit owner-level account details

---

## 4. Dashboard

Aggregate view across all owner's businesses. First screen after login — the heartbeat of the platform.

### Stats Cards (top row)
| Metric | Detail |
|---|---|
| Total QR Scans | This month vs last month (↑↓ %) |
| Reviews Posted via JustHustle | This month vs last month |
| Shield Catches | Negative reviews intercepted this month |
| Conversion Rate | Scans → clicked Post to Google (%) |
| Avg. Google Rating | Weighted average across all businesses |
| Unanswered Reviews | Count awaiting owner reply (shown when GBP active) |

### Charts
- **30-day Scan + Review Trend** — dual-line chart (scans vs reviews), filterable by individual business
- **Reviews vs Shield Catches** — stacked bar chart, last 30 days
- **Conversion Funnel** — Scans → AI Generated → Clicked Post (shows where customers drop off)
- **Peak Times Heatmap** — scan volume by day of week + hour of day across all businesses

### Top Performers Panel
- **Top QR this month** — which QR nickname drove the most scans across all businesses
- **Top Business** — highest conversion rate this month
- **Most Active Day** — single day with highest scan volume

### Per-Business Breakdown Table
| Column | Detail |
|---|---|
| Business | Logo + name + city |
| Scans (month) | vs last month |
| Reviews (month) | via JustHustle |
| Shield Catches | Unresolved count in red if > 0 |
| Avg. Rating | Current Google rating |
| Conversion | Scans → reviews % |
| Action | Manage → |

### Recent Activity Feed
Last 20 events across all businesses — scan, AI generated, review clicked, Shield catch — with business name, QR nickname (which QR it came from), and timestamp. Filterable by event type.

---

## 5. My Businesses

### List View
- Business card: logo + name + city + Google star rating + quick stats (scans, reviews this month)
- **Manage Business** button → individual business page
- **Add Another Business** button (top right)

### Empty State
Illustration + "Add Your First Business" CTA → triggers Add Business popup.

### Add Business Popup

Two options presented as cards side by side:

**Path A — Paste Google Maps Link** *(Active)*
1. Owner pastes Google Maps share URL for their business
2. We extract Place ID from URL client-side
3. Call Google Places API → fetch: name, address, rating, hours, category, phone
4. Show preview card: "Is this your business?" with all fetched details
5. Confirm → create business row, generate `qr_slug`, build `review_link` from Place ID
6. Redirect to newly created business management page

**Path B — Connect via Google Business Profile** *(Disabled — Coming Soon)*
- Greyed out card with lock icon
- Tooltip on hover: "Full API access lets us auto-import all your locations and sync all live reviews. Coming soon."
- Non-interactive until GBP API approved

---

## 6. Individual Business Management

Route: `/dashboard/businesses/[id]`

**Page header:** Business logo + name + city + current Google star rating + "← My Businesses"

Six tabs:

---

### Tab 1: QR Codes

**Goal:** Create, nickname, download, and track physical QR codes for each placement in-store.

**QR List view:**
Each QR card shows:
- **Nickname** (e.g., "Front Counter", "Table 5", "Receipt", "Window Sticker") — editable inline at any time
- QR thumbnail preview
- Total scans (all time)
- Scans this month vs last month (e.g., "42 this month ↑18%")
- Reviews generated from this QR
- Conversion rate for this QR (scans → clicked Post to Google)
- Date created
- Download button + Delete button (with confirmation)

**Create QR → drawer/modal:**
- Nickname field (required — owner must name it before generating)
- Live preview of the customer review page with current customisation applied
- Generate → QR instantly created with unique tracking slug appended

**Per-QR analytics drill-down (click on a QR card):**
- 30-day scan trend chart (line, per day) for this QR only
- Breakdown: Scans → AI Generated → Clicked Post to Google (funnel)
- Shield catches originating from this QR
- Top scan times (hour of day heatmap — useful for knowing when customers are most active)

**QR Customisation (per QR, set at creation or edited later):**
- Nickname (required — e.g., "Table 5", "Front Counter", "Receipt")
- QR foreground + background colour
- Logo embedded in QR centre (uses business logo from Customisation tab)
- Frame title (shown above QR on print — defaults to business name)
- Frame tagline (shown below QR — e.g., "Scan to share your experience!")
- QR dot style: square (default), rounded, dots

**Download formats:**
- **PNG** — clean QR only, for digital use, WhatsApp sharing, or website embedding
- **PDF (print-ready)** — QR + frame title + tagline + business logo + branding colours, formatted for A5 or A4 printing. Ready to send to a printer or print at home.

**Unlimited QRs per business**, each with its own nickname and fully independent tracking data.

---

### Tab 2: Shield Inbox

**Goal:** Surface all low-rating (1–2 star) feedback that was intercepted before reaching Google, so the owner can resolve it privately.

**Features:**
- **Feedback list:** Sorted newest first. Each card shows:
  - Customer name (if provided), star rating, message, date submitted
  - Status badge: Open / Resolved
  - **Mark as Resolved** button
  - **Add Internal Note** (expandable field — private, not shown to customer)
- **Filters:** All / Open / Resolved
- **Tab badge:** Red dot with count of unresolved catches
- **Empty state:** "No feedback yet — your Review Shield is active and protecting your listing"

**Email trigger:** Every new Shield catch → Resend email to owner's notification email for this business (can be toggled in Settings tab).

---

### Tab 3: Reviews

**Goal:** View Google reviews and (when GBP API is approved) reply to them with AI-generated responses.

**Path A state (current — Places API only):**
- Up to 5 most recent Google reviews fetched from Places API
- Per review: reviewer name, star rating, review text, date
- **"Sync Reviews"** button → re-fetches latest 5
- **"View All on Google"** link → opens their Google listing in new tab
- **"Reply with AI"** button → greyed out with tooltip: "Connect Google Business Profile to enable AI-powered replies"

**Path B state (future — GBP API approved):**
- Full review list, paginated, with filter (All / Unanswered / By rating)
- **Reply with AI:** Gemini uses owner's past replies as few-shot examples to match their tone → generates reply → editable textarea → **Post Reply** sends directly via GBP API
- **Reply status badges:** Replied / Awaiting reply / Flagged
- **Flag review** option (sends flag via GBP API)
- **Delete reply** option (owner can remove their own posted reply)

---

### Tab 4: Customisation

**Goal:** Control how the customer-facing review page looks for this specific business.

**Fields:**
| Field | Default |
|---|---|
| Business logo | None (upload to Supabase Storage) |
| Primary brand color | #6366F1 |
| Secondary brand color | #FFFFFF |
| Review page tagline | "How was your visit today?" |
| Thank-you message | "Thank you! Your review means the world to us." |
| QR frame text | "Scan to Review Us" |

**Live preview panel** (right side): real-time preview of `/r/[slug]` page as fields are edited — no need to save to see changes.

**Save** → updates business row → live review page reflects immediately.

> Note: Logo uploaded here also appears embedded in downloaded QR codes (if owner enables it).

---

### Tab 5: Settings

**Goal:** Business-level operational details and notification preferences.

**Business Details section:**
- Business name *(read-only if sourced from Places API — with note "Update on Google Maps to reflect here")*
- Contact email for this business
- Contact phone
- WhatsApp number for this business

**Notification Preferences section:**
| Toggle | Default |
|---|---|
| Email me when Shield catches a low-rating review | ✅ On |
| Email me when a review is posted via JustHustle | ✅ On |
| Weekly analytics summary email | ☐ Off |

Notification email field (defaults to owner account email, editable per business).

**Danger Zone:**
- **Deactivate Business** → disables QR page → customers see basic "Review on Google" fallback → owner must reactivate manually

---

### Tab 6: Competitor Analysis

**Goal:** Show the owner how they compare against similar businesses within 400–500m of their location — using publicly available Google Places data.

**How it works:**
1. Owner sets their preferred radius via a dropdown (250m / 500m / 750m / 1km / 2km) — saved per business, defaults to 500m
2. On first open (or when radius changes, or manual refresh), call Google Places API Nearby Search with:
   - Centre point: business GPS coordinates (stored at business creation)
   - Radius: owner's chosen radius
   - Type: same category as this business (e.g., "restaurant", "salon", "clinic")
3. Results cached for 24 hours per radius setting — changing the radius immediately clears cache and re-fetches
4. Last-refreshed timestamp shown + "Refresh Now" button

**What's shown:**

*Area Overview (summary cards):*
- "X competitors within 500m"
- Area average rating vs your rating (e.g., "Area avg: 3.8 ★ — You: 4.2 ★ — You're above average ✅")
- Area average review count vs your review count (e.g., "Area avg: 95 reviews — You: 42 — 53 reviews behind the average")
- Number of competitors with rating above 4.5

*Competitor List (table/cards):*
- Business name, Google rating, review count, price level (if available), distance from your location
- Sorted by rating descending by default; re-sortable by review count or distance

*Menu Presence Comparison (restaurants and applicable categories only):*
Google Places API returns a `menu_url` field if the business has linked a menu on their Google listing. We use this to show:
- Whether each competitor has a menu linked on Google (✅ / ❌)
- A direct "View Menu →" link for competitors who do
- Whether the owner's own business has a menu linked (with a prompt to add one on Google if not)

> **Honest limitation:** Google does not provide structured menu data (dish names, prices) via any public API. We cannot do a true item-by-item price comparison. What we can show is menu presence and link — the owner visits the competitor menu themselves. AI-powered menu parsing from publicly accessible URLs is a Phase 2 consideration.

*Improvement Insights (AI-generated, below the list):*
Simple plain-English tips based on the data. Examples:
- "3 nearby restaurants have 200+ reviews — you're at 42. At your current pace, you'll match them in ~4 months. Placing a QR at your entrance could accelerate this."
- "Your rating (4.2) beats 7 of 9 nearby competitors. Protecting it is more important than chasing reviews right now."
- "2 competitors have menus linked on Google — you don't. Adding your menu to your Google listing can improve discoverability."

> Note: All data is publicly available via Google Places API. No competitor's private data is accessed. Results cached 24h per radius setting.

---

### Tab 7: Social & Web *(Phase 2)*

**Goal:** Future home for social media and website analytics.

**Current state:** Three placeholder cards.

| Platform | Status |
|---|---|
| Instagram Business | "Connect Instagram — Coming Soon" |
| Facebook Page | "Connect Facebook Page — Coming Soon" |
| Website (Google Analytics) | "Connect Google Analytics — Coming Soon" |

Each card: platform logo + brief description of what metrics will show + **"Notify me when ready"** button (logs interest, no other function).

---

## 7. Email Notifications (via Resend)

All Phase 1 notifications sent via Resend. WhatsApp (Interakt) deferred to Phase 2.

| Trigger | Recipient | Subject line |
|---|---|---|
| New Shield catch | Business notification email | ⚠️ New private feedback for [Business Name] |
| New review posted via JustHustle | Business notification email | ⭐ New review for [Business Name] |
| Trial ending — Day 5 | Owner account email | Your trial ends in 2 days |
| Trial expired — Day 7 | Owner account email | Upgrade to keep your QR codes active |
| Payment failed | Owner account email | Action required — payment failed |

---

## 8. Billing Page

- Trial: **7 days**, full features, no card required
- Monthly plan: **₹599/month** — Razorpay recurring
- Annual plan: **₹4,999/year** — Razorpay recurring (save ~30%, ~₹417/month) *(confirm this number)*
- Base plan limit: **up to 3 businesses**
- Higher tier (Phase 2): unlimited businesses + additional features TBD

**Billing page shows:**
- Current plan + status (Trial / Active / Paused / Cancelled)
- Trial countdown banner (if on trial)
- Next billing date + amount (if subscribed)
- Plan comparison cards with upgrade/downgrade option
- Payment history table
- Cancel subscription option

---

## 9. Trial Expiry Policy

### Timeline
| Day | Status | Owner Experience | Customer QR Page |
|---|---|---|---|
| 1–7 | Active trial | Full access to all features | Full AI review experience |
| 8–10 | Grace period | Full access + persistent upgrade banner + daily email | Full AI review experience |
| 11+ | Expired | Read-only dashboard — can view all data, cannot add businesses, cannot create/download QRs, upgrade banner on every page | Basic fallback: business name + "Leave a Google Review →" deep link (no AI, no Shield) |

### Why this approach
- **Grace period (Days 8–10):** Reduces churn from owners who intended to pay but got busy. 3 days is enough to prompt action without giving away too much.
- **Read-only access after expiry:** Owner can still see their analytics and Shield inbox — this reminds them what they're losing and keeps them engaged. Locking them out entirely is more likely to cause them to walk away.
- **QR page degrades, not dies:** The physical QR sticker is already on their wall. If it 404s, it embarrasses the owner in front of their customer. A basic Google review fallback preserves dignity and still serves the end customer — which is a better experience for everyone.

### Email sequence on expiry path
| Trigger | Email |
|---|---|
| Day 5 of trial | "Your trial ends in 2 days — here's what you'll lose" |
| Day 7 (expiry) | "Your trial has ended — upgrade to restore AI reviews" |
| Day 9 (grace period day 2) | "Last reminder — your QR pages switch to basic mode tomorrow" |
| Day 11 (degraded) | "Your QR pages are now in basic mode — upgrade to restore" |
| Day 18 (7 days after degraded) | "You're missing reviews — come back and see what changed" |

---

## 10. What's Explicitly Out of Scope (Phase 1)

- WhatsApp notifications (Phase 2 — Interakt)
- GBP API full location import + live review sync (Path B, enabled when approved)
- AI reply posting via GBP API (Path B)
- Instagram / Facebook / Website analytics (Phase 2 — Tab 6 placeholders only)
- Admin panel (separate scope document)
- End-user / customer side (separate scope document)
- White-label, API access, multi-team members (Phase 3)

---

## 11. Review Tracking & Fuzzy Match Strategy

### What we can track (client-side events)

| Event | When | Stored in |
|---|---|---|
| `scan` | Customer lands on `/r/[slug]` | `review_events` |
| `ai_generated` | Gemini returns 3 options | `review_events` |
| `review_clicked` | Customer taps "Post to Google" | `review_events` + row in `reviews` table |
| `regenerate_clicked` | Customer asks for new options | `review_events` |
| `feedback_submitted` | Shield catch submitted | `review_events` + row in `private_feedback` |

### What we cannot track
Whether the customer actually opened Google, pasted the text, and hit Submit. That action happens outside our platform entirely. We are honest with owners about this: the dashboard shows a funnel (Scans → AI Generated → Clicked Post to Google) and labels the final step as "estimated reviews posted." Some people click but don't paste — the number is directionally accurate, not exact.

### Fuzzy match logic (activates when GBP API is approved — Path B)

1. On each review sync from GBP API, fetch reviewer display name + review date for every Google review
2. Query our `reviews` table for this business: all rows where customer clicked "Post to Google" within a ±7-day window of the Google review date
3. Run string similarity (Levenshtein / trigram) between reviewer display name and customer full name from our `users` table
4. If similarity > 75%: mark `google_reviews.matched_customer_id` and flag as "Possible Match"
5. Show in Reviews tab with explicit disclaimer: "Match is approximate and may not be 100% accurate"

For Phase 1 (no GBP API): store all events and `reviews` rows faithfully. Retroactively run fuzzy match when GBP is approved.

### Customer consent (Phase 4 architecture decision — needed now)

Phase 4 involves owners running marketing campaigns to their customers. This is only legal with explicit customer consent. **Decision: add a single opt-in checkbox to the thank-you screen in Phase 1.** It costs one day to build now and is a legal requirement for Phase 4.

> "✅ Get exclusive offers and updates from [Business Name]"

Consent stored in `reviews` table (add `marketing_consent BOOLEAN DEFAULT FALSE` column). Phase 4 campaigns only reach consented customers. This is non-negotiable from a legal standpoint given India's upcoming DPDP Act enforcement.

---

## 12. Phase Roadmap (for architecture reference)

| Phase | Focus | Key features |
|---|---|---|
| 1 (now) | Core MVP | QR, AI reviews, Shield, owner dashboard, email alerts |
| 2 | Presence | Instagram, Facebook, Google Analytics integration |
| 3 | Retention | Discount coupons, loyalty offers for returning customers |
| 4 | Campaigns | Owner-run targeted marketing via email + WhatsApp to consented customers |

---

## 13. Confirmed Decisions

| Item | Decision |
|---|---|
| Trial | 7 days, full features, no card required |
| Monthly price | ₹599/month |
| Annual price | ₹4,999/year (~₹417/month, ~30% off) — *confirm* |
| Base plan business limit | 3 businesses |
| Higher tier limit | Unlimited (Phase 2 pricing TBD) |
| QR codes | Unlimited per business, individual tracking per QR |
| Notifications Phase 1 | Email via Resend only |
| WhatsApp notifications | Phase 2 (Interakt) |
| Social analytics | Phase 2 (placeholder tabs in Phase 1) |
| Customer consent checkbox | ✅ Build in Phase 1 thank-you screen |
| GBP API (full reviews + reply) | Path B — disabled until approved, greyed out in UI |

---

*Once open questions are answered, this document is ready to hand to Claude Code for implementation.*
