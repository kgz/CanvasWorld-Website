## Why

The live UI is Tailwind + CSS modules (`template-modern.tsx`). `package.json` still pulls MUI, dat-gui, antd, leva, jquery, excel kits, and other stacks that nothing imports. That bloats install time and makes the “one chrome path” lie.

## What Changes

- Delete orphaned UI: `Menu.tsx`, old `index.tsx` gallery, unused SCSS / dat-gui warn shim
- Remove unused npm packages (MUI, antd, leva, jquery, excel/csv, tours, unused Vite plugins)
- Keep the live shell, viz stack (three/r3f), redux (until #11), Vite 3 (until #12), MDX/KaTeX, playwright thumbs

## Capabilities

### New Capabilities

- `frontend-deps`: frontend `package.json` only lists packages the live shell, viz, blog, or thumbs scripts import

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/package.json` + lockfile
- Delete: `src/modules/Menu.tsx`, `src/pages/index.tsx`, `src/pages/index-test.tsx`, `src/components/ui/`, unused SCSS
- `src/index.tsx`, `src/pages/_base.tsx`, `vite.config.ts` (drop unused babel decorator plugins)
- Closes #5
