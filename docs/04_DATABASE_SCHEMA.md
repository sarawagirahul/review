# Database Schema

## Overview

Database: Supabase Postgres  
Project URL: `https://rhsjbcvnwjxhftifzbkc.supabase.co`

**Tables (in dependency order):**
1. `users` — all user types (admin, owner, customer)
2. `owner_details` — subscription info for owners
3. `businesses` — Google Business locations
4. `reviews` — customer review submissions (M2M: customers ↔ businesses)
5. `private_feedback` — Review Shield catches (< 3 stars)
6. `google_reviews` — cached Google reviews + AI reply tracking
7. `review_events` — analytics events (scans, clicks)
8. `whatsapp_otps` — temporary OTP verification records

---

## Complete SQL

```sql
-- ═══════════════════════════════════════════════════════
-- ENABLE REQUIRED EXTENSIONS
-- ═══════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════
-- TABLE 1: users
-- Everyone who touches ReviewBoost: admin, owner, customer
-- ═══════════════════════════════════════════════════════
CREATE TABLE users (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL UNIQUE,
  full_name           TEXT,
  avatar_url          TEXT,
  phone               TEXT,
  whatsapp_phone      TEXT,
  whatsapp_verified   BOOLEAN DEFAULT FALSE,
  role                TEXT NOT NULL DEFAULT 'customer'
                      CHECK (role IN ('admin', 'owner', 'customer')),
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  last_active_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════
-- TABLE 2: owner_details
-- Additional info for users with role = 'owner'
-- ═══════════════════════════════════════════════════════
CREATE TABLE owner_details (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trial_ends_at             TIMESTAMPTZ,
  subscription_status       TEXT DEFAULT 'trial'
                            CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled', 'paused')),
  subscription_interval     TEXT CHECK (subscription_interval IN ('monthly', 'annual')),
  razorpay_customer_id      TEXT,
  razorpay_subscription_id  TEXT,
  notification_email        TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER owner_details_updated_at
  BEFORE UPDATE ON owner_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════
-- TABLE 3: businesses
-- Each Google Business location linked to an owner
-- ═══════════════════════════════════════════════════════
CREATE TABLE businesses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- From Google My Business API
  google_location_id      TEXT,              -- accounts/{id}/locations/{id}
  google_place_id         TEXT,              -- ChIJXXXXXXX (for Maps deep-link)
  google_cid              TEXT,              -- Customer ID (alternative deep-link)
  name                    TEXT NOT NULL,
  primary_category        TEXT,
  additional_categories   JSONB DEFAULT '[]',
  description             TEXT,
  address_line1           TEXT,
  address_line2           TEXT,
  city                    TEXT,
  state                   TEXT,
  pincode                 TEXT,
  country                 TEXT DEFAULT 'IN',
  latitude                DECIMAL(10, 8),
  longitude               DECIMAL(11, 8),
  primary_phone           TEXT,
  additional_phones       JSONB DEFAULT '[]',
  website_url             TEXT,
  regular_hours           JSONB,             -- { MON: {open:"09:00",close:"21:00"}, ... }
  special_hours           JSONB,
  google_rating           DECIMAL(2, 1),
  google_review_count     INT DEFAULT 0,
  google_maps_url         TEXT,
  review_link             TEXT,              -- deep-link to write-review dialog
  is_verified_on_google   BOOLEAN DEFAULT FALSE,
  google_listing_status   TEXT DEFAULT 'PUBLISHED',
  opening_date            DATE,
  google_attributes       JSONB DEFAULT '{}',
  google_social_links     JSONB DEFAULT '{}',

  -- Owner-provided in ReviewBoost
  contact_email           TEXT,
  contact_phone           TEXT,
  whatsapp_business       TEXT,
  whatsapp_verified       BOOLEAN DEFAULT FALSE,
  instagram_url           TEXT,
  facebook_url            TEXT,
  youtube_url             TEXT,
  twitter_url             TEXT,
  logo_url                TEXT,              -- Supabase Storage URL
  brand_color_primary     TEXT DEFAULT '#6366F1',
  brand_color_secondary   TEXT DEFAULT '#FFFFFF',

  -- QR Customization
  qr_slug                 TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  qr_fg_color             TEXT DEFAULT '#000000',
  qr_bg_color             TEXT DEFAULT '#FFFFFF',
  qr_logo_embedded        BOOLEAN DEFAULT FALSE,
  qr_frame_text           TEXT DEFAULT 'Scan to Review Us',
  qr_frame_style          TEXT DEFAULT 'standard'
                          CHECK (qr_frame_style IN ('standard', 'rounded', 'bordered', 'minimal')),

  -- Review Page Customization
  review_page_tagline     TEXT,
  thank_you_message       TEXT,
  custom_cta_label        TEXT,

  -- Notification Preferences
  notify_email            TEXT,
  notify_whatsapp         TEXT,
  notify_new_review       BOOLEAN DEFAULT TRUE,
  notify_shield_catch     BOOLEAN DEFAULT TRUE,
  notify_weekly_summary   BOOLEAN DEFAULT FALSE,

  -- Analytics
  total_scans             INT DEFAULT 0,
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  google_data_synced_at   TIMESTAMPTZ
);

CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_slug ON businesses(qr_slug);
CREATE INDEX idx_businesses_place_id ON businesses(google_place_id);

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════
-- TABLE 4: reviews
-- M2M bridge: customers ↔ businesses
-- One row per review session (scan → AI → post)
-- ═══════════════════════════════════════════════════════
CREATE TABLE reviews (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id             UUID REFERENCES users(id) ON DELETE SET NULL,
  business_id             UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  rating                  INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  ai_generated_options    JSONB,             -- all 3 AI options generated
  final_text              TEXT,              -- what customer selected/edited
  language                TEXT DEFAULT 'en'
                          CHECK (language IN ('en', 'hi', 'hinglish')),
  submitted_to_google     BOOLEAN DEFAULT FALSE,
  is_verified_on_google   BOOLEAN DEFAULT FALSE, -- Fuzzy matched with a live Google review
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_rating ON reviews(business_id, rating);

-- ═══════════════════════════════════════════════════════
-- TABLE 5: private_feedback
-- Review Shield: intercepts ratings < 3 stars
-- ═══════════════════════════════════════════════════════
CREATE TABLE private_feedback (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  rating              INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message             TEXT,
  customer_name       TEXT,
  customer_contact    TEXT,
  is_resolved         BOOLEAN DEFAULT FALSE,
  resolved_at         TIMESTAMPTZ,
  resolved_note       TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_business ON private_feedback(business_id);
CREATE INDEX idx_feedback_resolved ON private_feedback(business_id, is_resolved);

-- ═══════════════════════════════════════════════════════
-- TABLE 6: google_reviews
-- Cached Google reviews + AI reply tracking
-- ═══════════════════════════════════════════════════════
CREATE TABLE google_reviews (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id             UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- From Google API
  google_review_id        TEXT NOT NULL UNIQUE,
  reviewer_name           TEXT,
  reviewer_photo_url      TEXT,
  rating                  INT CHECK (rating BETWEEN 1 AND 5),
  review_text             TEXT,
  review_date             TIMESTAMPTZ,

  -- Fuzzy Matching
  matched_customer_id     UUID REFERENCES users(id) ON DELETE SET NULL, -- Matched to our internal users table


  -- Existing reply on Google (fetched from API)
  has_reply               BOOLEAN DEFAULT FALSE,
  existing_reply_text     TEXT,
  existing_reply_date     TIMESTAMPTZ,

  -- Our AI reply workflow
  ai_generated_reply      TEXT,
  final_reply_text        TEXT,
  replied_via_portal      BOOLEAN DEFAULT FALSE,
  replied_at              TIMESTAMPTZ,

  -- Sync
  last_synced_at          TIMESTAMPTZ DEFAULT NOW(),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_google_reviews_business ON google_reviews(business_id);
CREATE INDEX idx_google_reviews_unanswered ON google_reviews(business_id, has_reply);

-- ═══════════════════════════════════════════════════════
-- TABLE 7: review_events
-- Analytics tracking: every significant user action
-- ═══════════════════════════════════════════════════════
CREATE TABLE review_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL
                CHECK (event_type IN ('scan', 'ai_generated', 'review_clicked', 'feedback_submitted', 'regenerate_clicked')),
  language      TEXT CHECK (language IN ('en', 'hi', 'hinglish')),
  rating        INT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_business ON review_events(business_id);
CREATE INDEX idx_events_type ON review_events(business_id, event_type);
CREATE INDEX idx_events_date ON review_events(business_id, created_at);

-- ═══════════════════════════════════════════════════════
-- TABLE 8: whatsapp_otps
-- Temporary OTP records for WhatsApp verification
-- ═══════════════════════════════════════════════════════
CREATE TABLE whatsapp_otps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone       TEXT NOT NULL,
  otp_hash    TEXT NOT NULL,        -- bcrypt hash of OTP (never store plain)
  expires_at  TIMESTAMPTZ NOT NULL, -- NOW() + 10 minutes
  verified    BOOLEAN DEFAULT FALSE,
  attempts    INT DEFAULT 0,        -- max 3 attempts before lockout
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otps_user ON whatsapp_otps(user_id);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_otps ENABLE ROW LEVEL SECURITY;

-- users: anyone can read their own row, admins can read all
CREATE POLICY "users_self_read" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_self_update" ON users
  FOR UPDATE USING (auth.uid() = id);

-- owner_details: owners can read/update their own
CREATE POLICY "owner_details_self" ON owner_details
  FOR ALL USING (user_id = auth.uid());

-- businesses: owners can CRUD only their own
CREATE POLICY "businesses_owner_all" ON businesses
  FOR ALL USING (owner_id = auth.uid());

-- businesses: public read for /r/[slug] page (needs slug + active check)
CREATE POLICY "businesses_public_read" ON businesses
  FOR SELECT USING (is_active = TRUE);

-- reviews: customers can insert, owners can read their business reviews
CREATE POLICY "reviews_customer_insert" ON reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "reviews_customer_read" ON reviews
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "reviews_owner_read" ON reviews
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- private_feedback: only owner of the business can read
CREATE POLICY "feedback_owner_read" ON private_feedback
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "feedback_anon_insert" ON private_feedback
  FOR INSERT WITH CHECK (TRUE); -- allow anonymous inserts from /r/[slug]

-- google_reviews: only owner can read/update
CREATE POLICY "google_reviews_owner" ON google_reviews
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- review_events: allow anon inserts (scan tracking), owner can read
CREATE POLICY "events_anon_insert" ON review_events
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "events_owner_read" ON review_events
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- whatsapp_otps: user can only see/modify their own
CREATE POLICY "otps_self" ON whatsapp_otps
  FOR ALL USING (user_id = auth.uid());
```

