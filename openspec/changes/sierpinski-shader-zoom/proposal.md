## Why

Particle-grid Sierpiński cannot gain detail when zooming — OrbitControls only magnify fixed cells. Users find it underwhelming.

## What Changes

- Replace particle membership render with a GPU fragment shader
- Mandelbrot-style scroll-zoom + drag-pan (mouse-anchored)
- Depth control up to ~40 (float precision ceiling)
- Catalog `renderMode: shader`

## Capabilities

### Modified Capabilities
- `sierpinski-triangle`: zoomable shader gasket

## Impact

- Much deeper interactive exploration; animation progress bar less meaningful (static shader)
