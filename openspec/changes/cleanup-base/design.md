## Context

`_base.tsx` now only has production paths (particles, line trail, mesh, shader). Remaining debt is unused `renderToString` / `setCanvasRef`, and bedhead debug helpers exported from production utils.

## Goals / Non-Goals

**Goals:**
- No console logging from production viz utils
- No dead props or imports in `_base`

**Non-Goals:**
- Split `_base` into multiple files
- Fix pre-existing `tsc` line-ref typing (separate from this ticket)
- Refactor Mandelbrot/complex quadratic overlay

## Decisions

- **Delete `setCanvasRef`** — zero callers
- **Move `testBedheadAttractorTick` to the vitest file** — test-only helper, not production API
- **Delete `bedheadAttractorTest.ts`** — duplicate of the above
