## Context

Issue #7 lists concrete debris; several items (`brusselator copy`, `_base.tsx.backup`, `test.*.glsl`) are already gone. Remaining: spaced Ikeda filename, route-registry stubs, `_base` test shader block, tsconfig/vite-env leftovers.

## Goals / Non-Goals

**Goals:**
- ASCII filenames matching slug (`ikeda_map.tsx`)
- No dead exports in routes registry
- No unreachable debug shader code in `_base`

**Non-Goals:**
- Rename `gumowski-mira_attractor` slug (#16)
- Full `_base` refactor (#9)
- Remove Matomo `console.log` unless it's clearly debug-only

## Decisions

- **Rename via git mv** — slug unchanged; only file path + import update
- **Delete TestShaderPlane entirely** — second `isShaderProps` branch is unreachable dead code, not a feature

## Risks / Trade-offs

- [Import path only] — no catalog/thumb/icon changes for Ikeda rename
