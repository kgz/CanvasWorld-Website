## Context

Issue #2. Particle pages share Redux + animation scaffolding; Mandelbrot is shader-only.

## Goals / Non-Goals

**Goals:**
- `createAttractorPage(config)` owning datData dispatch, tick loop, trail colors, Base render, `getDescription`
- Migrate Clifford, Henon, Hopalong ×4

**Non-Goals:**
- Mandelbrot / shader factory
- Migrating every remaining attractor in this change
- Replacing Redux dat GUI (#11)

## Decisions

1. Factory lives at `pages/_attractorPage.tsx`
2. Params typed as `Record<string, ParamDef>`; iterate receives resolved `Record<string, number>`
3. Color presets: `purple` | `hsl-chunk` | `hsl-sin` (+ custom fn)
4. Scale: number or `(x,y) => [px, py]`
5. Routes keep same file default exports

## Risks / Trade-offs

- [Subtle behavior drift] → match existing seeds/scales/cameras per page 1:1
- [Remaining pages still duplicated] → acceptable; factory ready for follow-ups
