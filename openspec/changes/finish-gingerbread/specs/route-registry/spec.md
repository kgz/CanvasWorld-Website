## MODIFIED Requirements

### Requirement: Shared catalog file
Catalog entries SHALL include accurate descriptions suitable for SSR/OG (not placeholder WIP text for active visualizations).

#### Scenario: Gingerbread description
- **WHEN** `GET /api/routes` includes `gingerbread_man`
- **THEN** its description is a real summary of the map, not `WIP`
