## 1. Spec & branch

- [x] 1.1 OpenSpec artifacts for `unified-route-registry`
- [x] 1.2 Branch `feature/1-unified-route-registry`

## 2. Shared catalog

- [x] 2.1 Create `packages/shared/routes.json` from current FE+BE data
- [x] 2.2 Mark stubs `active: false` (brusselator, sierpiński until FE-wired)

## 3. Backend

- [x] 3.1 Load catalog from disk / env; replace `getRoutes()` map
- [x] 3.2 Screenshot-all uses active entries only
- [x] 3.3 Ship catalog in Docker final/backend build context

## 4. Frontend & thumbs

- [x] 4.1 FE routes from catalog + component map
- [x] 4.2 Thumbs script reads active slugs from JSON
- [x] 4.3 Vite alias for shared catalog if needed

## 5. Verify

- [x] 5.1 `go build` backend
- [x] 5.2 `pnpm exec vite build` frontend
