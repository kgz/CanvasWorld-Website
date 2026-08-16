## Context

Issue #8. URL slugs already fixed (#3). This change replaces the capture strategy.

## Decisions

1. **Primary generation = Playwright script** (`packages/frontend/scripts/capture-thumbs.mjs`) writing into backend `static/images/`.
2. **FE owns chrome-less mode** via `?screenshot=true` — no CSS selector guessing in the capturer.
3. **Ready signal** `window.__CW_READY__ === true` after first full particle draw (or short delay for shaders).
4. **Go chromedp kept slim** for API on-demand; same wait/ready/canvas contract; drop ImageMagick trim.
5. **SSR never generates** — serves existing icons only.

## Risks

- Playwright needs Chromium install (`pnpm exec playwright install chromium`)
- Mandelbrot/shader may need slightly longer ready wait
- Sierpiński may still lack a good thumb until first successful run
