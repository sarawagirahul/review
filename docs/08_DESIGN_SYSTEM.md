# ReviewBoost Design System (Airtable Inspired)

## Overview

The ReviewBoost marketing and application surfaces are quietly editorial. The base atmosphere is white canvas, dark ink type, generous whitespace, and a near-black pill CTA — nothing is fighting for attention until a section needs to. Brand voltage comes from **full-bleed signature cards** in Coral, Forest, and Dark Navy that punctuate long-scroll explainer pages.

**Key Characteristics:**
- **Primary CTA:** Near-black ink (#181d26) with white text and a 12px rounded corner. Confident and final, never decorative.
- **Secondary CTA:** White button with ink text and a hairline outline.
- **Hero:** White canvas. No atmospheric gradients or meshes. Brand strength comes from type and buttons sitting in clean whitespace.
- **Brand Voltage:** Signature surface cards (Coral, Forest, Dark Navy) carry full-bleed product callouts.
- **Demo-card Grids:** Carry product UI fragments on warm pastel surfaces (Peach, Mint, Cream).
- **Border Radius:** Hierarchical. 12px for primary CTAs/large cards, 10px for content cards, 6px for inputs, full for icon buttons. Pricing buttons use pill shapes.
- **Vertical Rhythm:** 96px (`spacing.section`) between major bands.

---

## Colors

### Brand & Accent
- **Primary:** `#181d26` (The dominant brand color. Used for primary CTA background, h1/h2 display type, and surface-dark bands.)
- **Primary Active:** `#0d1218` (Press state on primary buttons)

### Surface
- **Canvas:** `#ffffff` (Default page surface)
- **Surface Soft:** `#f8fafc` (Tabbed feature cards, featured pricing tier)
- **Surface Strong:** `#e0e2e6` (Light gray CTA banners)
- **Surface Dark:** `#181d26` (Dark navy CTA cards)
- **Hairline:** `#dddddd` (1px border tone for inputs, secondary-button outlines)

### Text
- **Ink:** `#181d26` (Strongest text — h1/h2 and primary button text-on-light)
- **Body:** `#333840` (Default running-text color)
- **Muted:** `#41454d` (Footer links, breadcrumbs, captions)
- **Border Strong:** `#9297a0` (Disabled secondary button outlines)
- **On Primary / On Dark:** `#ffffff`

### Signature Card Surfaces
- **Coral:** `#aa2d00` (Large signature cards, full-bleed with white type)
- **Forest:** `#0a2e0e` (Deep-green signature cards)
- **Cream:** `#f5e9d4` (Soft beige callout bands)
- **Pastels (Demo Cards):** Peach (`#fcab79`), Mint (`#a8d8c4`), Yellow (`#f4d35e`), Mustard (`#d9a441`)

### Semantic
- **Link:** `#1b61c9` (Inline body links. Not used for primary buttons!)
- **Info:** `#254fad` | Info Border: `#458fff`
- **Success:** `#006400` | Success Border: `#39bf45`

---

## Typography

### Font Family
- **Primary Stack (Marketing/Editorial):** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (Acting as substitute for Haas Grotesk).
- **Pricing Stack:** `Inter Display` at mid-weights (475 / 575) to signal commercial precision.

### Hierarchy & Weights
- Display sizes (h1, h2) prefer weight **400**. Visual emphasis comes from size and color, not boldness.
- Sub-titles and buttons use weight **500**.
- The only true bold (600) lives in legal/cookie surfaces.

---

## Layout & Whitespace
- **Vertical Padding:** `96px` universal vertical rhythm between major bands.
- **Card Padding:** `32px` for tabbed/pricing cards, `48px` inside signature cards, `24px` for cream callouts.
- **Whitespace Philosophy:** Hero sections sit in 96px+ of pure whitespace above/below the headline. No decorations in the whitespace.

## Elevation & Depth
- **Flat:** Body sections, top nav, footer.
- **Hairline:** 1px border for inputs, secondary buttons.
- **Color-block first, shadow second:** Shadows are extremely minimal. Depth is delegated to color contrast between white canvas and signature cards. No soft-glow language.

## Buttons
- **`button-primary`**: Background `#181d26`, Text `#ffffff`, Weight 500, Rounded 12px.
- **`button-secondary`**: Background `#ffffff`, Text `#181d26`, Hairline border `#dddddd`, Rounded 12px.
- **`button-pricing-pill`**: Background `#ffffff`, Text `#181d26`, Pill-shaped (`rounded-full`), used ONLY on pricing surface.

## Rules to Remember
1. **Never make the link color (`#1b61c9`) the primary button color.** The primary button is always near-black (`#181d26`).
2. **Never add a gradient backdrop to the hero.** The hero must be clean white.
3. **Never bold display type.** H1 and H2 should be weight 400.
4. **Never repeat the same surface mode consecutively.** Rhythm is white → signature card → white → cream → dark → white.
