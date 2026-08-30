## Why

The existing `brusselator` route is the well-mixed ODE phase orbit. Blog and gallery need a distinct spatial reaction–diffusion Brusselator (spots/stripes/waves on a 2D grid) that embeds cleanly under `/chaos` and `?iframe`.

## What Changes

- New active catalog slug `brusselator_rd` (ODE `brusselator` unchanged)
- CPU grid RD integrator: Brusselator kinetics + diffusion, reflective (Neumann) borders
- Misc page: params `a`, `b`, `Du`, `Dv`, `dt`, grid size; live field render; About copy distinguishing ODE vs RD
- Gallery thumb + short lab-notebook post with VizEmbed
- Embed-friendly: basename `/chaos`, `?iframe`, screenshot pipeline

## Capabilities

### New Capabilities

- `brusselator-rd`: spatial Brusselator reaction–diffusion field viz on a dedicated catalog route

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/brusselatorRd.ts` (+ tests)
- `packages/frontend/src/pages/misc/brusselator_rd.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/frontend/src/blog/posts/brusselator-rd.mdx`
- `packages/backend/static/images/brusselator_rd.png`
- Issue #50
