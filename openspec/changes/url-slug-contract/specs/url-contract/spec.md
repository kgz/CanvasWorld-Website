## ADDED Requirements

### Requirement: Canonical page URL
Each visualization SHALL be reachable at `/{slug}` where `slug` is the FE `genPath(displayName)` (lowercase; spaces to `_`; hyphens preserved).

#### Scenario: SPA route matches slug
- **WHEN** the user opens `/clifford_attractor`
- **THEN** the Clifford Attractor page loads (no `/chaos/` prefix)

### Requirement: Canonical icon URL
Thumbnail and OG images SHALL be served at `/chaos/icons/{slug}.png` by the backend filesystem mount on `static/images/`.

#### Scenario: Home card image
- **WHEN** the home gallery requests an icon for a registered viz
- **THEN** the URL is `{BACKEND}/chaos/icons/{slug}.png` and the file name equals `{slug}.png`

### Requirement: Screenshot capture URL
Automated screenshots SHALL navigate to `{FRONTEND_URL}/{slug}?screenshot=true` (not `{FRONTEND_URL}/chaos/{slug}`).

#### Scenario: Screenshot service
- **WHEN** `ScreenshotAttractor` runs for `clifford_attractor`
- **THEN** chromedp opens `{FRONTEND_URL}/clifford_attractor?screenshot=true`

### Requirement: Backend route keys match FE slugs
`getRoutes()` map keys SHALL equal FE slugs for every active frontend visualization (including Mandelbrot as `mandelbrot_set`, Hopalong sinusoidal as `hopalong_attractor_sinusoidal`, and Sierpiński as `sierpiński_triangle`).

#### Scenario: API routes list
- **WHEN** a client calls `GET /api/routes`
- **THEN** keys align with FE `genPath` for active pages (no `mandlebrot_set`, no `hopalong_attractor_sin` for the sinusoidal page)
