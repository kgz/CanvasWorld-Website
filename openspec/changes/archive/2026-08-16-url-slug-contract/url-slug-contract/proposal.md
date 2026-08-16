## Why

FE, BE, screenshots, and icons disagree on URLs and slugs (`/chaos/{route}` vs `/{slug}`, `mandlebrot` vs `mandelbrot`, sin vs sinusoidal). Home cards and OG embeds break; chromedp captures the wrong page. Fix the contract before rewriting the screenshot pipeline (#8) or unifying the registry (#1).

## What Changes

- Align backend route keys with FE `genPath(displayName)` slugs
- Screenshot capture URL → `{FRONTEND_URL}/{slug}?screenshot=true`
- SSR / SPA meta image paths → always `/chaos/icons/{slug}.png`
- Rename icon asset `mandlebrot_set.png` → `mandelbrot_set.png` (fix typo in filename)
- Add missing BE entry for Sierpiński (FE-only today)
- Document the URL/slug contract in openspec

## Capabilities

### New Capabilities
- `url-contract`: Canonical page, icon, and screenshot URL rules

### Modified Capabilities
- `project`: Note icon/SSR path consistency

## Impact

- `packages/backend/routes.go`, `screenshot.go`, `ssr.go`
- `packages/backend/static/images/` (PNG rename)
- Home/OG consumers already use `/chaos/icons/` + FE `genPath` — they start working once keys/files match
- Closes #3