---

## Useful Queries

```sql
-- Shyam's review history across all businesses
SELECT r.*, b.name AS business_name, b.city, b.logo_url
FROM reviews r
JOIN businesses b ON r.business_id = b.id
WHERE r.customer_id = 'shyam-uuid'
ORDER BY r.created_at DESC;

-- All customers who reviewed Rahul Industries
SELECT u.full_name, u.email, r.rating, r.final_text, r.created_at
FROM reviews r
JOIN users u ON r.customer_id = u.id
WHERE r.business_id = 'rahul-uuid'
ORDER BY r.created_at DESC;

-- Admin: platform-wide stats
SELECT
  (SELECT COUNT(*) FROM users WHERE role = 'owner') AS total_owners,
  (SELECT COUNT(*) FROM users WHERE role = 'customer') AS total_customers,
  (SELECT COUNT(*) FROM businesses WHERE is_active = TRUE) AS active_businesses,
  (SELECT COUNT(*) FROM reviews) AS total_reviews,
  (SELECT COUNT(*) FROM private_feedback) AS total_shield_catches;

-- Unanswered Google reviews for a business (for review reply dashboard)
SELECT * FROM google_reviews
WHERE business_id = 'xxx' AND has_reply = FALSE
ORDER BY review_date DESC;

-- Scan analytics for a business (last 30 days)
SELECT
  DATE(created_at) AS date,
  COUNT(*) FILTER (WHERE event_type = 'scan') AS scans,
  COUNT(*) FILTER (WHERE event_type = 'review_clicked') AS review_clicks,
  COUNT(*) FILTER (WHERE event_type = 'feedback_submitted') AS feedback
FROM review_events
WHERE business_id = 'xxx'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;
```
