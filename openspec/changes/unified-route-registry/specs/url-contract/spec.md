## ADDED Requirements

### Requirement: Backend route keys match catalog slugs
Backend route keys SHALL equal catalog `slug` values (which remain the FE URL segments and icon basenames).

#### Scenario: API routes list
- **WHEN** a client calls `GET /api/routes`
- **THEN** keys align with catalog slugs for registered visualizations
