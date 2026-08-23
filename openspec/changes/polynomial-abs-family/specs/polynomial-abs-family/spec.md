## ADDED Requirements

### Requirement: Polynomial ABS map trail

The product SHALL expose an active catalog slug `polynomial_abs` that iterates the archive absolute-value polynomial map with default axis coefficients and renders a scrubbable 3D trail.

#### Scenario: Default shape

- **WHEN** a visitor opens `/polynomial_abs` with defaults
- **THEN** a bounded 3D trail forms from the absolute-value affine iteration

### Requirement: Polynomial Type A map trail

The product SHALL expose an active catalog slug `polynomial_type_a` that iterates Type A (`x'=a+y-zy`, `y'=b+z-xz`, `z'=c+x-yx`) with archive defaults and renders a scrubbable 3D trail.

#### Scenario: Default shape

- **WHEN** a visitor opens `/polynomial_type_a` with defaults
- **THEN** a bounded 3D trail forms from the three-parameter map

### Requirement: Polynomial Type B map trail

The product SHALL expose an active catalog slug `polynomial_type_b` that iterates Type B with six parameters and archive `index.js` defaults, and renders a scrubbable 3D trail.

#### Scenario: Default shape

- **WHEN** a visitor opens `/polynomial_type_b` with defaults
- **THEN** a bounded 3D trail forms from the six-parameter map

### Requirement: Polynomial Type C map trail

The product SHALL expose an active catalog slug `polynomial_type_c` that iterates Type C with per-axis quadratic coefficients and archive defaults, and renders a scrubbable 3D trail.

#### Scenario: Default shape

- **WHEN** a visitor opens `/polynomial_type_c` with defaults
- **THEN** a bounded 3D trail forms from the per-axis quadratic map

### Requirement: Catalog SEO

`routes.json` SHALL include title, description, thumbnail path, and `active: true` for all four polynomial slugs so server OG/sitemap pick them up.

### Requirement: Family notebook

A lab notebook MDX post SHALL embed all four viz slugs, use accurate excerpt/title for SEO, and be included in `blog-posts.json` after export.
