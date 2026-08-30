## ADDED Requirements

### Requirement: Modified Chua ODE trail

The product SHALL expose an active catalog slug `modified_chua_attractor` that integrates the Modified Chua (multi-scroll) system with archive default coefficients and renders a 3D trail scrubbable by transport `n`.

#### Scenario: Default shape

- **WHEN** a visitor opens `/modified_chua_attractor` with defaults
- **THEN** a bounded 3D multi-scroll trail forms

### Requirement: Catalog SEO

`routes.json` SHALL include title, description, thumbnail path, and `active: true` for `modified_chua_attractor` so server OG/sitemap pick it up.

### Requirement: Featured notebook

A lab notebook MDX post SHALL embed the viz, use accurate excerpt/title for SEO, set `featured: true`, and be included in `blog-posts.json` after export.
