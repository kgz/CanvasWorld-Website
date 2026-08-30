## Why

#136: About panels, tick/shader code, and `routes.json` drifted (Bogdanov once shipped Hénon copy). Active catalog slugs need a one-pass check and in-place fixes.

## What Changes

- Walk every active slug: `getDescription` / factory `description`, iterate/tick/shader, datGUI names/ranges/defaults, `routes.json` description
- Fix mismatches in place (no child tickets unless a slug needs a visual rework)
- Audit log on GitHub #136

## Capabilities

### New Capabilities

- `about-catalog-audit`: About, live math, and catalog copy stay aligned for active slugs

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/**`, shaders as needed
- `packages/shared/routes.json`
- Closes #136
