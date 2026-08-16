## Why

Sierpiński triangle exists as an inactive catalog stub with a unicode slug (`sierpiński_triangle`) and an untracked fractal page. Activate it with an ASCII slug per #16 and wire it into the FE component map.

## What Changes

- Catalog slug → `sierpinski_triangle`, `active: true`, ASCII thumbnail path
- Page at `pages/fractals/sierpinski_triangle.tsx` (no unicode filenames)
- Extract membership helpers + unit tests; commit `matrixCoords`
- Register in `routes.tsx`; add placeholder icon PNG

## Capabilities

### Modified Capabilities
- `route-registry`: ASCII slug + active fractal entry

### New Capabilities
- `sierpinski-triangle`: recursive gasket membership viz

## Impact

- Closes #32 (related #16)
- Home grid gains one fractal card
