# JustHustle Design System

Design guide for all pages — landing, dashboard, auth, and customer-facing flows. Keep the two surfaces in sync.

---

## Two-surface system

| Surface | Used for | Base bg | Base text |
|---|---|---|---|
| **Night** (dark) | Marketing / landing pages | `#07091a` (`bg-night`) | `#f0f4ff` (`text-night-text`) |
| **Canvas** (light) | Dashboard, auth, legal pages | `#ffffff` (`bg-canvas`) | `#181d26` (`text-ink`) |

These are **completely separate**. Never mix them in the same page.

---

## Night palette (marketing pages)

All tokens live in `src/app/globals.css` under `@theme`.

| Token | Hex | Usage |
|---|---|---|
| `bg-night` | `#07091a` | Primary page background |
| `bg-night-raised` | `#0c1128` | Alternate section background |
| `bg-night-card` | `#0f1629` | Navbar mobile menu, floating cards |
| `text-night-text` | `#f0f4ff` | Headings, labels |
| `text-night-muted` | `#94a3b8` | Body copy, card text |
| `text-night-subtle` | `#64748b` | Meta, timestamps, captions |
| `text-night-accent` / `bg-night-accent` | `#22c55e` | CTAs, badges, icons, chart bars |
| `bg-night-accent-hover` | `#16a34a` | Button hover state |

### Glass cards (Tailwind arbitrary values)
```
bg-white/[0.04]   border border-white/[0.08]   — standard card
bg-white/[0.06]   border border-white/[0.10]   — elevated card
```

### Ambient glow blobs
Use absolutely-positioned divs with `blur-[120px]` and low opacity. Standard recipe:
```tsx
<div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-night-accent/[0.06] blur-[140px]" />
<div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#8b5cf6]/[0.05] blur-[100px]" />
```

### Section rhythm (alternating backgrounds)
```
Hero             bg-night          (with glow blobs)
StatsBar         bg-night-raised
HowItWorks       bg-night
Features         bg-night-raised
DashboardShowcase bg-night
Testimonials     bg-night-raised
Pricing          bg-night
CTABanner        bg-night-raised
Footer           bg-night
```

---

## Canvas palette (dashboard / post-login pages)

| Token | Value | Usage |
|---|---|---|
| `bg-canvas` | `#ffffff` | Page background |
| `bg-surface-soft` | `#f8fafc` | Sidebar, table rows, input bg |
| `bg-surface-strong` | `#e0e2e6` | Dividers, empty states |
| `bg-surface-dark` | `#181d26` | Dark accent panels |
| `text-ink` | `#181d26` | Headings |
| `text-muted` | `#41454d` | Body copy |
| `border-hairline` | `#dddddd` | Card borders, dividers |
| `text-signature-forest` / `bg-signature-forest` | `#0a2e0e` | Primary CTA, active states |

### Dashboard card pattern
```tsx
<div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-subtle">
```

### Dashboard stat card pattern
```tsx
<div className="rounded-xl border border-hairline bg-canvas p-4">
  <p className="text-xs text-muted">{label}</p>
  <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
  <p className="mt-0.5 text-xs text-signature-forest">{delta}</p>
</div>
```

---

## Typography

| Element | Night surface | Canvas surface |
|---|---|---|
| H1 | `font-bold text-night-text` | `font-normal text-ink` |
| H2 | `font-bold text-night-text` | `font-normal text-ink` |
| H3 | `font-bold text-night-text` | `font-normal text-ink` |
| Body | `text-night-muted` | `text-muted` |
| Caption | `text-night-subtle text-xs` | `text-muted text-xs` |
| Section label | `text-xs font-semibold uppercase tracking-[0.2em] text-night-accent` | `text-xs font-semibold uppercase tracking-wider text-signature-forest` |

Font: Inter throughout. `font-display` and `font-sans` both resolve to Inter.

---

## Buttons

### Night surface
```tsx
// Primary CTA
<a className="rounded-full bg-night-accent px-7 py-3.5 font-semibold text-night hover:bg-night-accent-hover">

// Secondary / ghost
<a className="rounded-full border border-white/[0.12] bg-white/[0.05] text-night-text hover:bg-white/[0.08]">
```

### Canvas surface (use `<Button>` component)
```tsx
<Button variant="primary">   // bg-primary (dark navy)
<Button variant="secondary"> // white border
<Button variant="ghost">     // text only
```

Override for forest green: `className="bg-signature-forest hover:bg-signature-forest/90"`

---

## Icons
Lucide React throughout. Standard sizes:
- `h-4 w-4` — inline icons, badges
- `h-5 w-5` — feature card icons
- `h-6 w-6` — nav, prominent actions

Night surface: `text-night-accent` for brand icons, `text-night-muted` for neutral.
Canvas surface: `text-signature-forest` for brand icons, `text-muted` for neutral.

---

## Animations (Framer Motion)

### Entrance
```tsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

### Stagger children
```tsx
transition={{ delay: index * 0.08, duration: 0.5 }}
```

### Button hover
```tsx
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
```

### Chart bars (animated on scroll)
```tsx
initial={{ height: 0 }}
whileInView={{ height: `${percent}%` }}
viewport={{ once: true }}
transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

### Marquee (infinite scroll)
```tsx
animate={{ x: ["0%", "-50%"] }}  // double the items array first
transition={{ duration: 35, ease: "linear", repeat: Infinity }}
```

**Spring limitation**: Framer Motion spring/inertia only supports 2 keyframes. Use `type: "tween"` for 3-value arrays.

---

## Layout

Max content width: `max-w-7xl` (1280px) with `px-6 md:px-12` padding.
Section vertical padding: `py-24`.
Card border radius: `rounded-2xl` (16px), `rounded-3xl` (24px) for feature cards.

---

## Dashboard-specific guidelines (post-login)

When building dashboard pages:

1. **Use Canvas surface** — white background, light cards, ink text.
2. **Sidebar**: dark (`bg-surface-dark`), white text, `text-night-accent` for active nav item.
3. **Stat cards**: follow the dashboard stat card pattern above.
4. **Tables**: `bg-canvas`, `bg-surface-soft` on hover rows, `border-hairline` dividers.
5. **Charts**: use `bg-signature-forest` for bars/lines on light backgrounds.
6. **Empty states**: `bg-surface-soft` rounded panel, centered, `text-muted`.
7. **Form inputs**: `bg-canvas border border-hairline rounded-lg`, focus `ring-2 ring-signature-forest/20`.
8. **Danger zones**: `bg-signature-coral/5 border border-signature-coral/20 text-signature-coral`.

### Dashboard nav items (sidebar)
```tsx
// Active
<a className="flex items-center gap-3 rounded-lg bg-white/[0.08] px-3 py-2 text-sm font-medium text-white">

// Inactive  
<a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white">
```

---

## Consistency checklist

Before shipping any page:
- [ ] Is the page on the right surface (night vs canvas)?
- [ ] Are heading weights correct (bold on night, normal on canvas)?
- [ ] Are accent colors correct (`night-accent` on dark, `signature-forest` on light)?
- [ ] Do interactive elements have hover/active states?
- [ ] Are entrance animations using `viewport={{ once: true }}`?
- [ ] Is `overflow-hidden` on the page wrapper to prevent horizontal scroll from marquees?
