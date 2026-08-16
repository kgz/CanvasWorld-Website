## MODIFIED Requirements

### Requirement: ASCII-only catalog slugs
Active catalog slugs and thumbnail path segments SHALL use ASCII characters only. Display titles MAY include diacritics.

#### Scenario: Sierpinski slug
- **WHEN** the Sierpiński triangle is listed in `routes.json`
- **THEN** its slug is `sierpinski_triangle` (no `ń` or other non-ASCII)
