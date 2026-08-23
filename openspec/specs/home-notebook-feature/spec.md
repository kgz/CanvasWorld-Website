# home-notebook-feature Specification

## Purpose
TBD - created by archiving change site-chrome-matf-notebook. Update Purpose after archive.
## Requirements
### Requirement: Featured notes on home
The home page SHALL show a notebook section with up to three posts (featured flag first, then catalog `order`) including title, tag or excerpt, and a link to `/blog/:slug`.

#### Scenario: Section present
- **WHEN** a visitor opens `/chaos/`
- **THEN** a notebook section appears below the gallery with working links to featured notes

#### Scenario: Index through-line
- **WHEN** the home notebook section is shown
- **THEN** it includes a link to the full notebook index at `/blog`

#### Scenario: Gallery stays primary
- **WHEN** the home page loads
- **THEN** the gallery remains the primary content block; the notebook section does not replace or overlay it

