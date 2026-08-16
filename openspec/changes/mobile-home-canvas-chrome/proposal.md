## Why

Homepage and canvas chrome were shipped desktop-first (#24, #52). On phone/tablet widths, brand composition, params panel, and transport need reliable touch-friendly layouts without horizontal overflow.

## What Changes

- Harden homepage responsive layout (nav, hero, gallery) at ~390 and ~768 widths
- Polish canvas chrome mobile drawer/scrim, topbar labels, transport wrap/touch targets
- Ensure stage fills remaining viewport; params open/close without permanently blocking viz
- Update OD prototype only if React polish needs clarified layout rules

## Capabilities

### New Capabilities

- `mobile-home-canvas-chrome`: Home + canvas chrome usable on small viewports with touch-friendly controls

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/frontpage.module.css` / `index-new.tsx`
- `packages/frontend/src/pages/canvasChrome.module.css` / `template-modern.tsx`
- Possibly `design/canvasworld-prototype/`
- Issue #65
