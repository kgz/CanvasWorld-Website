## ADDED Requirements

### Requirement: Home route does not download every viz module

The initial home/gallery route SHALL not request JS chunks for individual visualization pages.

#### Scenario: Gallery load

- **WHEN** a user opens `/chaos/` without navigating to a viz slug
- **THEN** the browser transfers substantially less JS than the pre-split single-bundle build

### Requirement: Viz routes load on demand with Suspense

Each catalog slug SHALL resolve through `React.lazy` and render inside a Suspense boundary with a visible fallback.

#### Scenario: Navigate to attractor

- **WHEN** a user opens `/chaos/{slug}`
- **THEN** only that page's chunk (plus shared deps) loads and the viz renders
