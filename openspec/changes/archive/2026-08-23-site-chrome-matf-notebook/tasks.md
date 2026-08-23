## 1. Parent site link

- [x] 1.1 Shared `matf.dev` link helper (href `https://matf.dev/`)
- [x] 1.2 Wire helper into home, notebook index, and post chrome (nav + footer)
- [x] 1.3 Footer layout stays quiet (muted, not a second wordmark)

## 2. Notebook slug index

- [x] 2.1 Parse `VizEmbed` slugs from raw MDX plus `thumbSlug`
- [x] 2.2 `postsForVizSlug` / `featuredHomePosts` on the blog registry
- [x] 2.3 Unit tests for parser + multi-slug / empty cases

## 3. Home notebook section

- [x] 3.1 Section below gallery: up to three cards (featured first, then order)
- [x] 3.2 Link through to `/blog`
- [x] 3.3 Mobile: readable cards, gallery still primary

## 4. Canvas related notes

- [x] 4.1 Topbar Note link to first related post when any exist
- [x] 4.2 Side-panel list when more than one post matches
- [x] 4.3 Omit chrome when no match; skip `?iframe` / bare stage

## 5. Quality

- [x] 5.1 `pnpm run build` in `packages/frontend`
- [x] 5.2 Browser QA: home, `/blog`, a post, Aizawa canvas, hopalong canvas, a viz with no note, iframe embed
