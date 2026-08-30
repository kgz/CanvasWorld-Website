## Context

Home already uses Classical Chaos branding and `frontpage.module.css`. OD prototype `blog.html` defines the notebook index. Full MDX + embeds remain #86.

## Goals / Non-Goals

**Goals:**
- React route `/blog` under basename `/chaos`
- Match OD layout: hero, featured row, “More notes” grid
- Nav from home and on notebook page
- Static post metadata module (easy to swap for MDX later)

**Non-Goals:**
- MDX pipeline / article pages
- Live viz embeds
- CMS

## Decisions

1. **Path `/blog`** — matches prototype filename and #86; label can say “Notebook” in copy while path stays `/blog`.
2. **CSS module `blog.module.css`** — reuse shared tokens from frontpage (same CSS variables via `.page`), port blog-specific rules from OD `shared.css`.
3. **Static posts array** — `packages/frontend/src/blog/posts.ts` with sample content from prototype; featured flagged; card `href` optional/`#` until posts exist.
4. **Featured art** — use existing gallery thumb (`lorenz_attractor` icon) like OD `data-viz="lorenz"`.
5. **Routing** — explicit `<Route path="/blog" …>` before the catch-all in `template.tsx` (not via `routes.json` viz catalog).

## Risks / Trade-offs

- [Placeholder links] → Acceptable until #86; no 404 for missing posts
- [Nav brand mismatch with viz chrome] → Notebook/home stay Classical Chaos; canvas pages unchanged

## Open Questions

- None for v1; article path and MDX deferred to #86.
