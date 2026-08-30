# Handoff: `temp/all-viz-ports-review`

**Updated 2026-08-30** — branch reset to `master`. Viz port wave shipped individually; temp is for batch QA only.

## Hygiene (do this after each ship wave)

```bash
git checkout master && git pull origin master
git checkout temp/all-viz-ports-review
git reset --hard master
git push --force-with-lease origin temp/all-viz-ports-review
```

- Ship each slug via **`feature/<issue>-<slug>` → PR → merge** (never accumulate on temp long-term).
- After merge: **`openspec archive <change-name> -y`**, close superseded PRs, **`board-status done`**.
- Temp holds **at most** in-flight QA — reset when the wave is done.

## Resume (batch QA only)

```bash
git checkout temp/all-viz-ports-review
git pull
cd packages/frontend && pnpm dev   # :5173
# icons proxy :8080 if regen thumbs
```

## Branch state

- **46 active catalog slugs** — matches `master` (no temp-only viz).
- **Epic #30:** archive ports done; **#49** (2d→3d image experiment) still open.
- **Skill:** `.cursor/skills/viz-visual-qa/`

## Do not ship

- `hopalong_attractor_1` (killed typo map)
