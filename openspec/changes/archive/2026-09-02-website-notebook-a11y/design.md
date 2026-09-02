## Context

Home (`index-new.tsx`) has no `<main>`. `SiteNav` is an unlabeled `<nav>` and post pages pass `current="notebook"`, so Notebook stays `aria-current="page"` off the index. Blog search uses `outline: none`. Gallery/note cards rely on inner text, but thumbs can double-announce. `VizEmbed` titles the iframe from `label` or a slug string, not the catalog name; queued/paused is visual; embeds auto-run even under `prefers-reduced-motion`. `#about` is a one-line `SiteFooter`. Canvas HUD already has some labels; `.paramNumber:focus { outline: none }` still kills rings.

No visual brand change. No OD run — chrome behaviour, not a new look.

## Goals / Non-Goals

**Goals:**

- Keyboard and AT can land on primary content, list headings/links, and know which surface they are on
- Visible focus on home/blog/post chrome and a light viz-chrome pass
- Embeds skippable/pausable; reduced-motion users are not auto-played into motion

**Non-Goals:**

- Screen-reader navigation of WebGL/canvas pixels
- Full WCAG audit of every attractor HUD
- Captions/transcripts for every visualisation

## Decisions

1. **Shared skip link** as the first focusable node in `SiteNav` (home/blog/posts) targeting `#main`. Viz pages get a separate skip to `#about` in `template-modern` — different layout, do not force site nav onto canvas routes.
2. **`<main id="main">`** wraps home content (hero, gallery, notes). Blog and posts already have `<main>`; add `id="main"` so the skip target is stable.
3. **Nav name + current page:** `aria-label="Site"` on `<nav>`. Extend `current` to `'home' | 'notebook' | 'post'`. `aria-current="page"` only when `current === 'notebook'` (the index). Posts keep Notebook as a normal link.
4. **Card names:** gallery/note/featured thumbs `alt=""` (decorative) when the visible name/title is already in the link. Icon-only controls keep `aria-label`.
5. **Focus rings:** shared `:focus-visible` token in site CSS (2px offset ring using existing accent). Replace `outline: none` on blog search and chrome number inputs with a visible ring. Pointer users keep `:focus:not(:focus-visible)` quiet.
6. **About:** `SiteFooter` with `aboutId` gets `aria-labelledby` pointing at a visible “About” heading (or `aria-label="About"` if a heading would change the look too much). Prefer a visually quiet heading so the region shows up in landmarks.
7. **Embeds:** iframe `title` = catalog `name` (fallback: `label` / spaced slug). `userPaused` initializes true when `prefers-reduced-motion: reduce`. Queued slot: button `disabled` + `aria-label="Queued"` (or live text on the figure). Play/pause already has `aria-label`; keep it in sync with state.
8. **Hero motion:** `HeroInkCanvas` does not start its draw loop when reduced-motion is set; static first frame or CSS background is enough. Gallery already skips stagger; Random scroll uses `behavior: 'auto'` under reduced motion.
9. **KaTeX:** if `react-katex` leaves formulas `aria-hidden` without MathML, put the source TeX in a visually hidden span. Do not restyle equations.

## Risks / Trade-offs

- [Decorative `alt=""`] → empty alt is wrong if a card has no visible text; only do it when the link already contains the name/title
- [Reduced-motion paused embeds] → users who want motion must press Play once; that is the point
- [Skip on viz pages] → canvas still unreadable; skip-to-About is the honest fallback, not a fake canvas tree
- [Contrast tweaks] → only muted chrome that fails AA; do not restyle the brand palette wholesale

## Migration Plan

Ship in one frontend PR. Rollback = revert. No data/API change.

## Open Questions

None — VoiceOver/NVDA spot-check is the acceptance gate, not a design fork.
