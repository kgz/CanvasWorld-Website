# Open Design brief — Classical Chaos mobile chrome

GitHub [#169](https://github.com/kgz/CanvasWorld-Website/issues/169). Production is served at `/chaos`. Visual source of truth is this project (`home.html`, `canvas.html`, `blog.html`, `posts/*.html`, `css/shared.css`).

## Goal

Design **phone and tablet** layouts so the site is actually usable. Desktop (~1280–1440) already works — **do not redesign desktop**. Recompose the chrome for narrow viewports. Current “mobile” CSS only shrinks the desktop layout; things overlap and the params sidebar cannot be reopened.

## Must-fix (production React, port from this prototype)

Live chrome lives in `packages/frontend/src/pages/template-modern.tsx` + `canvasChrome.module.css` (and home/blog modules). Prototype `canvas.html` / `home.html` / `blog.html` already mirror it.

### Canvas / viz page (`canvas.html`) — highest priority

On ~390px:

1. **Params panel cannot be reopened.** Topbar is a single nowrap row: wordmark + category + long title + Note / Params / Gallery. Actions overflow off-screen. Params is the only reopen control. Once the overlay panel is closed, there is no reachable way back.
2. **Controls overlap.** Title vs action pills, FPS HUD vs stage/panel, transport (play / scrub / speed) wrapping into the canvas.
3. **Empty Gallery control.** At 640px labels are `display: none`. Gallery is text-only, so it becomes a blank pill. Note/Params keep icons.
4. **Drawer has no in-panel close.** Overlay is `min(360px, 84vw)` full-bleed left. Close is topbar Params (often off-screen) or a dim scrim. Need a persistent, thumb-reachable open/close that is **never covered** by the drawer.
5. **Safe areas / 100vh.** iOS home indicator and address bar must not clip transport or the reopen control.

### Home (`home.html`) and blog (`blog.html` + one notebook post)

Nav, hero, gallery grid, featured note, post prose + mini-player: cramped, overlapping, or off-canvas. Recompose — do not just reduce padding.

## Viewports to design for (show them)

- Phone: **390 × 844** (and check 360 × 740)
- Tablet: **768 × 1024**
- Keep existing desktop as-is above ~900px

Prefer **one HTML file per screen** with real `@media` (and `env(safe-area-inset-*)`). Optional: a short “phone / tablet / desktop” note on the hub. Do **not** invent a separate product; same Classical Chaos / CanvasWorld ink–void language.

## Canvas composition on phone

One job: **watch the system, open params when you want them, close them and keep watching.**

- Stage stays the hero (full remaining viewport under a compact topbar, above a compact transport).
- Topbar: wordmark (or a back/home mark) + truncated viz name. Overflow menu or icon-only actions that **wrap or collapse** — nothing clipped.
- Params: modal/drawer overlay with scrim. **Closed by default on first load at phone width** is OK (more canvas). Always:
  - a visible toggle in the topbar or a floating chip that stays above the drawer
  - a close control **inside** the drawer
  - tapping scrim closes
- When the drawer is open, it must not cover the reopen/close toggle.
- Transport: one row if possible; scrub can take a second row; play and speed stay tappable (min ~44px). FPS must not sit on top of buttons.
- Gallery / Note: icon buttons with `aria-label`, never empty pills.

Tablet: panel may stay a left overlay or a narrower column; still must open/close without trapping the user.

## Home / blog on phone

- Sticky nav: wordmark + a compact menu (hamburger or overflow) — links must not overflow the row.
- Hero type and CTAs stack; gallery becomes 1–2 columns; featured note stacks image then copy.
- Notebook post: prose readable (~62ch max, comfortable padding); mini-player / embeds don’t overflow; tables/code scroll horizontally if needed.

## Constraints

- Extend `css/shared.css` tokens. Keep `data-od-id` on major regions.
- Static HTML/CSS/JS only. Placeholder stage is fine (existing canvas animation OK).
- Brand: scientific / atmospheric, accent teal — not purple SaaS glow.
- Respect `prefers-reduced-motion`.
- Update `index.html` hub copy to mention phone/tablet as a designed viewport, not desktop-only.

## Out of scope

- Real WebGL / shader math
- Desktop visual redesign
- Auth, CMS, new marketing pages

## Acceptance

- [ ] Phone 390: canvas page — close params, still see a control, reopen params; no overlapping chrome
- [ ] Phone 390: home and blog — nav and grids usable, nothing clipped
- [ ] Tablet 768: same flows, not a shrunken desktop
- [ ] Desktop layout unchanged in spirit
- [ ] Hub links still work; ready to port into React `canvasChrome` / frontpage / blog CSS
