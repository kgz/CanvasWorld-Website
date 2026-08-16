## 1. Align backend route keys

- [x] 1.1 Fix `mandlebrot_set` → `mandelbrot_set` in `routes.go`
- [x] 1.2 Fix `hopalong_attractor_sin` → `hopalong_attractor_sinusoidal`
- [x] 1.3 Add `sierpiński_triangle` entry (description stub OK)
- [x] 1.4 Confirm remaining keys match FE `genPath` list

## 2. Fix screenshot + SSR URLs

- [x] 2.1 Screenshot URL: `{FRONTEND_URL}/{slug}?screenshot=true`
- [x] 2.2 SSR image paths: `/chaos/icons/{slug}.png` (default + per-route)
- [x] 2.3 SPA catch-all default image already `/chaos/icons/` — verify Mandelbrot default slug

## 3. Icon assets

- [x] 3.1 Rename `static/images/mandlebrot_set.png` → `mandelbrot_set.png`

## 4. Verify

- [x] 4.1 `go build` in `packages/backend`
- [x] 4.2 Spot-check slug list vs PNG filenames (document gaps e.g. Sierpiński missing PNG)
- [x] 4.3 Note URL contract in change artifacts (done via specs)

## Gaps noted

- `sierpiński_triangle` has no PNG yet (expected until #8 / regenerate)
- `brusselator` remains in BE only (FE commented out) — out of scope for #3
