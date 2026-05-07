# Technical Architecture

## Stack Decision Log

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG for landing (SEO) + CSR for dashboard (web app) + API Routes (own backend) |
| Language | TypeScript | Type safety across frontend and backend |
| Styling | Tailwind CSS v3 | Utility-first, pairs well with Framer Motion |
| Animations | Framer Motion | Smooth mounts, typewriter effect, star animations |
| Icons | Lucide React | Consistent, clean iconography |
| Auth | Supabase Auth (Google OAuth) | Built-in Google OAuth, session management, integrates with RLS |
| Database | Supabase Postgres | Postgres with RLS policies, used as DB ONLY (no edge functions) |
| AI | Google Gemini 2.5 Flash | Fast generation (~1.5s), cost-effective, multilingual (EN/HI) |
| QR Codes | qrcode.react | Renders to canvas/SVG, supports PNG/PDF export |
| Payments | Razorpay | India-first, UPI + Cards + NetBanking + Wallets, INR native |
| Email | Resend | Simple API, great deliverability, React Email templates |
| WhatsApp | Interakt (Phase 2) | India-specific WhatsApp Business API partner, INR pricing |
| Storage | Supabase Storage | Logo uploads, QR assets |
| Deployment | Vercel | Edge-optimized, native Next.js support, easy env management |

---

## Critical Architecture Decisions

### 1. Supabase = Database Only
Supabase is used EXCLUSIVELY as:
- Postgres database (via `@supabase/supabase-js` client)
- Auth provider (Google OAuth)
- File storage (logos)

**NOT used:**
- Supabase Edge Functions ❌
- Supabase Realtime ❌
- Supabase triggers/hooks ❌
- Supabase background jobs ❌

All business logic lives in Next.js API Routes.

### 2. Backend = Next.js API Routes
The Next.js `/api/**` routes ARE the backend. They are:
- Standard TypeScript/Node.js code
- Not tied to Supabase
- Portable to Express/Fastify if ever needed
- Each route handles one concern

### 3. Authentication Layers (3-tier security)
```
Layer 1: Next.js Middleware (Edge)
  - Runs before page renders
  - Checks session cookie
  - Redirects based on role
  
Layer 2: Server-side page check
  - Verifies user owns the requested data
  - Defense in depth
  
Layer 3: Supabase RLS (Database)
  - Database physically refuses cross-user data access
  - Works even on direct API calls
```

### 4. Rendering Strategy
```
/                     → Static (SSG)  — SEO critical
/privacy, /terms      → Static (SSG)  — SEO needed
/r/[slug]             → Server (SSR)  — SEO + fast load for customers
/login                → Static (SSG)  — Simple
/dashboard/**         → Client (CSR)  — Rich web app, no SEO needed
/admin/**             → Client (CSR)  — Admin tool, no SEO needed
/profile              → Client (CSR)  — Customer profile
```

---

## Folder Structure

