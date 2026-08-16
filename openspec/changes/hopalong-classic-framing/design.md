## Context

Particle mode defaults to camera `[0,0,400]`. Classic Hopalong extent at ~7k points is ~30 world units with `scale: 1` → ~5% of FOV. Positive uses `scale: 5` + `cameraPosition: [0,0,-175]`.

## Goals / Non-Goals

**Goals:** Comfortable first-viewport framing for classic Hopalong; match sibling readability.

**Non-Goals:** Changing iterate math, params, color mode, or other Hopalong variants.

## Decisions

1. Set explicit `scale` and `cameraPosition` on classic page (same knobs as siblings).
2. Target ~30–50% viewport fill around mid transport progress; full count may extend past frame (orbit ok).
3. Prefer negative-Z camera to match other attractor pages.

## Risks

- Full 200k may overflow the frame more than before — acceptable; was unreadable before.
