## Why

Open Design delivered a brand-first frontpage (`design/canvasworld-prototype/home.html`). The live React home (`index-new.tsx`) still uses a generic “My World of Chaos” dashboard layout. Port the OD composition so production matches the visual source of truth.

## What Changes

- Replace the React homepage with the OD structure: sticky nav, full-bleed hero (CanvasWorld as hero brand + CTA), gallery below the fold, minimal footer
- Wire gallery cards to the real route registry (`routes` + `genPath`) and `/chaos/icons/{slug}.png` thumbs
- Port OD tokens / motion (hero ink canvas, card reveal, random CTA highlight) into frontend CSS + small React hooks
- Keep viz routes / template chrome unchanged

## Capabilities

### New Capabilities
- `frontpage`: Brand-first home + gallery landing experience

### Modified Capabilities
- (none)

## Impact

- Closes #24
- Frontend: `packages/frontend/src/pages/index-new.tsx` and related CSS/components
- Source design: `design/canvasworld-prototype/home.html` + `css/shared.css`