```
reviewboost/
├── app/
│   ├── (marketing)/               # Public routes — SSG
│   │   ├── page.tsx               # Landing page /
│   │   ├── privacy/page.tsx       # Privacy policy
│   │   └── terms/page.tsx         # Terms of service
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx         # Google OAuth sign-in
│   │   └── auth/
│   │       └── callback/route.ts  # Supabase OAuth callback
│   │
│   ├── (dashboard)/               # Protected — owners only
│   │   ├── layout.tsx             # Sidebar + auth guard
│   │   └── dashboard/
│   │       ├── page.tsx           # Overview
│   │       ├── setup/page.tsx     # Multi-step onboarding
│   │       ├── businesses/
│   │       │   ├── page.tsx       # All businesses list
│   │       │   └── [id]/
│   │       │       ├── page.tsx   # Business analytics + QR
│   │       │       ├── reviews/page.tsx  # Google reviews + AI reply
│   │       │       └── settings/page.tsx # Business settings
│   │       ├── feedback/page.tsx  # Private feedback inbox
│   │       └── billing/page.tsx   # Subscription management
│   │
│   ├── (admin)/                   # Protected — admin only
│   │   ├── layout.tsx             # Admin sidebar + auth guard
│   │   └── admin/
│   │       ├── page.tsx           # Platform dashboard
│   │       ├── owners/
│   │       │   ├── page.tsx       # All business owners
│   │       │   └── [id]/page.tsx  # Owner detail
│   │       ├── customers/
│   │       │   ├── page.tsx       # All customers
│   │       │   └── [id]/page.tsx  # Customer detail + review history
│   │       ├── businesses/
│   │       │   ├── page.tsx       # All businesses
│   │       │   └── [id]/page.tsx  # Business detail
│   │       ├── feedback/page.tsx  # All private feedback
│   │       └── revenue/page.tsx   # Razorpay analytics
│   │
│   ├── (customer)/                # Customer-facing
│   │   └── profile/
│   │       ├── page.tsx           # Review history
│   │       └── settings/page.tsx  # Edit profile, WhatsApp OTP
│   │
│   ├── r/
│   │   └── [slug]/page.tsx        # Customer review page (SSR)
│   │
│   └── api/
│       ├── auth/
│       │   ├── sync-profile/route.ts      # Create profile on first login
│       │   └── whatsapp/
│       │       ├── send-otp/route.ts      # Send WhatsApp OTP
│       │       └── verify-otp/route.ts    # Verify OTP
│       │
│       ├── ai/
│       │   ├── generate/route.ts          # Generate 3 review options (customer)
│       │   └── generate-reply/route.ts    # Generate owner reply to Google review
│       │
│       ├── businesses/
│       │   ├── create/route.ts            # Create business from Google location
│       │   └── [id]/route.ts              # Update business settings
│       │
│       ├── google/
│       │   ├── locations/route.ts         # Fetch owner's GBP locations
│       │   ├── reviews/route.ts           # Fetch + cache Google reviews
│       │   └── reviews/
│       │       ├── post-reply/route.ts    # Post reply to Google
│       │       ├── delete-reply/route.ts  # Delete reply
│       │       └── flag/route.ts          # Flag review as inappropriate
│       │
│       ├── feedback/
│       │   └── submit/route.ts            # Submit private feedback (Review Shield)
│       │
│       ├── events/
│       │   └── track/route.ts             # Track scan/click events
│       │
│       ├── razorpay/
│       │   ├── create-subscription/route.ts  # Create Razorpay subscription
│       │   └── webhook/route.ts              # Handle Razorpay payment events
│       │
│       ├── resend/
│       │   └── notify/route.ts            # Send email notifications
│       │
│       └── admin/
│           ├── stats/route.ts             # Platform-wide analytics
│           ├── owners/route.ts            # Owner CRUD
│           ├── customers/route.ts         # Customer CRUD
│           └── businesses/route.ts        # Business CRUD
│
├── components/
│   ├── ui/                        # Base UI components (Button, Input, Card, etc.)
│   ├── landing/                   # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTABanner.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                 # Dashboard components
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── BusinessCard.tsx
│   │   ├── QRDisplay.tsx
│   │   └── ReviewCard.tsx
│   ├── review/                    # Customer review page components
│   │   ├── StarRating.tsx
│   │   ├── AIReviewCards.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── PrivateFeedbackForm.tsx
│   │   ├── ThankYouScreen.tsx
│   │   └── Confetti.tsx
│   └── admin/                     # Admin panel components
│       ├── AdminSidebar.tsx
│       └── DataTable.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   └── server.ts              # Server-side Supabase client
│   ├── google/
│   │   ├── my-business.ts         # Google My Business API wrapper
│   │   └── oauth.ts               # OAuth token refresh helper
│   ├── gemini/
│   │   └── client.ts              # Gemini API client + prompts
│   ├── razorpay/
│   │   └── client.ts              # Razorpay client + helpers
│   ├── resend/
│   │   └── client.ts              # Resend client + email templates
│   └── utils/
│       ├── qr.ts                  # QR generation helpers
│       ├── slugify.ts             # URL slug helpers
│       └── format.ts             # Date, currency formatters
│
├── middleware.ts                  # Route protection (auth + role checks)
├── types/
│   ├── database.ts                # Generated Supabase types
│   └── index.ts                   # Shared TypeScript types
│
├── hooks/
│   ├── useSession.ts              # Current user session
│   ├── useBusiness.ts             # Business data + actions
│   └── useReviews.ts              # Reviews data + actions
│
├── emails/                        # Resend email templates
│   ├── TrialEnding.tsx
│   ├── TrialExpired.tsx
│   ├── NewFeedback.tsx
│   └── PaymentFailed.tsx
│
├── public/
│   ├── logo.svg
│   └── og-image.png               # Open Graph image for SEO
│
├── docs/                          # This documentation folder
│
├── .env.local                     # Environment variables (see 07_ENVIRONMENT_VARIABLES.md)
├── .env.example                   # Template for env vars (commit this)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Authentication Flow (Supabase Auth)

```
1. User clicks "Sign in with Google"
2. supabase.auth.signInWithOAuth({ provider: 'google', options: { queryParams: { access_type: 'offline', scope: '...' } } })
3. User sees Google consent screen
4. Google redirects to /auth/callback with code
5. Server exchanges code for session (access_token + refresh_token stored by Supabase)
6. POST /api/auth/sync-profile
   → Check if users row exists
   → Create if not (set role based on signup context)
7. Redirect to appropriate page based on role + onboarding status
```

## Middleware Logic

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request) // Supabase session from cookie

  // Protect /dashboard/* — owners only
  if (pathname.startsWith('/dashboard')) {
    if (!session) return redirect('/login')
    if (session.role === 'customer') return redirect('/')
  }

  // Protect /admin/* — admin only
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'admin') return redirect('/')
  }

  // Protect /profile — customers + owners
  if (pathname.startsWith('/profile')) {
    if (!session) return redirect('/login')
  }
}
```
