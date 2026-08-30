## Context

`Base` still supports lit `drawMode: 'mesh'`. Misc surfaces were later converted to particle wires (#105); #96 ships Costa as a lit mesh again, matching the pre-wire Enneper / gyroid page pattern.

Costa–Hoffman–Meeks is genus 1 with three ends (two catenoidal, one planar). Coordinates come from Weierstrass ζ and ℘ on the square lattice — not an implicit isosurface.

## Goals / Non-Goals

**Goals:** Lit truncated UV mesh of Costa’s surface; catalog card under `misc`; About names genus-1 / three ends; optional `margin` truncation knob; gallery thumb + notebook post.

**Non-Goals:** Full infinite ends; higher-genus Hoffman–Meeks family; particle-wire fallback; GPU elliptic shaders.

## Decisions

1. **Gray / Lin closed form** with ζ and ℘ on Λ = ℤ[i]. Bake lattice-sum evaluators (no new npm deps). Truncate the unit-square domain by `margin` so punctures at 0, ½, i/2 stay off-grid.
2. **Parametric UV grid**, not `polygoniseGrid`. Same triangle layout as mesh-era Enneper; skip non-finite / near-puncture cells.
3. **`margin` GUI** (default ~0.08): how much of the three ends to cut. Do not name a GUI param `n`.
4. **XYZ domain colors** then `centerAndScale` like Enneper mesh. Camera ~`[0,0,3.7]`.
5. **Reuse `drawMode: 'mesh'`.** Transport `n` via `progressTick`.

## Risks / Trade-offs

- [Lattice sum near punctures blows up] → clamp margin ≥ 0.04; skip non-finite verts / zero-area tris.
- [Coarse grid loses the neck] → bake UV_RES ~56.
- [e1 constant mismatch warps the surface] → compute e1 = ℘(½) from the same lattice sum used at runtime.
