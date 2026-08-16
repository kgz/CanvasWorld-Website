## Context

Sierpiński (`sierpinski_triangle.tsx`) already has pan/zoom hit-layer + transport depth. Only the visual HUD fights OD chrome. Mandelbrot (#67) established the reusable pattern in `mandelbrotHud.module.css`.

## Goals / Non-Goals

**Goals:**
- OD-language HUD for center/zoom + reset (+ hint)
- Preserve pan/zoom/reset/depth behavior
- Improve triangle readability if still faint under chrome

**Non-Goals:**
- Moving depth into Params panel (transport stays)
- New fractal math / UI controls beyond view HUD
- Mobile homepage (#65)

## Decisions

1. **Reuse Mandelbrot HUD CSS module** (import from `pages/maps/mandelbrotHud.module.css`) rather than duplicating tokens — same stage family.
2. **Hit layer uses `styles.hitLayer`** (absolute inset) instead of fixed full-viewport inline styles; wrap page content in `styles.root` like Mandelbrot.
3. **Contrast**: bump gasket fill toward cooler light (chrome fg family) and/or slightly higher default zoom so the triangle fills the stage better under vignette.
4. **Bare modes**: hide HUD chrome in screenshot/iframe like Mandelbrot (optional consistency).

## Risks / Trade-offs

- Sharing CSS across maps/fractals couples paths; acceptable for one chrome language.
- Color tweak may change screenshot thumbs — acceptable for QA polish.

## Migration

None.
