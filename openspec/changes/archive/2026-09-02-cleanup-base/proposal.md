## Why

`_base.tsx` is the shared viz renderer but still carries dead imports, unused canvas-ref plumbing, and debug helpers that log to the console. Issue #9; TestShaderPlane was already removed in #7.

## What Changes

- Strip dead code from `_base.tsx` (unused imports, `setCanvasRef` path)
- Remove `setCanvasRef` from particle props
- Delete duplicate `bedheadAttractorTest.ts`; move test-only helper out of production `bedheadAttractor.ts` without console spam

## Capabilities

### New Capabilities

- `viz-base`: lean `_base` renderer with no debug logging in production paths

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/_base.tsx`
- `packages/frontend/src/@types/gui.ts`
- `packages/frontend/src/utils/bedheadAttractor.ts`
- `packages/frontend/src/__tests__/attractors/bedhead_attractor.test.ts`
- Closes #9
