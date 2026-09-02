# viz-base Specification

## Purpose
TBD - created by archiving change cleanup-base. Update Purpose after archive.
## Requirements
### Requirement: Base renderer has no debug kitchen sink

`packages/frontend/src/pages/_base.tsx` SHALL contain only production render paths (particles, line trail, mesh, shader) without unused imports, dead refs, or debug-only branches.

#### Scenario: No dead canvas ref hook

- **WHEN** a visualization page mounts through `Base`
- **THEN** `_base` does not expose or wire a `setCanvasRef` callback that no page uses

### Requirement: Production viz utils do not log to the console

Shared attractor math used at runtime SHALL NOT call `console.log`, `console.warn`, or `console.error` for normal iteration/debug output.

#### Scenario: Bedhead tick in production

- **WHEN** the Bedhead attractor runs its tick function during animation
- **THEN** no console warnings are emitted for exploding or edge-case iterations

