# frontend-hygiene Specification

## Purpose
TBD - created by archiving change clean-naming-debris. Update Purpose after archive.
## Requirements
### Requirement: Viz source files use sane ASCII names

Active visualization page modules SHALL use ASCII filenames without spaces or copy/backup suffixes.

#### Scenario: Ikeda map module path

- **WHEN** the route registry imports the Ikeda map page
- **THEN** the module path is `pages/maps/ikeda_map.tsx` (no space in the filename)

### Requirement: Route registry has no dead exports

`packages/frontend/src/@types/routes.tsx` SHALL export only symbols used by the live app.

#### Scenario: No legacy route stubs

- **WHEN** a developer reads the routes registry
- **THEN** it does not export empty `routesV1` or null `BaseRoute` placeholders

