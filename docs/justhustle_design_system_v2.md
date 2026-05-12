# JustHustle — Design System v2.0

> Replaces the previous Airtable-inspired system.
> Based on Color Hunt palette #5: Deep Navy + Coral + Sand.
> All components must be fully responsive: 375px → 768px → 1024px → 1280px+

---

## Color Palette

### Primary Colors
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#131842` | Sidebar bg, primary CTA buttons, page footers, strong headings |
| `--color-primary-hover` | `#1a2155` | Hover state on primary buttons |
| `--color-accent` | `#E68369` | Interactive accent, star ratings, active nav items, highlights, links |
| `--color-accent-hover` | `#d9705a` | Hover state on accent elements |
| `--color-accent-light` | `#f5d5cc` | Accent tints, badge backgrounds, soft highlights |

### Surface Colors
| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#ffffff` | Default page background |
| `--color-canvas-warm` | `#FBF6E2` | Warm canvas — landing page hero, alternating sections |
| `--color-surface-soft` | `#ECCEAE` | Warm card backgrounds, section dividers, sand tones |
| `--color-surface-mid` | `#f0ebe0` | Slightly deeper warm surface |
| `--color-surface-dark` | `#131842` | Sidebar, dark sections |
| `--color-sidebar` | `#131842` | Dashboard sidebar background |
| `--color-sidebar-hover` | `#1e2760` | Sidebar nav item hover |
| `--color-sidebar-active` | `#E68369` | Active sidebar nav item indicator |

### Text Colors
| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#131842` | Primary headings, strong text |
| `--color-body` | `#2d3056` | Body text (slightly warm navy) |
| `--color-muted` | `#6b7280` | Secondary text, captions, placeholders |
| `--color-on-primary` | `#ffffff` | Text on dark navy backgrounds |
| `--color-on-accent` | `#ffffff` | Text on coral accent backgrounds |
| `--color-on-warm` | `#131842` | Text on sand/cream backgrounds |

### Semantic Colors
| Token | Value | Use |
|---|---|---|
| `--color-success` | `#16a34a` | Success states, resolved badges |
| `--color-warning` | `#d97706` | Trial warnings, caution states |
| `--color-error` | `#dc2626` | Error states, Shield catches badge |
| `--color-star` | `#E68369` | Star rating color (accent reused — warm and review-appropriate) |
| `--color-hairline` | `#e5e0d8` | Borders, dividers (warm-tinted) |
| `--color-hairline-dark` | `#2a3068` | Borders on dark navy surfaces |

---

## Typography

### Fonts
- **Display / Headings:** Inter (weight 400 for H1/H2, weight 500 for H3/H4)
- **Body:** Inter (weight 400)
- **Mono:** System monospace (for QR URLs, codes)

### Scale
| Element | Size | Weight | Color |
|---|---|---|---|
| H1 (hero) | 56–72px | 400 | `#131842` |
| H2 (section) | 36–48px | 400 | `#131842` |
| H3 (card title) | 24px | 500 | `#131842` |
| H4 (label) | 18px | 500 | `#131842` |
| Body large | 18px | 400 | `#2d3056` |
| Body | 16px | 400 | `#2d3056` |
| Small / caption | 14px | 400 | `#6b7280` |
| Tiny / badge | 12px | 500 | varies |

---

## Spacing & Layout

| Token | Value | Use |
|---|---|---|
| `--spacing-section` | `96px` | Vertical rhythm between landing page sections |
| `--spacing-page` | `32px` | Dashboard page padding |
| Dashboard sidebar width | `256px` | Fixed, collapsible to 64px on mobile |
| Max content width | `1280px` | `max-w-7xl` |
| Dashboard max content | `1024px` | `max-w-5xl` inside content area |

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | `4px` | Badges, tiny chips |
| `--radius-sm` | `6px` | Input fields, small buttons |
| `--radius-md` | `10px` | Standard buttons, small cards |
| `--radius-lg` | `16px` | Main cards, panels |
| `--radius-xl` | `24px` | Large feature cards, modals |
| `--radius-pill` | `9999px` | Toggle switches, plan pills |

