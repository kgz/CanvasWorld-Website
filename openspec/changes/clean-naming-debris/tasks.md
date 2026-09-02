## 1. Spec / branch

- [x] 1.1 OpenSpec artifacts for `clean-naming-debris`
- [x] 1.2 Branch `feature/7-clean-naming-debris`

## 2. Cleanup

- [x] 2.1 Rename `ikeda Map.tsx` → `ikeda_map.tsx`; fix import
- [x] 2.2 Remove `routesV1` / `BaseRoute`; drop `dummy_data.ts` from tsconfig
- [x] 2.3 Remove `TestShaderPlane` + unreachable test block from `_base.tsx`
- [x] 2.4 Trim stale `vite-env.d.ts` / delete `t.d.ts`

## 3. Verify

- [x] 3.1 `pnpm exec vite build` in frontend
- [ ] 3.3 PR Closes #7
