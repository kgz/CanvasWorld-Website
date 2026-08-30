## Context

Misc surfaces after #87 use `Base` with a particle wire (UV isolines / fibers), not lit mesh — same path as Dini / Boy / Roman. Hopf is a family of linked circles: sample fibers on S³, stereoproject to R³.

## Goals / Non-Goals

**Goals:** Active `hopf_fibration` misc route; fiber-circle particle wire; GUI for fiber count + stereographic strength; About with Hopf map S³ → S²; unit tests; notebook post; gallery thumb.

**Non-Goals:** Lit tube meshes; quaternion Julia; full S³ navigation UI; OD redesign run.

## Decisions

1. **Fiber circles, not an isosurface.** Hopf coordinates: fix base latitude/longitude on S², sample the S¹ fiber, stereoproject from the S³ pole. Color by base point on S².
2. **GUI:** `fibers` (count of base samples) and `stereo` (projection strength / how hard fibers inflate after stereo). Detail-per-fiber baked, padded to a fixed GPU budget like Dini.
3. **Reuse** `Base` 3D particle path + transport `n` grow-in. No `drawMode: 'mesh'`.
4. **Slug** `hopf_fibration` per ticket.

## Risks / Trade-offs

- [Fiber through projection pole → infinity] → skip / clamp η away from the pole; soft stereo param keeps cloud bounded.
- [Too few fibers look sparse] → default ~48 fibers × dense samples; presets for sparse/dense.
