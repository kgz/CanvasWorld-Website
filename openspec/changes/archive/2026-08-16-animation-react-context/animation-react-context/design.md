## Context

Issue #4. CustomEvent bridge between bottom chrome and particle tick hook.

## Goals / Non-Goals

**Goals:**
- Typed context owned by `ModernCanvasPage`
- No window CustomEvents for animation transport
- No `progress-text` / `progress-slider` DOM id writes
- Progress max = live particle count from tick
- Screenshot mode still draws all particles

**Non-Goals:**
- Replacing Redux dat GUI (#11)
- Migrating remaining attractors to factory

## Decisions

1. Provider wraps each viz page (including screenshot shell) with `key={route.slug}`
2. Control state (paused/speed/manual) in context; progress ref + throttled React state for UI (~20fps)
3. `useAnimationState` requires provider (always wrapped)
4. Completion sets paused + `isComplete` for replay UI

## Risks / Trade-offs

- [Extra re-renders from progress] → throttle UI updates
- [Stale tick closures] → context values read each tick via hook re-render on control changes; progress ref for continuous count
