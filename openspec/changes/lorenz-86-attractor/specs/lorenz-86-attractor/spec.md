## ADDED Requirements

### Requirement: Lorenz 86 ODE trail

The product SHALL expose an active catalog slug `lorenz_86` that integrates the Lorenz 86 system with archive default coefficients and renders a 3D trail scrubbable by transport `n`. Classic `lorenz_attractor` SHALL remain unchanged.

#### Scenario: Default shape

- **WHEN** a visitor opens `/lorenz_86` with defaults
- **THEN** a bounded 3D trail forms (archive-like folded cloud silhouette)

### Requirement: Catalog SEO

`routes.json` SHALL include title, description, thumbnail path, and `active: true` for `lorenz_86` so server OG/sitemap pick it up.

### Requirement: Featured notebook

A lab notebook MDX post SHALL embed the viz, use accurate excerpt/title for SEO, set `featured: true`, and be included in `blog-posts.json` after export.
