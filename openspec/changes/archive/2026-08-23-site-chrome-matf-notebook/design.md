## Context

Chaos is mounted at `https://matf.dev/chaos`. Marketing chrome (home, `/blog`, posts) duplicates nav/footer with Gallery / Notebook / About and a tagline — no parent-site link. Notebook posts already embed canvases via `<VizEmbed slug="…">` and usually set `thumbSlug`. Full canvas chrome (`template-modern.tsx`) has Params / Gallery only. Home never lists notes beyond the nav item (#138 / #148).

## Goals / Non-Goals

**Goals:**
- Apex link `https://matf.dev/` in shared marketing chrome (quiet, not a second wordmark)
- Home section with a few featured notes + link to `/blog`
- Canvas pages link related notes by scanning MDX `VizEmbed` slugs and `thumbSlug` (one post can map to many slugs, e.g. hopalong family)
- Hide notebook chrome in `?iframe` / bare stage

**Non-Goals:**
- Parent link on viz topbar
- Auto-playing a second player on the canvas page
- Rewriting notebook copy
- New OD prototype

## Decisions

1. **Footer + muted nav item for matf.dev** — footer is the durable credit; nav keeps it visible without scroll. Label is `matf.dev`, href is `https://matf.dev/` (apex, not `/chaos`).
2. **Shared chrome helper** — one React module for the parent `<a>` (and footer row) used by home, blog, and posts so the URL is not copy-pasted three ways.
3. **Home notes: up to three cards** — `featured: true` first, then remaining posts by existing `order`. Cards match notebook index (tag, title, excerpt). Section sits below the gallery, above the footer. “All notes” goes to `/blog`.
4. **Build-time slug index** — Vite plugin `virtual:mdx-post-sources` reads post `.mdx` from disk (the MDX compiler eats `?raw` globs). Regex `VizEmbed` `slug="…"` plus each post’s `thumbSlug`. `postsForVizSlug(slug)` returns matching posts (deduped, stable order). No per-viz map in `routes.json`.
5. **Canvas placement** — topbar `Note` button to the first related post (discoverable without opening Params). If more than one post matches, also list them in the side panel before About. Omit entirely when the list is empty. Skip when `bareStage` / `?iframe`.

## Risks / Trade-offs

- [Raw MDX regex misses atypical JSX] → Posts use `slug="…"` today; cover `slug='…'` too. `thumbSlug` is the fallback.
- [Home cards compete with gallery] → Three cards, same tokens as notebook, no hero-scale featured art on home.
- [Topbar crowding on small screens] → Reuse `chromeBtn` + existing mobile label hiding; panel list remains for extra posts.

## Open Questions

- None.
