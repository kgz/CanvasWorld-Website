## ADDED Requirements

### Requirement: Shared catalog file
The repository SHALL maintain a single visualization catalog at `packages/shared/routes.json`. Each entry SHALL include at least: `slug`, `title`, `category`, `description`, `thumbnail`, `renderMode`, and `active`.

#### Scenario: Add a visualization
- **WHEN** a developer adds a new visualization to the product
- **THEN** they add one catalog entry (and a FE component map entry) without editing a separate Go route map or thumbs slug list

### Requirement: Explicit slugs
Catalog `slug` values SHALL be the canonical URL path segment and icon basename. FE and BE SHALL NOT derive registry identity from a second parallel name list.

#### Scenario: API and gallery agree
- **WHEN** `GET /api/routes` lists a slug and the FE gallery renders the same slug
- **THEN** both strings are identical to the catalog `slug`

### Requirement: Active filter
Screenshot-all and thumbs generation SHALL only process entries with `active: true`. Inactive stubs MAY remain in the catalog for documentation/SSR later.

#### Scenario: Stub skipped
- **WHEN** screenshot-all runs and `brusselator` is `active: false`
- **THEN** it is not captured

### Requirement: Backend consumes catalog
Backend API, SSR meta, and screenshot iteration SHALL load the shared catalog instead of a hand-maintained Go map.

#### Scenario: Description from catalog
- **WHEN** a bot requests SSR for `/{slug}`
- **THEN** OG description comes from the catalog entry for that slug
