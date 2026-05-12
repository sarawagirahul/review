# JustHustle — Admin Side: Finalized Scope v1.0

> Covers everything the Super Admin (platform owner) can see and do.
> Admin has unrestricted access to all data across all users, businesses, and transactions.
> Status: **Finalized**

---

## 1. Authentication

- Admin logs in via the same Google OAuth as everyone else
- Middleware checks `role = 'admin'` in `users` table
- If role is not admin → redirect to `/` (no error message revealing admin exists)
- All admin API routes use `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security
- Every admin API route double-checks `role = 'admin'` server-side (defence in depth)
- Admin account is never on a trial or subscription — always has full access

---

## 2. Admin Sidebar Navigation

1. **Dashboard** — platform-wide analytics
2. **Business Owners** — all registered owners
3. **Businesses** — all registered businesses
4. **Customers** — all registered reviewers
5. **Reviews & Feedback** — all reviews + all Shield catches platform-wide
6. **Revenue** — Razorpay subscription data
7. **Settings** — platform configuration

---

## 3. Dashboard

The admin's heartbeat. Everything important at a glance.

### Platform Stats Cards
| Metric | Detail |
|---|---|
| Total Business Owners | All time + new this month |
| Active Subscriptions | Currently paying (monthly + annual combined) |
| Trial Users | Currently on free trial |
| Total Businesses | Active across all owners |
| Total Customers | Unique reviewers registered |
| Total Reviews via JustHustle | All time + this month |
| Total Shield Catches | All time + this month |
| MRR | Monthly Recurring Revenue (from Razorpay) |
| ARR | Annual Recurring Revenue |
| Trial → Paid Conversion Rate | % of trials that converted |

### Charts
- **Owner Growth** — new business owners registered per week (last 12 weeks)
- **Revenue Trend** — MRR over last 12 months
- **Review Volume** — reviews generated per day (last 30 days), platform-wide
- **Conversion Funnel** — Trial started → Trial completed → Paid (platform-wide)
- **Plan Distribution** — pie chart: Monthly vs Annual subscribers

### Recent Signups Feed
Last 10 business owners who registered — name, email, date, current status (trial/active/cancelled).

### Alerts Panel
Items requiring admin attention:
- Failed payments (owner name + amount + date)
- Owners whose trial expired but haven't converted (count + list)
- Owners with subscription status `past_due`

---

## 4. Business Owners

### List View
- Searchable by name or email
- Filterable by status: All / Trial / Active / Past Due / Cancelled / Paused
- Sortable by: signup date, subscription status, business count, review count
- Each row: avatar, name, email, status badge, business count, review count, trial end or next billing date, Actions →

### Individual Owner Page
**Profile section:**
- Full name, email, phone, WhatsApp, GST number
- Profile photo
- Account created date, last active date
- Subscription status + plan (monthly/annual) + next billing date or trial end date
- Razorpay customer ID (for reference)

**Businesses section:**
- List of all businesses this owner has registered
- Per business: name, city, scan count, review count, Shield catches, status
- Quick link to that business's full admin page

**Activity section:**
- Last 20 events across all their businesses (scans, reviews, Shield catches)

**Admin Actions on this owner:**
| Action | Notes |
|---|---|
| Extend trial | Add N days to `trial_ends_at` — useful for support/goodwill |
| Activate subscription | Manually set `subscription_status = 'active'` |
| **Pause account** | Temporary hold on the entire owner account — all their businesses paused, dashboard shows "Account paused by admin" banner, owner cannot make changes. Admin-only lift. |
| Deactivate account | Full disable — all QR pages show basic fallback |
| Reactivate account | Reverse any pause or deactivation |
| Delete owner | Permanent cascade delete — all businesses, QRs, reviews, feedback deleted. Requires confirmation with owner email typed. |
| Send email | Open a compose modal → send a one-off email to this owner via Resend |

---

## 5. Businesses

### List View
- Searchable by business name or city
- Filterable by: category, subscription status of owner, active/inactive
- Sortable by: scan count, review count, Shield catches, created date
- Each row: logo + name, owner name, city, category, Google rating, scan count, status, Actions →

### Individual Business Page
All the same data as the owner sees in their dashboard — admin has full read access.

**Business details:**
- All fields (from Places API + owner-provided)
- Google Place ID, review link
- QR codes with nicknames + per-QR scan counts
- Shield inbox (all catches for this business)
- Review history

**Admin Actions on this business:**
| Action | Notes |
|---|---|
| **Pause business** | Temporary hold — QR page shows "temporarily unavailable" message, owner dashboard shows "Paused by admin" banner. Owner cannot reactivate themselves — must contact support. |
| **Deactivate business** | Owner-initiated or admin-initiated full disable — QR page shows basic Google review fallback. Owner can reactivate from their Settings tab. |
| Reactivate business | Lifts either pause or deactivation — restores full AI review experience |
| Delete business | Permanent — all QRs, reviews, Shield catches for this business deleted. Requires confirmation with business name typed. |
| Preview QR page | Opens `/r/[slug]` in a new tab — see exactly what the customer sees |

---

## 6. Customers

### List View
- Searchable by name or email
- Sortable by: total reviews given, signup date, last active date
- Each row: avatar, name, email, total reviews, businesses reviewed, last active, Actions →

### Individual Customer Page
**Profile:**
- Full name, email, phone, WhatsApp (if provided)
- Joined date, last active date
- Total reviews submitted across all businesses

**Review History:**
Complete list of every review this customer has submitted via JustHustle:
- Business name + logo, star rating given, final review text, language, date
- Whether it was submitted to Google (clicked Post) or was a Shield catch

**Admin Actions on this customer:**
| Action | Notes |
|---|---|
| Deactivate account | Customer cannot log in; their existing reviews are preserved |
| Reactivate account | Restores access |
| Delete account | Permanent — sets `customer_id = null` on all their reviews (data preserved, identity removed). Requires confirmation. |

---

## 7. Reviews & Feedback

### Platform Reviews Tab
All reviews submitted via JustHustle across every business.
- Filter by: rating, business, owner, language, date range
- Each row: business name, reviewer name (if signed in) or "Anonymous," rating, review text (truncated), date, language
- Click to expand full review text

### Platform Shield Inbox
All private feedback across every business (admin visibility — not just one owner's).
- Filter by: business, rating (1 star / 2 star), status (open / resolved), date range
- Each row: business name, owner name, customer name (if provided), rating, message (truncated), date, status
- Click to expand full feedback + internal owner notes
- Admin can see whether the owner has resolved it or not — useful for spotting owners who ignore complaints

---

## 8. Revenue

Razorpay data surfaced via admin API.

### Summary Cards
| Metric | Detail |
|---|---|
| MRR | Total monthly recurring revenue |
| ARR | Annualised revenue |
| Active Monthly Plans | Count + revenue |
| Active Annual Plans | Count + revenue |
| Trial Users | Currently active trials |
| Failed Payments | Count this month |
| Churn This Month | Cancellations |
| Conversion Rate | Trials → paid (all time + this month) |

### Revenue Chart
MRR trend over last 12 months — line chart.

### Subscriptions Table
All active subscriptions:
- Owner name + email, plan type (monthly/annual), amount, billing date, Razorpay subscription ID, status

### Failed Payments Table
All failed payment events:
- Owner name + email, amount, failed date, failure reason, current subscription status
- Quick link to that owner's page for manual follow-up

---

## 9. Platform Settings

Admin-only configuration for the platform itself.

| Setting | Default | Notes |
|---|---|---|
| Trial duration | 7 days | Changing this affects new signups only |
| Grace period after trial expiry | 3 days | Days of full access after day 7 |
| Monthly plan price | ₹599 | For display — actual price set in Razorpay |
| Annual plan price | ₹4,999 | Same note |
| Platform maintenance mode | Off | When ON: all pages show "We'll be right back" except admin |
| Support email | support@justhustle.in | Shown in footer + error pages |
| Admin notification email | — | Where critical platform alerts go (payment failures, etc.) |

**Manage Admins:**
- List of all users with `role = 'admin'`
- Add admin: search by email → change role to admin
- Remove admin: change role to owner or customer (cannot remove yourself)

---

## 10. Technical Notes

**All admin routes:**
- Protected by middleware: `role !== 'admin'` → redirect to `/`
- Use `SUPABASE_SERVICE_ROLE_KEY` on all DB queries (bypasses RLS)
- Route group: `(admin)/admin/**`
- Layout: `(admin)/layout.tsx` — separate from dashboard layout, admin-specific sidebar

**Performance:**
- Platform dashboard stats are computed queries — cache for 5 minutes to avoid hammering DB on every refresh
- Revenue data fetched from Razorpay API server-side on each page load (Razorpay has its own caching)

---

## 11. Phase 1 vs Later

### Phase 1 — Build now
- Full admin dashboard with platform stats
- Owners list + individual owner page + all actions (extend trial, deactivate, delete, send email)
- Businesses list + individual business page + actions
- Customers list + individual customer page + actions
- Reviews & Feedback (platform-wide view)
- Revenue page (Razorpay data)
- Platform settings (trial duration, maintenance mode, manage admins)

### Phase 2 — Defer
- **Impersonation:** Multiple admins can log in and see the admin dashboard from their own admin perspective — each admin's actions are logged against their identity. Not "view as business owner." Useful when a second admin is added to the platform.
- **Bulk email campaigns:** Email all trial users, all churned users, etc. via Resend.
- **Geographic analytics:** Map view of where businesses are concentrated.
- **Category analytics:** Which business categories generate most reviews / highest conversion.
- **Export:** Download owner / customer / revenue data as CSV.

---

## 12. Admin Scope — Confirmed Decisions

| Decision | Confirmed |
|---|---|
| Admin auth | Same Google OAuth, role check in DB |
| DB access | Service role key (bypasses RLS) |
| Double-check role server-side | Yes — middleware + API route |
| Trial extension | Admin can add N days manually |
| Delete operations | Permanent, require typed confirmation |
| Revenue source | Razorpay API (not our DB) |
| Impersonation | Phase 2 |
| Bulk email | Phase 2 |
| CSV export | Phase 2 |
