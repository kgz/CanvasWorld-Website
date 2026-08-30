## Context

Notebook index ships at `/blog`. OD post prototypes define article chrome and mini-player embeds. Canvas pages already support bare stage via `?iframe`. Vite is v3.

## Goals / Non-Goals

**Goals:**
- `/blog/:slug` article pages matching OD doc shell
- Author posts as MDX beside the app
- `VizEmbed` mounts a live viz (iframe of `/{slug}?iframe`) with play/pause, offscreen pause, link out
- Index lists real posts with working hrefs
- At least one post with a single embed (Lorenz) and one with multiple embeds (Hopalong family)

**Non-Goals:**
- CMS / drafts
- Full leva panel inside embeds
- Rewriting attractors into 2D canvas mini-players (OD JS is reference chrome only)

## Decisions

1. **MDX via `@mdx-js/rollup` + `@mdx-js/react`** — matches #86; posts live in `packages/frontend/src/blog/posts/*.mdx`.
2. **Frontmatter as `export const meta`** — title, tag, date, readMinutes, excerpt, featured, thumbSlug, order.
3. **Registry** — `import.meta.glob` of posts → sorted list for index + slug lookup.
4. **VizEmbed = iframe shell** — `src=/{slug}?iframe` under basename; IntersectionObserver + `visibilitychange` pause by swapping `src` empty / restoring; optional click-to-run. Reuses real viz modules without remounting R3F trees in the parent.
5. **Chrome** — CSS module from OD `.doc-shell` / `.mini-player` bar (label, play, Open full).
6. **Index** — replace static placeholders with registry-driven cards.

## Risks / Trade-offs

- [Multiple WebGL contexts] → Embed profile: smaller iframe height, rely on iframe bare mode; soft max guidance in docs
- [Vite 3 + MDX friction] → Pin compatible `@mdx-js/*`; fall back to TSX modules if blocked
- [Iframe basename / paths] → Build URLs with `/chaos` basename helper

## Open Questions

- None for first slice; richer in-process embeds can replace iframes later.
