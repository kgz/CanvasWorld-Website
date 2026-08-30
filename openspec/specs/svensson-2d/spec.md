# svensson-2d Specification

## Purpose
TBD - created by archiving change svensson-2d. Update Purpose after archive.
## Requirements
### Requirement: Svensson 2D map

The product SHALL expose an active catalog slug `svensson_attractor` that iterates the Svensson map with archive default coefficients and renders a 2D point cloud scrubbable by transport `n`.

#### Scenario: Default shape

- **WHEN** a visitor opens `/svensson_attractor` with defaults
- **THEN** a bounded 2D point cloud forms from seed `(0, 0)` under `a=-3`, `b=3`, `c=3`, `d=3`

### Requirement: Catalog SEO

`routes.json` SHALL include title, description, thumbnail path, and `active: true` for `svensson_attractor` so server OG/sitemap pick it up.

#### Scenario: Active catalog entry

- **WHEN** the shared catalog is loaded
- **THEN** `svensson_attractor` is active with title, description, and thumbnail

### Requirement: Lab notebook

A lab notebook MDX post SHALL embed the viz with accurate excerpt/title and be included in `blog-posts.json` after export.

#### Scenario: Exported notebook

- **WHEN** blog posts are exported
- **THEN** the Svensson notebook appears in `blog-posts.json` with a viz embed slug

