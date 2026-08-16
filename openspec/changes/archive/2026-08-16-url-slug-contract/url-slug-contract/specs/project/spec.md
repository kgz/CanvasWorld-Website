## ADDED Requirements

### Requirement: Icon path consistency for embeds
Bot SSR and human SPA shells SHALL use `/chaos/icons/{slug}.png` for Open Graph / preview images (not `/static/images/`).

#### Scenario: Bot SSR meta image
- **WHEN** a bot requests `/{slug}`
- **THEN** `og:image` references `/chaos/icons/{slug}.png` (absolute URL in production)
