## Why

Mandelbrot (#67) still uses a legacy Tailwind control stack on the stage and shows edge fringing. It does not match OD canvas chrome (#52).

## What Changes

- Move primary params (iterations, color scheme) into the chrome Params panel via `datData`
- Replace the Tailwind card with a quiet OD-styled stage HUD (mode, reset, export, meta)
- Fix resolution / UV sampling that causes edge artifacts
- Keep zoom/pan, Julia click-to-pick, screenshot/`?iframe` behaviour

## Capabilities

### Modified Capabilities
- `mandelbrot-viz`: chrome-aligned Mandelbrot/Julia controls + clean stage render

## Impact

- Closes #67
