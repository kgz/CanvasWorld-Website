## Why

Screenshot thumbs rely on brittle chromedp DOM hacks + ImageMagick, and bot SSR lazily generates images too late for Discord. Need first-class screenshot mode and a reliable capture path.

## What Changes

- React `?screenshot=true` hides chrome and sets `window.__CW_READY__` when the viz is drawable
- Playwright script writes PNGs to `packages/backend/static/images/`
- Go screenshot service waits for `__CW_READY__`, captures `#cw-viz-canvas` only — **no ImageMagick**
- Remove lazy screenshot generation from bot SSR
- Keep `POST /api/screenshot*` for optional on-demand regen (uses the slim capturer)

## Capabilities

### New Capabilities
- `screenshots`: Thumbnail / OG image capture contract

### Modified Capabilities
- `url-contract`: screenshot mode is part of page URL contract (query param)

## Impact

- Closes #8
- Runtime no longer needs ImageMagick
- CI/local can run `pnpm thumbs` against a running frontend