---

## Component Patterns

### Buttons

**Primary button** (main CTA):
```
bg: #131842 | text: #ffffff | radius: 10px | weight: 500
hover: #1a2155 | padding: 12px 24px
```

**Accent button** (secondary CTA, review actions):
```
bg: #E68369 | text: #ffffff | radius: 10px | weight: 500
hover: #d9705a | padding: 12px 24px
```

**Outline button**:
```
bg: transparent | border: 1.5px solid #e5e0d8 | text: #131842 | radius: 10px
hover: bg #FBF6E2
```

**Ghost button** (nav, subtle actions):
```
bg: transparent | text: #6b7280 | radius: 8px
hover: bg #f0ebe0 | text: #131842
```

**Destructive button**:
```
bg: #dc2626 | text: #ffffff | radius: 10px
hover: #b91c1c
```

---

### Cards

**Standard card** (dashboard stats, business cards):
```
bg: #ffffff | border: 1px solid #e5e0d8 | radius: 16px
padding: 24px | shadow: 0 1px 3px rgba(19,24,66,0.06)
```

**Warm card** (featured/highlight cards):
```
bg: #FBF6E2 | border: 1px solid #ECCEAE | radius: 16px
padding: 24px
```

**Dark card** (inverse, CTA sections):
```
bg: #131842 | text: #ffffff | radius: 16px
padding: 32px
```

**Accent card** (alerts, Shield catches):
```
bg: #f5d5cc | border: 1px solid #E68369 | radius: 12px
```

---

### Dashboard Sidebar

```
Width: 256px (desktop) | 64px icon-only (tablet) | slide-over (mobile)
Background: #131842
Logo area: 64px height, border-bottom: 1px solid #2a3068
Nav item: height 44px, padding 0 16px, radius 8px, text #c5c8e0
Nav item hover: bg #1e2760, text #ffffff
Nav item active: bg #E68369/15, text #E68369, left border 3px solid #E68369
Section label: text #6b7280, text-xs, uppercase, letter-spacing 0.08em
Bottom section: user avatar + name + logout icon
```

---

### Forms & Inputs

```
Input field:
  bg: #ffffff | border: 1.5px solid #e5e0d8 | radius: 8px
  padding: 10px 14px | text: #131842 | placeholder: #9ca3af
  focus: border #E68369 | ring: 3px #E68369/20

Label: text-sm font-medium #131842, margin-bottom 6px

Error state: border #dc2626 | ring #dc2626/20 | error text below in #dc2626

Helper text: text-xs #6b7280, margin-top 4px
```

---

### Star Rating Component (customer page)

```
Star size: 48px on mobile, 56px on tablet+
Color: #E68369 (accent) when selected/hovered
Color: #e5e0d8 (hairline warm) when empty
Animation: scale(1.2) + glow on select
Gap between stars: 12px
```

---

### Badges & Status Pills

| Type | bg | text | border |
|---|---|---|---|
| Active / Paid | `#dcfce7` | `#16a34a` | `#bbf7d0` |
| Trial | `#dbeafe` | `#1d4ed8` | `#bfdbfe` |
| Expired | `#fee2e2` | `#dc2626` | `#fecaca` |
| Paused | `#fef9c3` | `#ca8a04` | `#fef08a` |
| Open (Shield) | `#f5d5cc` | `#E68369` | `#ECCEAE` |
| Resolved | `#dcfce7` | `#16a34a` | `#bbf7d0` |
| Possible Match | `#f0f9ff` | `#0369a1` | `#bae6fd` |

---

## Layout Patterns by Context

### Landing Page
```
Background: alternates between #ffffff (hero, features) and #FBF6E2 (warm sections)
Signature dark section: #131842 bg with white text (CTA banner)
Accent section: #ECCEAE bg (testimonials or How It Works)
Max width: 1280px, padding: 0 24px (mobile) → 0 48px (desktop)
```

