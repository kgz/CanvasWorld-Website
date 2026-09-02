## Why

`routes.tsx` statically imported every viz page, bundling ~1.76 MB of JS on the home route.

## What Changes

- Dynamic `import()` per catalog slug via `vizPageLoaders.ts`
- `React.lazy` routes + `Suspense` stage fallback
- Lazy-load `template-modern` chrome from `template.tsx`
- `benchmark:home` script + before/after results in `benchmarks/home-code-split.json`

## Capabilities

### New Capabilities

- `code-split-viz`: Lazy viz page loading contract

## Impact

- `packages/frontend/src/@types/routes.tsx`
- `packages/frontend/src/modules/vizPageLoaders.ts`
- `packages/frontend/src/pages/template.tsx`, `template-modern.tsx`
