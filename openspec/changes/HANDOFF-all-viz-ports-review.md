# Handoff: batch viz QA (optional)

**Updated 2026-08-30** — epic #30 closed. No standing `temp` branch; work from `master` + `feature/<issue>-<slug>` PRs.

## Batch QA (only when needed)

```bash
git checkout master && git pull origin master
git checkout -b temp/all-viz-ports-review
# merge or cherry-pick in-flight feature branches for local click-through
cd packages/frontend && pnpm dev   # :5173
```

When the wave ships: delete the temp branch (`git push origin --delete temp/all-viz-ports-review`).

## Hygiene (after each ship wave)

- Ship each slug via **`feature/<issue>-<slug>` → PR → merge** on `master`.
- **`openspec archive <change-name> -y`**, close superseded PRs, **`board-status done`**.
- Delete or reset any batch QA branch — do not accumulate merge commits on temp.

## State

- **46 active catalog slugs** on `master`.
- **#49** (2d→3d image experiment) open, outside epic scope.
- **Skill:** `.cursor/skills/viz-visual-qa/`

## Do not ship

- `hopalong_attractor_1` (killed typo map)
