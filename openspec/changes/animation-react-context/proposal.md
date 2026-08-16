## Why

`useAnimationState` and `template-modern` talk via `window` CustomEvents and `document.getElementById` for progress. Untyped, fragile, and progress max is hardcoded to 200000.

## What Changes

- Add `AnimationProvider` + `useAnimation` context for play/pause/speed/progress/replay/completion
- Rewrite `useAnimationState` to consume context (no window events)
- Wire `ModernCanvasPage` controls to context; progress max follows reported particle count
- Keep screenshot mode forcing full particle draw

## Capabilities

### New Capabilities
- `animation-controls`: Typed React context for viz animation transport

### Modified Capabilities
- (none)

## Impact

- Closes #4
- `packages/frontend/src/hooks/useAnimationState.ts`, new context module, `template-modern.tsx`
