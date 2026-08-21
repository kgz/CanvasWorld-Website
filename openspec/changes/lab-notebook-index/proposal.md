## Why

The Open Design prototype has a lab notebook index (`blog.html`) that is not yet in the React app. We need a first shippable page so notes are discoverable from home chrome, before full MDX posts and viz embeds (#86).

## What Changes

- Add `/blog` lab notebook index matching the OD design (hero, featured post, post grid)
- Site nav links (home ↔ notebook) using Classical Chaos branding
- Static sample post cards (placeholder hrefs until MDX)
- Check in OD prototype `blog.html` (+ related CSS) under `design/canvasworld-prototype/`

## Capabilities

### New Capabilities
- `lab-notebook-index`: Public notebook index route with featured + grid layout from OD

### Modified Capabilities

## Impact

- `packages/frontend` routing (`template.tsx`), home nav (`index-new.tsx`), new page + CSS module
- `design/canvasworld-prototype/` prototype assets
- Related later work: #86 MDX + embeds
