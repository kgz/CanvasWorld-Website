## Why

Home, notebook, and post chrome are hard to use with a keyboard or screen reader: no skip link, home has no `<main>`, nav is unlabeled, post pages still mark Notebook as the current page, and most links hide focus. Canvas pixels stay out of scope; this ticket is the surrounding site plus honest embed fallbacks.

## What Changes

- Skip link to primary content on home, `/blog`, and post pages
- One `<main>` per page; labelled site nav; heading order that matches the visual outline
- `aria-current="page"` only on the actual current surface (home vs notebook index vs a post)
- Visible `:focus-visible` rings on home/blog CTAs, cards, search, and prev/next — no brand restyle
- Accessible names: gallery card = viz name; featured/note card = post title; icon buttons labelled
- `#about` becomes a described footer region, not a one-line unnamed target
- `VizEmbed`: iframe title = catalog viz name; play/pause/queued state announced; `prefers-reduced-motion` does not auto-run motion-heavy embeds
- Light viz-chrome pass only: skip into About, restore focus rings on chrome inputs (`outline: none` today)
- Spot-check with VoiceOver or NVDA on home, `/blog`, and one post with a `VizEmbed`

## Capabilities

### New Capabilities

- `site-a11y`: Landmarks, skip link, keyboard focus, names, contrast, and reduced-motion for home, notebook, posts, and shared site chrome

### Modified Capabilities

- `viz-embed`: iframe title, exposed transport/queued state, reduced-motion default pause
- `viz-chrome`: skip-to-About and visible focus on chrome controls (not a full viz AT rewrite)

## Impact

- `packages/frontend/src/pages/index-new.tsx`, `frontpage.module.css`
- `packages/frontend/src/pages/blog.tsx`, `blog.module.css`, `PostPage.tsx`, `post.module.css`
- `packages/frontend/src/chrome/SiteNav.tsx`, `siteNav.module.css`, `ParentSiteLink.tsx`
- `packages/frontend/src/blog/VizEmbed.tsx`, `VizEmbed.module.css`
- `packages/frontend/src/pages/template-modern.tsx`, `canvasChrome.module.css` (skip + focus only)
- Closes #109
