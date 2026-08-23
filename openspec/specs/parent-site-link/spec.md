# parent-site-link Specification

## Purpose
TBD - created by archiving change site-chrome-matf-notebook. Update Purpose after archive.
## Requirements
### Requirement: Apex parent link
Marketing site chrome (home, notebook index, and notebook post pages) SHALL include a link labeled `matf.dev` whose href is `https://matf.dev/` (apex, not `/chaos`).

#### Scenario: Home footer
- **WHEN** a visitor opens `/chaos/`
- **THEN** the footer contains a working link to `https://matf.dev/`

#### Scenario: Notebook pages
- **WHEN** a visitor opens `/chaos/blog` or a post page
- **THEN** the same parent-site link is present in site chrome

#### Scenario: Not a second wordmark
- **WHEN** the parent link is shown
- **THEN** it uses muted chrome treatment (nav item and/or footer), not a replacement for the Classical Chaos wordmark

