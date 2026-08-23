## Context

Archive `(3d) Peter Dejong attractor` is a discrete 3D map (not ODEs): six params `a`…`f`, seed `(0,0,0)`, positions ×50. Distinct from 2D `#36` (`peter_de_jong_attractor`). Delivery uses the same 3D trail scrub pattern as Lorenz/Aizawa/Halvorsen.

## Goals / Non-Goals

**Goals:**
- Active slug `peter_de_jong_attractor_3d`
- Trail page + About + thumb + notebook

**Non-Goals:**
- Sharing code with 2D de Jong page
- Porting archive algosome color formula (use trail fade palette)

## Decisions

1. **Hand-rolled 3D trail** (not `createAttractorPage`) — progressive buffer + `n` scrub + auto-rotate.
2. **Simultaneous discrete map** from previous state (archive `x1,y1,z1` then assign).
3. **Defaults** archive: `a=2.695, b=1.72, c=1.178, d=0.311, e=-1, f=-1`, seed `(0,0,0)`, scale 50.
4. **drawMode `line`** with translucent stroke (house 3D trail style); screenshot solid color for thumbs.
5. **Presets** include archive default plus a couple alternate `(a…f)` tuples in range [−5,5].

## Risks / Trade-offs

- Dense discrete polyline can look scribble-y → opacity + particle count tuned in QA/thumb.
- Confusable with 2D slug → keep `*_3d` suffix and notebook title clear.

## Open Questions

- None.
