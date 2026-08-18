## Context

`Base` already draws lit indexed meshes. Gyroid already ships `polygoniseGrid` in `isosurface.ts`. Schwarz P is the trigonometric primitive TPMS \(\cos x+\cos y+\cos z=t\) on a \(2\pi\)-periodic cell — clone the gyroid pipeline, do not edit `isosurface.ts` or `gyroid.ts`.

## Goals / Non-Goals

**Goals:** Lit unit-cell mesh; iso-level and optional tiling; baked grid resolution; OD chrome; About math matches code.

**Non-Goals:** Exact Weierstrass minimal-surface parametrization; Schwarz D/G in this change; GPU SDF raymarch; exposing `res`/`bound`/`n` in dat.gui; capturing gallery thumbs in this worktree.

## Decisions

1. **Reuse `polygoniseGrid`** on \(\cos x+\cos y+\cos z-t\). Same cube walker as gyroid; field renamed.
2. **Domain** \([0, 2\pi\,\mathrm{tiles}]^3\). Default `tiles=1`, `t=0` (balanced P). Grid `res` baked at 36 samples per period (not a GUI param).
3. **GUI** only `t` and `tiles` (1–2). No param named `n`; transport `n` still scrubs triangles via `progressTick`.
4. **Color by periodic position** (xyz → rgb), then `centerAndScale` like gyroid.
5. **Screenshot** draws the full mesh with autoRotate off.

## Risks / Trade-offs

- [`tiles=2` vertex count] → clamp tiles 1–2; baked res 36.
- [Iso \(|t|\) too large empties the surface] → clamp \(t \in [-1.2, 1.2]\); default 0.
- [Periodic seams when tiling] → march the full tiled domain instead of instancing cells.
