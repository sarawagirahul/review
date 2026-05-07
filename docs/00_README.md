# ReviewBoost — Project Documentation

## What Is This?

ReviewBoost is a B2B SaaS for **Indian businesses registered on Google Business Profile**. It helps businesses collect more 5-star Google reviews via AI-generated review drafts delivered through physical QR codes placed in their shop.

## How to Use These Docs

This folder contains everything needed to build, continue, or hand off the project to any developer or AI assistant (Copilot, Cursor, Windsurf, etc.).

**Read in this order if starting fresh:**

1. `01_PRODUCT_REQUIREMENTS.md` — What we're building and why
2. `02_USER_FLOWS.md` — How both user types interact with the app
3. `03_TECHNICAL_ARCHITECTURE.md` — Tech stack and folder structure
4. `04_DATABASE_SCHEMA.md` — Complete Supabase Postgres schema
5. `05_API_ROUTES.md` — All backend API routes
6. `06_PHASES.md` — What gets built in each phase
7. `07_ENVIRONMENT_VARIABLES.md` — All required secrets and config
8. `08_DESIGN_SYSTEM.md` — Colors, fonts, design tokens
9. `09_PROGRESS.md` — **Check this first to see current status**

## Quick Project Facts

| Item       | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 15 (App Router, TypeScript)                    |
| Styling    | Tailwind CSS v3 + Framer Motion                        |
| Database   | Supabase Postgres (`rhsjbcvnwjxhftifzbkc.supabase.co`) |
| Auth       | Supabase Auth (Google OAuth)                           |
| AI         | Google Gemini 2.5 Flash                                |
| Payments   | Razorpay                                               |
| Email      | Resend                                                 |
| WhatsApp   | Interakt (Phase 2)                                     |
| Deployment | Vercel                                                 |

## Three User Types

1. **Admin (You)** — Full control over everything at `/admin/**`
2. **Business Owner (e.g. Rahul)** — Manages their business(es) at `/dashboard/**`
3. **Customer/Reviewer (e.g. Shyam)** — Scans QR, rates, submits review at `/r/[slug]`

## Repository

- GitHub: `git@github.com:sarawagirahul/review.git`
- Supabase Project: `https://rhsjbcvnwjxhftifzbkc.supabase.co`
