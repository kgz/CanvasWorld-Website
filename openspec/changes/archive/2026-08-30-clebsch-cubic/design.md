## Context

`Base` still supports lit `drawMode: 'mesh'` (Calabi–Yau / Barth era). Several misc pages were later converted to particle wires (#105); this ticket ships a lit mesh again, matching the pre-wire Barth pattern. Clebsch is the smooth diagonal cubic where all 27 lines are real.

## Goals / Non-Goals

**Goals:** Lit Hunt/Nordstrand affine mesh; empty dat.gui; About math on the cubic + 27 lines; gallery thumb; notebook post.

**Non-Goals:** Drawing the 27 lines as overlays; projective P⁴ chart UI; Eckardt point markers; particle-wire fallback.

## Decisions

1. **Affine Hunt field (Nordstrand).** Evaluate
   \(81(x^3+y^3+z^3)-189(\ldots)+54xyz+126(xy+xz+yz)-9(x^2+y^2+z^2)-9(x+y+z)+1\)
   on a regular grid and march zero with `polygoniseGrid` (same as original Barth).
2. **Empty options.** Bake resolution / bound; transport `n` only reveals triangles.
3. **XYZ / domain coloring** then `centerAndScale` like Barth. Camera ~`[0,0,3.7]`.
4. **Page pattern** from mesh-era `barth_sextic.tsx`: `drawMode="mesh"`, `progressTick`, `autoRotate={!isScreenshotMode()}`.

## Risks / Trade-offs

- [Bound too tight clips lobes] → SAMPLE_BOUND ~2.5; verify mesh has thousands of tris.
- [High GRID_RES cost] → ~40³ like classic Barth; rebuild once at mount.
- [Lines not drawn] → About copy states they exist; mesh alone is the viz.
