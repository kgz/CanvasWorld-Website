## ADDED Requirements

### Requirement: Canonical public base

The backend SHALL resolve a public base URL from `PUBLIC_BASE`, else `PROD_URL`, else `https://matf.dev/chaos` (no trailing slash), and SHALL use it for `og:url`, `twitter:url`, `rel=canonical`, and absolute `og:image` / `twitter:image` URLs.

#### Scenario: Default host

- **WHEN** neither env var is set
- **THEN** canonical URLs use `https://matf.dev/chaos`

### Requirement: Catalog slug from request path

Route lookup SHALL map the request path to a catalog slug by trimming leading slashes and an optional `chaos/` prefix so keys match `routes.json` with or without path-prefix stripping.

#### Scenario: Stripped and unstripped paths

- **WHEN** path is `/clifford_attractor` or `/chaos/clifford_attractor`
- **THEN** catalog lookup uses `clifford_attractor`

### Requirement: Social-bot SSR

Known social preview user agents SHALL receive HTML with title, description, Open Graph / Twitter tags, a visible heading and description, preview image reference, and a link to the canonical URL — without a client redirect loop or “Loading interactive visualization…” as the only body.

#### Scenario: Discord unfurl

- **WHEN** `User-Agent` contains `discordbot` and path resolves to an active slug
- **THEN** response includes that viz title, description, and `og:image` under the public base icons path

### Requirement: Narrow bot detection

Generic substrings `bot`, `crawler`, `spider`, and `scraper` SHALL NOT alone trigger social SSR. Googlebot SHALL receive the normal document (SPA shell with injected meta in production).

### Requirement: Production meta injection

In production, non-SSR HTML responses SHALL send Vite `index.html` with title, description, canonical, and OG/Twitter tags matching the resolved page meta for that path.

### Requirement: robots and sitemap

`robots.txt` SHALL allow indexing and reference `{PUBLIC_BASE}/sitemap.xml`. The backend SHALL serve `sitemap.xml` listing home, `/blog`, and every active catalog slug under the public base.
