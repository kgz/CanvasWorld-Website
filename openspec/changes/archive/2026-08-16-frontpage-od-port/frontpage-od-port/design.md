## Context

OD prototype at `design/canvasworld-prototype/home.html` is the visual source of truth. Live home is `packages/frontend/src/pages/index-new.tsx` (Tailwind “dashboard” hero + FractalCard grid). Issue #24.

## Goals / Non-Goals

**Goals:**
- Match OD first-viewport composition (brand hero, CTAs, ink canvas, gallery below fold)
- Gallery driven by `routes` + `genPath` with real icon URLs
- Preserve basename `/chaos` routing

**Non-Goals:**
- Redesign viz page chrome (`template-modern`)
- Change backend registry / icon pipeline
- Pixel-perfect CSS clone if tokens + structure match

## Decisions

1. **Replace `index-new.tsx` in place** — already the catch-all home route in `template.tsx`.
2. **Dedicated CSS module** (`frontpage.module.css`) ported from OD `shared.css` home section — avoid fighting existing Tailwind purple gradients on shared UI components.
3. **Hero canvas as React component** — port the 2D ink-strand animation; respect `prefers-reduced-motion`.
4. **Real thumbs over abstract gradients** — use `/chaos/icons/{slug}.png`; keep OD card chrome.
5. **Single gallery group** from registry (no hard-coded Lorenz list) — product has different systems than the OD sample list.
6. **Fonts** — load a display serif + clean body via Google Fonts (Literata + Source Sans 3) to match OD scientific tone without system Inter defaults.

## Risks / Trade-offs

- [Missing icons] → img onError fallback to OD-style abstract thumb class
- [Tailwind global styles clash] → scope page under a root class; prefer module CSS
- [Random CTA with few routes] → still works; highlight + scroll to card
