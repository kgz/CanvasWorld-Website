## ADDED Requirements

### Requirement: Viz pages expose catalog OG, thumb, and no-JS copy

Active viz routes SHALL emit full Open Graph and Twitter tags from the catalog (title, description, canonical URL, `og:image` at `https://matf.dev/chaos/icons/{slug}.png`). Each viz page SHALL include at least one `<img>` whose `alt` is title plus a description clause, not empty and not a filename. A category search H2 SHALL be present in the document. Catalog description SHALL be present in a `<noscript>` block.

#### Scenario: Lorenz viz meta

- **WHEN** a user or crawler loads `/lorenz_attractor`
- **THEN** the document has `og:image` pointing at the Lorenz gallery thumb
- **AND** an `<img>` alt contains the catalog title
- **AND** an H2 uses attractor student-search phrasing

#### Scenario: VizEmbed poster

- **WHEN** a notebook post renders `<VizEmbed slug="hilbert_curve">`
- **THEN** the embed includes an `<img>` of the Hilbert thumb with a non-empty alt
- **AND** a noscript link points at the full viz route
