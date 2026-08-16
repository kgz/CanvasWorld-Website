## Why

Sierpiński still uses a pre-chrome Tailwind overlay (`fixed top-20` gray card) that fights the OD canvas shell and duplicates chrome language. After Mandelbrot HUD polish (#67), this is the next same-pattern fix from stage QA.

## What Changes

- Replace the gray SaaS zoom/pan card with OD-family HUD (mono meta chip + glass reset), matching Mandelbrot stage HUD patterns
- Keep scroll-zoom, drag-pan, reset, and transport depth scrub unchanged in behavior
- Tune default framing and/or gasket contrast so the triangle reads clearly under vignette + chrome panels

## Capabilities

### New Capabilities

- `sierpinski-chrome-hud`: Stage HUD for Sierpiński uses OD chrome tokens/layout; interaction and depth transport remain available

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/fractals/sierpinski_triangle.tsx`
- New CSS module for HUD (reuse Mandelbrot HUD tokens/pattern)
- Possibly `packages/frontend/src/shaders/sierpinski.frag.glsl` for contrast
- Issue #68
