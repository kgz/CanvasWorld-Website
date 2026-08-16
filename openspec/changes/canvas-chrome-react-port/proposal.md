## Why

OD canvas page (#51) is ready (`design/canvasworld-prototype/canvas.html`). Live viz chrome (`template-modern.tsx`) still uses generic dark SaaS layout and does not match the homepage / OD family.

## What Changes

- Replace viz shell with OD composition: topbar, stage, floating side panel, transport bar
- Port tokens + canvas CSS from `shared.css`
- Keep AnimationContext, catalog params, screenshot/`?iframe`, shader/particle transport behaviour
- Commit `design/` prototype as source of truth

## Capabilities

### Modified Capabilities
- `viz-chrome`: OD-aligned canvas shell

## Impact

- Closes #52 (depends on #51, already done)
