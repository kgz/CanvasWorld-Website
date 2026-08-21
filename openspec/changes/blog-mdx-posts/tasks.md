## 1. Tooling

- [x] 1.1 Add `@mdx-js/rollup` + `@mdx-js/react` and wire Vite/TS
- [x] 1.2 Add MDX type declarations and provider if needed

## 2. Registry + routes

- [x] 2.1 Post `meta` type + `import.meta.glob` registry (list + bySlug)
- [x] 2.2 Article layout (doc shell CSS from OD)
- [x] 2.3 Routes: `/blog/:slug` + 404 → `/blog`
- [x] 2.4 Drive notebook index from registry

## 3. VizEmbed

- [x] 3.1 `VizEmbed` iframe shell (`?iframe`), play/pause, open-full link
- [x] 3.2 IntersectionObserver + `visibilitychange` pause/resume

## 4. Sample posts

- [x] 4.1 Port Lorenz post (OD copy + one embed)
- [x] 4.2 Port Hopalong multi-embed post (classic / positive / additive / sinusoidal)
- [x] 4.3 Port remaining OD posts as MDX (embeds where design had mini-players)

## 5. Verify

- [x] 5.1 Vite build includes MDX posts
- [x] 5.2 Manual: index → post → embed pause/play → open full
