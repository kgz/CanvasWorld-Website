## Context

Archive `(3d) Lorenz` uses classic params a=10, b=28, c=8/3 and soft blue line material `#729ee5`, but stores *derivatives* into the buffer (bug) and its README equations are wrong. Current FE particle pipeline is R3F `Points` + `EDimensions.THREE_D` via `Base`.

## Goals / Non-Goals

**Goals:** Correct Lorenz butterfly; archive blue color language; OD chrome + transport; gallery card.

**Non-Goals:** Lorenz 86 (#40); line strips (points are enough); redesign chrome.

## Decisions

1. Integrate and plot **state** \((x,y,z)\), not \(\dot x,\dot y,\dot z\).
2. UI params `a,b,c` map to \(\sigma,\rho,\beta\) (archive naming).
3. Color: soft blue `#729ee5` with mild HSL drift along the trail; yellow tip for recent points (existing attractor convention).
4. Center framing by offsetting \(z\) (~ρ−1) so OrbitControls at origin frame the lobes.
5. First 3D attractor page is hand-rolled (like Bedhead), not `createAttractorPage` (2D-only).

## Risks

- Point size / scale need visual QA under chrome vignette.
- Dense 200k points may need slightly smaller `pointSize` than 2D pages.
