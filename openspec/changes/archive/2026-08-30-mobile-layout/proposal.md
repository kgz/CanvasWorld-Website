## Why

Phone and tablet chrome is a shrunken desktop: viz params cannot be reopened after close, topbar actions overflow, Gallery becomes an empty pill, and home/blog nav clips. OD already designed the narrow layouts (#169).

## What Changes

- Port OD mobile chrome into React: canvas topbar/drawer/transport, home/blog/post hamburger nav, safe areas
- Keep desktop (≥900px canvas, ≥720px site nav) as it is
- Commit the OD prototype (`design/canvasworld-prototype/`) as source of truth

## Capabilities

### New Capabilities
- `mobile-chrome`: usable phone/tablet chrome for viz, home, and notebook

### Modified Capabilities
- (none — viz-chrome desktop requirements unchanged)

## Impact

- `template-modern.tsx`, `canvasChrome.module.css`
- Home / blog / post nav (`index-new.tsx`, `blog.tsx`, `PostPage.tsx`)
- `packages/frontend/index.html` viewport
- Closes #169
