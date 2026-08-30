## Context

Barth and Calabi–Yau already ship `Base` `drawMode: 'mesh'`. Dini’s surface is a parametric helicoid of a tractrix (pseudosphere with twist), not an implicit. Classic equations:

\[
x = a\cos u\sin v,\quad
y = a\sin u\sin v,\quad
z = a\bigl(\cos v + \ln\tan(v/2)\bigr) + b u
\]

\(\ln\tan(v/2)\) blows up at \(v\to 0,\pi\).

## Goals / Non-Goals

**Goals:** Lit UV mesh of classic Dini; GUI `a`/`b` as shape; baked UV grid; catalog `misc`; About names Dini / pseudosphere.

**Non-Goals:** Isosurface / `polygoniseGrid`; GUI `n`/`res`/`bound`; extra turns knob; thumb capture in this worktree pass.

## Decisions

1. **Classic parametrization, not Kuen or full pseudosphere.** \(b=0\) is a tractrix-revolution band; default \(b\approx 0.2\) so it reads as Dini.
2. **Baked domain.** \(u\in[0,6\pi]\) (3 turns). \(v\in[0.15,1.0]\) to stay off the log singularity. Guard \(\tan(v/2)>\varepsilon\).
3. **UV grid baked** (~96×48), indexed tris. No meshing GUI.
4. **Shape params:** `a` radius (default 1), `b` twist (default 0.2). Clamp to finite positive-ish ranges.
5. **centerAndScale + XYZ vertex colors.** Drop non-finite verts. Transport `n` still scrubs triangles via existing mesh progress.
6. **Do not edit `_base.tsx` or other viz pages.** Append catalog + `routes.tsx` only.

## Risks / Trade-offs

- [\(\ln\tan(v/2)\) NaNs] → clamp \(v\) band + tan guard; skip non-finite samples.
- [Too little twist looks like a cup] → default \(b=0.2\), three turns.
- [High UV res] → bake ~96×48; rebuild only when `a`/`b` change.
