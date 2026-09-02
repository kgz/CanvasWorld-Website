## 1. Spec / branch

- [x] 1.1 OpenSpec artifacts for `slim-frontend-deps`
- [x] 1.2 Branch `feature/5-slim-frontend-deps`

## 2. Delete dead UI

- [x] 2.1 Delete `Menu.tsx`, old `index.tsx`, `index-test.tsx`, `components/ui/`, `genPath.ts`, `onClickOutside.tsx`, `wdyr.ts`
- [x] 2.2 Delete `@scss/` and unused `_base` SCSS import; drop dat-gui `console.warn` shim
- [x] 2.3 Simplify `dev` script; drop babel decorator plugins from Vite if unused

## 3. Slim package.json

- [x] 3.1 Remove unused dependencies and leftover eslint/vite plugins
- [x] 3.2 `pnpm install` lockfile

## 4. Verify

- [x] 4.1 `pnpm run build` in frontend
- [x] 4.2 Browser: home + one viz page still load
- [x] 4.3 PR Closes #5
