## 1. Site landmarks

- [x] 1.1 Add skip link in `SiteNav` targeting `#main`; wrap home in `<main id="main">`; add `id="main"` on blog/post `<main>`
- [x] 1.2 Label site `<nav>`; extend `current` so posts are not `aria-current="page"` on Notebook
- [x] 1.3 Name the `#about` footer region (`SiteFooter`)

## 2. Focus, names, motion (home / notebook)

- [x] 2.1 Shared `:focus-visible` on home/blog/post chrome; replace blog search `outline: none`
- [x] 2.2 Decorative `alt=""` on gallery/note thumbs when the link already contains the name/title
- [x] 2.3 Honor `prefers-reduced-motion` on `HeroInkCanvas`, gallery stagger, and Random scroll; fix AA contrast only where muted chrome fails

## 3. Embeds + light viz chrome

- [x] 3.1 `VizEmbed` iframe title = catalog name; announce queued/play/pause; start paused under reduced motion
- [x] 3.2 Viz pages: skip link to About; restore `:focus-visible` on chrome inputs

## 4. Verify

- [x] 4.1 `pnpm run build` in `packages/frontend`
- [x] 4.2 Keyboard: skip + tab through home, `/blog`, one post with `VizEmbed` (no trap; embeds skippable/pausable)
- [x] 4.3 Spot-check VoiceOver or NVDA on those three surfaces; reduced-motion does not auto-run hero/embeds