### Owner Dashboard
```
Outer shell: #f5f4f0 (slightly warm gray — not pure white, gives depth)
Sidebar: #131842 fixed left
Content area: white cards on warm-gray shell
Top bar: #ffffff with border-bottom
```

### Customer Review Page (`/r/[slug]`)
```
Background: radial gradient from #FBF6E2 center to #ECCEAE edges
(This is the ONE place gradients are allowed — it's mobile-only, not the marketing site)
Card: white, radius 24px, shadow-lg
Business logo: 72px circle, border 3px solid #ECCEAE
Stars: 52px each, #E68369 accent
Post button: full width, accent coral #E68369
```

### Admin Panel
```
Separate visual identity from owner dashboard
Sidebar: slightly different from owner — use #1E104E (slightly more purple)
to visually distinguish admin from owner at a glance
Accent: same #E68369
```

---

## Responsive Breakpoints

| Breakpoint | Min width | Context |
|---|---|---|
| `xs` | 375px | Small phones (iPhone SE) |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | iPad landscape, small laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Critical mobile rules
- Dashboard sidebar: always a bottom sheet or slide-over on `md` and below — never visible by default
- Customer review page: designed mobile-first — all sizing and tap targets optimised for 375px first
- Star buttons: minimum 44px tap target always
- All buttons: minimum 44px height on mobile
- Forms: full width on mobile, max 480px on desktop

---

## globals.css — Updated Token Reference

```css
@import "tailwindcss";

@theme {
  /* Primary palette */
  --color-primary: #131842;
  --color-primary-hover: #1a2155;
  --color-accent: #E68369;
  --color-accent-hover: #d9705a;
  --color-accent-light: #f5d5cc;

  /* Surfaces */
  --color-canvas: #ffffff;
  --color-canvas-warm: #FBF6E2;
  --color-surface-soft: #ECCEAE;
  --color-surface-mid: #f0ebe0;
  --color-surface-dark: #131842;
  --color-sidebar: #131842;
  --color-sidebar-hover: #1e2760;

  /* Text */
  --color-ink: #131842;
  --color-body: #2d3056;
  --color-muted: #6b7280;
  --color-on-primary: #ffffff;
  --color-on-accent: #ffffff;

  /* Semantic */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-star: #E68369;
  --color-hairline: #e5e0d8;
  --color-hairline-dark: #2a3068;

  /* Admin distinction */
  --color-admin-sidebar: #1E104E;

  /* Typography */
  --font-sans: var(--font-inter);
  --font-display: var(--font-inter);

  /* Spacing */
  --spacing-section: 96px;
  --spacing-page: 32px;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(19, 24, 66, 0.06), 0 1px 2px rgba(19, 24, 66, 0.04);
  --shadow-modal: 0 20px 60px rgba(19, 24, 66, 0.15);
  --shadow-sidebar: 4px 0 24px rgba(19, 24, 66, 0.12);
}
```

---

## Do's and Don'ts

### Do
- Use `#131842` navy for all primary actions and sidebar
- Use `#E68369` coral as the accent — star ratings, active states, success CTAs
- Use warm surfaces (`#FBF6E2`, `#ECCEAE`) for landing page alternating sections and card backgrounds
- Keep the hero section on the landing page clean white (`#ffffff`) — no gradients
- Allow a warm radial gradient on the customer review page only (mobile context)
- Dark navy sidebar always — never white sidebar

### Don't
- Don't use forest green (`#0a2e0e`) anymore — that's replaced by the navy primary
- Don't use pure black (`#000000`) for text — use `#131842` navy instead
- Don't use more than 2 accent colors on a single screen
- Don't bold H1/H2 display text — weight 400 always for large headings
- Don't add gradients to the marketing hero
- Don't use white text on the coral accent for large body text — only for buttons and badges
