# Open Design brief — CanvasWorld frontpage

## Goal
Design the **CanvasWorld homepage** as a brand-first gallery landing page. Output `home.html` (+ CSS) in this project. Update `index.html` hub to link it.

## Brand
- Product name: **CanvasWorld** (must read as hero-level, not nav-only)
- Voice: scientific curiosity, atmospheric, calm confidence — not hype SaaS
- Avoid: purple/indigo glow themes, cream+terracotta clichés, broadsheet newspaper layouts, emoji, pill clusters, card-stuffed heroes

## First viewport (one composition)
- Brand name as the dominant text signal
- One headline + one short supporting sentence
- One CTA group (e.g. Enter gallery / Explore visualizations)
- One dominant visual plane (full-bleed atmosphere — fractal ink / void / soft scientific stage). No inset hero cards, no floating badges on the media.
- Do **not** put the viz card grid in the first viewport

## Below the fold
- Section: gallery of visualizations (cards OK here — they are the interaction)
- Sample items (use placeholder thumbs / abstract panels): Lorenz, Aizawa, Thomas, Chen, Halvorsen, Dadras, Four-wing, Sprott, Sphere, Sphere Mesh, Mandelbrot, Julia, Sierpinski, Barnsley, Hilbert, Hilbert 3D, L-System Tree
- One job: browse → click into a viz (links can be `#` stubs)
- Optional short footer: credit / about — keep minimal

## Constraints
- Desktop-first ~1280–1440px; readable on tablet/mobile
- Prefer CSS tokens in `css/shared.css`
- Static HTML/CSS/JS only — no real WebGL required (suggestive visual stage is fine)
- Ship 2–3 intentional motions (entrance / ambient / hover) — presence, not noise

## Out of scope
- Individual viz pages, auth, CMS, backend wiring
