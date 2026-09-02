## Context

Live chrome is `template.tsx` → `template-modern.tsx` + `index-new.tsx`. `Menu.tsx` and `pages/index.tsx` are the only MUI/dat-gui importers and are unused. jquery/antd/leva/xlsx have zero source imports after the SEO pass.

## Goals / Non-Goals

**Goals:**
- One UI path: Tailwind modern shell + CSS modules
- `package.json` matches what `src/` and `scripts/` actually import
- `pnpm dev` / `pnpm build` still work

**Non-Goals:**
- Vite major upgrade (#12)
- Replace Redux for GUI params (#11)
- Clean `_base.tsx` kitchen sink (#9) beyond dropping the unused SCSS import
- Enable Matomo (provider stays commented)

## Decisions

- **Delete, don’t archive.** Dead Menu/dat-gui/MUI gallery have no callers; git history is enough.
- **Keep redux + three + MDX/KaTeX + playwright.** Still on the live path (params, canvas, notebook, thumbs).
- **Drop unused babel decorator plugins** from Vite. No decorator syntax in `src/`. Leave `experimentalDecorators` in tsconfig (harmless; not this ticket).
- **Drop `sass` / `typed-scss-modules`** after deleting `@scss/` (only consumers were dead UI + unused `_base` import). `dev` script becomes `vite`.
- **`mkcert` stays a system CLI in README**, not an npm dependency. The `mkcert` package and `vite-plugin-mkcert` are unused.

## Risks / Trade-offs

- [Hidden import] → grep + `pnpm build` as the gate
- [Thumbs script] → keep `playwright`; do not treat it as “unused Vite plugin”
