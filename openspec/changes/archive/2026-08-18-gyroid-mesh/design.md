## Context

`Base` already draws lit indexed meshes (Calabi–Yau). The gyroid is implicit, not parametric: Schoen’s approximation \(\sin x\cos y+\sin y\cos z+\sin z\cos x=t\) on a \(2\pi\)-periodic cell.

## Goals / Non-Goals

**Goals:** Lit unit-cell mesh; iso-level and resolution params; optional tiling; OD chrome; gallery thumb; About math matches code.

**Non-Goals:** Exact Weierstrass minimal-surface parametrization; Schwarz D/P in this change; GPU SDF raymarch.

## Decisions

1. **Marching cubes on the trigonometric implicit**, not Weierstrass. Close enough for the classic look; Schwarz P (#92) can reuse the cube walker.
2. **Domain** \([0, 2\pi\,\mathrm{tiles}]^3\). Default `tiles=1`, `t=0` (balanced gyroid), `res` = samples per period (~36).
3. **Weld vertices on grid edges** so lighting isn’t faceted-from-duplicates; `Base` still `computeVertexNormals`.
4. **Color by periodic position** (xyz → rgb) so tunnels read; not a single plastic.
5. **Transport `n`** reveals triangles, same as Calabi–Yau. Screenshot draws the full mesh.

## Risks / Trade-offs

- [High `res` × `tiles` vertex count] → clamp res 16–56, tiles 1–2.
- [Iso \(|t|\) too large empties the surface] → clamp \(t \in [-1.2, 1.2]\); default 0.
- [Periodic seams when tiling] → march the full tiled domain instead of instancing cells.
