## ADDED Requirements

### Requirement: Mandelbrot controls match canvas chrome
The Mandelbrot page SHALL expose primary numeric controls through the canvas Params panel and SHALL NOT render a competing Tailwind control card on the stage.

#### Scenario: Params panel
- **WHEN** a user opens `/chaos/mandelbrot_set` with the Params panel open
- **THEN** iterations and color scheme are adjustable from that panel

#### Scenario: Stage HUD
- **WHEN** the page is shown outside screenshot/`?iframe` mode
- **THEN** a quiet OD-styled HUD provides mode toggle, reset, export, and center/zoom meta without a gray SaaS card

### Requirement: Clean stage render
The Mandelbrot/Julia shader SHALL fill the stage without edge fringing from resolution mismatch.

#### Scenario: Desktop stage
- **WHEN** the viz canvas is sized by the chrome stage host
- **THEN** the fractal fills the drawable area without magenta/cyan edge garbage
