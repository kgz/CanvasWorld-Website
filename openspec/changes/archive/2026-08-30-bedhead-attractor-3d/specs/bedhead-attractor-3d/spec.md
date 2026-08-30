## ADDED Requirements

### Requirement: 3D Bedhead discrete map

The product SHALL expose an active catalog slug `bedhead_attractor_3d` that iterates the archive Bedhead 3D map (x/y plus z) and renders a scrubbable 3D point cloud via transport `n`. Existing `bedhead_attractor` SHALL remain the 2D stage.

#### Scenario: Default shape

- **WHEN** a visitor opens `/bedhead_attractor_3d` with defaults
- **THEN** a bounded 3D point cloud forms from the discrete map (archive-style silhouette)

### Requirement: Catalog SEO

`routes.json` SHALL include title, description, thumbnail path, and `active: true` for `bedhead_attractor_3d` so server OG/sitemap pick it up.

#### Scenario: Active catalog entry

- **WHEN** the shared catalog is loaded
- **THEN** `bedhead_attractor_3d` is active with title, description, and thumbnail

### Requirement: Featured notebook

A lab notebook MDX post SHALL embed the viz, use accurate excerpt/title for SEO, set `featured: true`, and be included in `blog-posts.json` after export.

#### Scenario: Exported notebook

- **WHEN** blog posts are exported
- **THEN** the Bedhead 3D notebook appears in `blog-posts.json` with a viz embed slug
