## Context

About copy lives in viz pages as JSX returned from `getDescription()` (e.g. `HopfFibration.getDescription`) and renders inside `#about` in `template-modern.tsx`. Lab notebooks are MDX under `packages/frontend/src/blog/posts/` rendered via `MDXProvider` in `PostPage.tsx` with a small component map (`Callout`, `VizEmbed`, KaTeX). There is no glossary or tooltip UI today; `react-hot-toast` is the only overlay-adjacent dependency.

Issue #178 asks for curated one-line definitions on hover/tap — not auto-linking every technical word and not a site-wide dictionary route.

## Goals / Non-Goals

**Goals:**

- One shared curated term map and one `GlossaryTerm` component used in both About JSX and MDX
- Plain-language definitions (~1–2 sentences); optional short “In this viz” context field on terms where helpful
- Accessible popover: keyboard reachable, Escape dismisses, focus ring, touch tap toggles, click-outside dismisses
- Pilot coverage on high-traffic surfaces (Lorenz About, one mesh About, one notebook post)

**Non-Goals:**

- Auto-detecting and linking every technical token in prose
- A standalone `/glossary` index page
- Backend/SSR changes or term editing UI
- Tooltips on canvas HUD labels or parameter names (chrome only for now)

## Decisions

1. **Curated registry in frontend TS** — `packages/frontend/src/glossary/terms.ts` exports a readonly map `{ [slug: string]: { label, definition, context? } }`. Slugs are kebab-case (`attractor`, `phase-plane`, `reaction-diffusion`). Unknown slugs log a dev warning and render children/label as plain text (no popover). Keeps copy reviewable in one PR-sized file; no JSON code-gen step.

2. **`GlossaryTerm` API** — `<GlossaryTerm term="attractor" />` uses registry label; `<GlossaryTerm term="attractor">strange attractor</GlossaryTerm>` overrides visible text. Props: `term` (required slug). Renders as `<button type="button">` with dotted underline class — not `<abbr title>` (title is not keyboard/touch friendly and is inconsistently announced).

3. **Popover = button + floating panel** — Use `@floating-ui/react-dom` for flip/shift inside the About side panel and MDX column (overflow hidden). Panel is `role="tooltip"` when hover-only is insufficient; prefer **`role="dialog"` + `aria-labelledby`** when content is multi-sentence so screen readers get the full definition. Toggle with `aria-expanded` / `aria-controls`. Open on `:focus-visible` and `mouseenter`; on coarse pointers open on click only (match `pointer: coarse` media query). Close on Escape, blur (with focus trap guard so moving into the panel doesn’t instantly close), and outside click.

4. **MDX wiring** — Add `GlossaryTerm` to `mdxComponents` in `PostPage.tsx`. Authors opt in per term in MDX: `a <GlossaryTerm term="attractor" /> never closes`. No remark plugin for auto-linking in v1.

5. **About wiring** — Import `GlossaryTerm` in viz pages’ `getDescription` JSX the same way `InlineMath` is used today. No change to `loadVizPageDescription`; the component travels inside existing React trees.

6. **Styling** — Module CSS colocated with component; reuse site accent for underline/focus ring (align with `site-a11y` focus tokens). Popover: small max-width (~20rem), elevated surface, `z-index` above side panel scroll. Respect `prefers-reduced-motion: reduce` (no scale animation).

7. **Initial term set** — Seed from issue examples plus notebook frequency: `polynomial`, `attractor`, `strange-attractor`, `phase-plane`, `isosurface`, `ode`, `pde`, `reaction-diffusion`, `euler-method`, `trajectory`, `manifold`, `stereographic-projection`, `julia-set`, `bifurcation`, `lyapunov-exponent` (definitions written in Classical Chaos voice, not copied from external sources).

## Risks / Trade-offs

- [Manual markup burden] → Only curated high-value terms; unknown slugs fail soft; expand list incrementally
- [Popover clipped in side panel] → Floating UI flip/shift; test Lorenz + Hopf About scroll
- [Duplicate gloss on same page] → Each instance is independent; acceptable for v1
- [New dependency] → `@floating-ui/react-dom` is small; if bundle audit fails, fallback to anchored CSS with `position: fixed` and manual flip (document in tasks)

## Migration Plan

Single frontend PR. Ship registry + component first, then pilot markup in 2–3 About blocks and one MDX post. Rollback = revert component and markup. No data migration.

## Open Questions

None blocking — OD run not required (inline chrome, not a new page layout).
