# Environment Variables

This document lists all the environment variables required for the project.

## Local Development Setup

Copy `.env.example` to `.env.local` and fill in the values.
**Never commit `.env.local` to version control.**

```bash
# ==========================================
# 1. NEXT.JS CONFIG
# ==========================================
# The public URL of your application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# 2. SUPABASE (Database & Auth & Storage)
# ==========================================
# Found in Supabase Dashboard -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://rhsjbcvnwjxhftifzbkc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Found in Supabase Dashboard -> Project Settings -> API (Service Role Secret)
# DANGER: Never expose this to the browser!
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ==========================================
# 3. GOOGLE OAUTH & MY BUSINESS API
# ==========================================
# Found in Google Cloud Console -> APIs & Services -> Credentials
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ==========================================
# 4. GOOGLE GEMINI AI
# ==========================================
# Found in Google AI Studio
GEMINI_API_KEY=your_gemini_api_key

# ==========================================
# 5. RAZORPAY (Payments)
# ==========================================
# Found in Razorpay Dashboard -> Settings -> API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yourkeyid
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Generated when setting up Razorpay Webhook in dashboard
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Your plan IDs created in Razorpay Dashboard -> Subscriptions -> Plans
NEXT_PUBLIC_RAZORPAY_PLAN_ID_MONTHLY=plan_monthly_id
NEXT_PUBLIC_RAZORPAY_PLAN_ID_ANNUAL=plan_annual_id

# ==========================================
# 6. RESEND (Email)
# ==========================================
# Found in Resend Dashboard -> API Keys
RESEND_API_KEY=re_your_resend_api_key

# The email address you are sending from (must be verified domain)
EMAIL_FROM=hello@reviewboost.com

# ==========================================
# 7. INTERAKT (WhatsApp - Phase 2)
# ==========================================
# INTERAKT_API_KEY=your_interakt_api_key
```

## Vercel Deployment

When deploying to Vercel, ensure all these variables (except the Interakt ones for Phase 1) are added in the Vercel Project Settings -> Environment Variables.

Make sure to change `NEXT_PUBLIC_APP_URL` to your actual production domain.
Also ensure you are using Production keys for Razorpay, not test keys.
