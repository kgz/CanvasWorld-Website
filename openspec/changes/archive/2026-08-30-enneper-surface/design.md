## Context

`Base` already draws lit indexed meshes. Enneper is parametric, not implicit: the classical polynomial map \((u,v)\mapsto\mathbb{R}^3\) produces a self-intersecting minimal surface.

## Goals / Non-Goals

**Goals:** Lit UV-grid mesh of Enneper’s polynomial surface; catalog card under `misc`; About math matches code; one optional `span` domain knob.

**Non-Goals:** Weierstrass–Enneper higher-order family; isosurface meshing; res/bound GUI knobs; gallery thumb in this change.

## Decisions

1. **Classical polynomial**, not Weierstrass. \(x=u-u^3/3+uv^2\), \(y=v-v^3/3+vu^2\), \(z=u^2-v^2\). Matches the usual Wikipedia / textbook look.
2. **Domain** \(u,v\in[-\mathrm{span},\mathrm{span}]\). Default `span` in \(1.6\)–\(2.0\) so the self-intersections read. UI range \(1.2\)–\(2.5\). Do not name a GUI param `n` (transport `n` already reveals triangles).
3. **Baked UV resolution.** Uniform grid → indexed tris; no res/bound meshing knobs.
4. **Color by xyz** after parametrization, then `centerAndScale` like other mesh viz.
5. **Reuse `drawMode: 'mesh'`.** No `_base.tsx` changes.

## Risks / Trade-offs

- [Large `span` stretches the surface and self-intersections dominate] → clamp \(1.2\)–\(2.5\); default ~1.8.
- [Too-coarse UV grid faceting] → bake a dense enough grid (~48).
