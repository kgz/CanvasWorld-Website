## Context

Vite is pinned `"3"` (resolves to 3.2.11). `pnpm outdated` shows latest Vite 8.2.2, `@vitejs/plugin-react` 6.1.1 (peer `vite ^8`), Vitest 4.1.11 (peer `vite ^6 || ^7 || ^8`). README documents mkcert certs but `vite.config.ts` never reads `VITE_HTTPS_*`.

## Decisions

1. **Target Vite 8** — aligns plugin-react 6 and Vitest 4 peers in one jump.
2. **HTTPS via env paths** — read PEM files into `server.https` when both vars set; HTTP otherwise (no npm mkcert plugin).
3. **Keep `tsc && vite build`** — pre-existing tsc debt unchanged; Docker already uses `vite build` only.
4. **Vitest config** — bump `@vitest/ui` to match Vitest 4.

## Risks

- MDX rollup plugin or custom catalog watcher may need Vite 8 API tweaks — verify build + dev HMR.
