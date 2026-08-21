## 1. Public meta helpers

- [x] 1.1 Add `PUBLIC_BASE` / `PROD_URL` resolver and path→slug / page-meta helpers
- [x] 1.2 Narrow `isBot` to social preview UAs
- [x] 1.3 Rewrite `serveSSR` to use helpers (content HTML, no loading stub/redirect loop)
- [x] 1.4 Inject meta into production Vite `index.html` for non-bot responses
- [x] 1.5 Serve dynamic `sitemap.xml`; update `robots.txt` + `env.example` + dev template host

## 2. Verify

- [ ] 2.1 `go build` backend
- [ ] 2.2 Curl Discordbot UA for a slug; curl sitemap/robots
- [ ] 2.3 Redeploy chaos image when ready
