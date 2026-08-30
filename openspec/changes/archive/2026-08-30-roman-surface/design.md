## Context

Barth and gyroid mesh implicit fields via `polygoniseGrid`. Roman surface is parametric: Steiner’s RP² immersion on \(u,v\in[0,\pi]\). Reuse `Base` `drawMode: 'mesh'` like Barth (empty GUI).

## Goals / Non-Goals

**Goals:** Lit UV-grid mesh of the standard Steiner parametrization (\(a=1\)); XYZ vertex colors; About names Steiner / RP²; transport `n` reveals triangles.

**Non-Goals:** GUI scale `a` or grid res; implicit quartic meshing; Boy’s surface (#other) in this change; gallery thumb capture in this worktree pass.

## Decisions

1. **Parametric UV grid, not isosurface.** \(x=a^2\cos u\sin u\sin v\), \(y=a^2\cos u\sin u\cos v\), \(z=a^2\cos^2 u\cos v\sin v\) with \(a=1\) baked. Two triangles per cell; skip near-zero-area tris (self-intersections / pinch).
2. **Baked resolution** (not UI). Empty `options` like Barth — no dat.gui `n`.
3. **centerAndScale** then XYZ colors, same chrome as Barth/gyroid.
4. **Transport `n`** (progressTick) reveals triangles. Screenshot draws full mesh.

## Risks / Trade-offs

- [Steiner pinches / triple point yield degenerate tris] → skip near-zero area; double-sided lighting hides holes.
- [Parametrization double-covers RP²] → expected for this immersion; do not try to uniquify verts.
