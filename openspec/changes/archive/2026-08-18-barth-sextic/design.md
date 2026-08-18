## Context

Gyroid already ships `polygoniseGrid`. Barth’s sextic is the affine chart

\[4(\tau^2 x^2-y^2)(\tau^2 y^2-z^2)(\tau^2 z^2-x^2)-(1+2\tau)(x^2+y^2+z^2-1)^2=0\]

with \(\tau=(1+\sqrt5)/2\). 65 ordinary double points (15 at infinity in \(\mathbb{RP}^3\)).

## Goals / Non-Goals

**Goals:** Lit mesh of the classic icosahedral sextic; OD chrome; gallery thumb. No extra GUI knobs — transport `n` only.

**Non-Goals:** Projective chart; exact node markers; Clebsch (#90) in this change.

## Decisions

1. **Reuse gyroid isosurface walker.** Sample a cube \([-1.85,1.85]^3\) at grid res 40 (baked, not UI).
2. **Iso 0** is the real surface (no offset param).
3. **Color by xyz** (teal/gold), same mesh chrome as gyroid.
4. **Transport `n`** reveals triangles. Screenshot draws full mesh.

## Risks / Trade-offs

- [Nodes make a vanishing gradient] → res 40; double-sided lighting hides holes.
- [Too-small bound clips arms] → baked half-width 1.85 fits the usual Wikipedia pose.
