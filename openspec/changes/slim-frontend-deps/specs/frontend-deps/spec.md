## ADDED Requirements

### Requirement: Frontend dependencies match the live shell

`packages/frontend/package.json` SHALL list only packages imported by the live visualization shell, viz math/render path, lab notebook, or committed frontend scripts (including gallery thumbs). Unused UI stacks (MUI, ant design, leva, react-dat-gui, jquery, excel/csv kits, product tours) SHALL NOT remain as dependencies.

#### Scenario: Dead UI stacks are gone

- **WHEN** a developer inspects `packages/frontend/package.json`
- **THEN** it does not include `@mui/material`, `antd`, `leva`, `react-dat-gui`, or `jquery`

### Requirement: Orphaned Menu and dat-gui gallery are removed

The SPA SHALL NOT ship `Menu.tsx` or the unused MUI `pages/index.tsx` gallery. Home SHALL continue to render via `index-new.tsx` through `template-modern.tsx`.

#### Scenario: Home still loads the modern gallery

- **WHEN** a visitor opens `/chaos/`
- **THEN** the Tailwind/CSS-module home (`index-new`) is shown, not the MUI card gallery
