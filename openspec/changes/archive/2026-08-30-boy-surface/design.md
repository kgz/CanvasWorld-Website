## Context

Barth and Calabi–Yau already ship lit `drawMode: 'mesh'` pages. Boy’s surface is a parametric immersion of RP² (Bryant–Kusner), not an implicit isosurface.

## Goals / Non-Goals

**Goals:** Lit Bryant–Kusner mesh; empty dat.gui like Barth; OD chrome; About copy that this is an RP² immersion, not an embedding.

**Non-Goals:** Extra GUI knobs; gallery thumb capture in this worktree; Apéry polynomial implicit; exact Möbius-boundary welding.

## Decisions

1. **Bryant–Kusner on the unit disk.** Polar grid \(w=r e^{i\theta}\) with \(r\in[0,1]\), \(\theta\in[0,2\pi]\). Wikipedia \(g_1,g_2,g_3\) then invert: \((x,y,z)=(g_1,g_2,g_3)/(g_1^2+g_2^2+g_3^2)\). Disk covers RP² once (boundary identified antipodally). A double-cover is acceptable.
2. **Baked resolution**, not UI. Transport `n` only (do not add a dat.gui param named `n`).
3. **Skip non-finite samples** (denominator zeros inside the disk). Drop quads that hit poles.
4. **XYZ coloring** and `centerAndScale` like gyroid/Barth. Canonical camera `[0,0,~3.7]`.
5. **Page pattern** from `barth_sextic.tsx`: empty `datData.options`, `progressTick`, `autoRotate={!isScreenshotMode()}`.

## Risks / Trade-offs

- [Poles of \(w^6+\sqrt{5}w^3-1=0\) inside the disk] → drop non-finite verts/quads; still enough triangles.
- [Boundary \(P(w)=P(-w)\) on \(|w|=1\)] → coincident equator; first mesh OK.
- [Self-intersections / triple point] → expected for an immersion; lighting is double-sided in Base.
