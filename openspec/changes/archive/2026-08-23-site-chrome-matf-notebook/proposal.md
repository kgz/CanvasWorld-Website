## Why

Classical Chaos lives at `matf.dev/chaos` with no path back to the parent site, and notebook posts are easy to miss: home only has a chrome “Notebook” link, and viz pages never point at the notes that already embed them as mini players.

## What Changes

- Add a quiet `matf.dev` link in shared site chrome (home, notebook index, post pages) pointing at `https://matf.dev/`
- Feature a few lab notebook posts on the home page with a link through to `/blog`
- On full canvas pages, surface related notebook post(s) when a post’s `VizEmbed` or `thumbSlug` references that viz slug (dynamic — no per-viz hardcode)
- Omit the canvas notebook affordance when no post matches, and never show it in `?iframe` embed mode

## Capabilities

### New Capabilities
- `parent-site-link`: Apex `matf.dev` link in marketing-site chrome
- `home-notebook-feature`: Featured notebook posts on the home page
- `viz-notebook-links`: Dynamic canvas → notebook links from VizEmbed / thumbSlug

### Modified Capabilities

## Impact

- `packages/frontend` home (`index-new.tsx`), notebook (`blog.tsx`, `PostPage.tsx`), canvas chrome (`template-modern.tsx`)
- Blog registry (`packages/frontend/src/blog/registry.ts`) — index posts by viz slug from MDX source + meta
- CSS modules for home, blog, posts, canvas chrome
- Issues #147, #148, #138
