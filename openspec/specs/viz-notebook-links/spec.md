# viz-notebook-links Specification

## Purpose
TBD - created by archiving change site-chrome-matf-notebook. Update Purpose after archive.
## Requirements
### Requirement: Dynamic canvas to notebook links
A full canvas page SHALL link to notebook posts that embed that viz (`VizEmbed` slug) or set `thumbSlug` to that viz slug. Adding or changing those fields SHALL be enough for the link to appear — no per-viz hardcode.

#### Scenario: Embedded viz
- **WHEN** a visitor opens the full canvas for a slug used in a post `VizEmbed` (e.g. Aizawa)
- **THEN** the page exposes a working link to that notebook post

#### Scenario: Multi-slug post
- **WHEN** one post embeds several slugs (e.g. hopalong family)
- **THEN** each of those full canvas pages links to that post

#### Scenario: No matching post
- **WHEN** a viz has no matching notebook post
- **THEN** the canvas page omits any notebook affordance

#### Scenario: Embed mode stays clean
- **WHEN** a canvas is shown as a notebook mini player (`?iframe`)
- **THEN** the related-note chrome is not rendered

