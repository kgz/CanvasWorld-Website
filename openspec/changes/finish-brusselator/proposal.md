## Why

Brusselator is catalogued but `active: false`, and `brusselator.tsx` is a misnamed Clifford copy. Need a real page wired into the gallery.

## What Changes

- Implement Brusselator via `createAttractorPage` using catalog equations
- Set catalog `active: true` and register in FE component map
- Remove/replace the bogus page file; drop dead `brusselator copy.tsx` if present

## Capabilities

### New Capabilities
- (none — activates existing catalog entry)

### Modified Capabilities
- `route-registry`: brusselator becomes active

## Impact

- Closes #31
- `packages/shared/routes.json`, `routes.tsx`, `pages/misc/brusselator.tsx`
