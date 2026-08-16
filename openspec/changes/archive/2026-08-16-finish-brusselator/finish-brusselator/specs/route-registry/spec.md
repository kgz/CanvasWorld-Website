## MODIFIED Requirements

### Requirement: Active filter
Screenshot-all and thumbs generation SHALL only process entries with `active: true`. Inactive stubs MAY remain in the catalog for documentation/SSR later.

#### Scenario: Brusselator active
- **WHEN** `brusselator` is `active: true` and registered in the FE component map
- **THEN** it appears in the gallery and is included in screenshot-all / thumbs
