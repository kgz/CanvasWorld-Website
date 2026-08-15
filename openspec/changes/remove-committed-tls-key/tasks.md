## 1. Remove secrets from git

- [x] 1.1 `git rm --cached` `localhost-key.pem` `localhost.pem`
- [x] 1.2 Move local copies to `packages/frontend/certs/` (keep on disk)
- [x] 1.3 Untrack `.env` and `packages/frontend/.env`
- [x] 1.4 Update `.gitignore`

## 2. Docs / examples

- [x] 2.1 Add `packages/frontend/.env.example` with cert paths under `certs/`
- [x] 2.2 Update root `env.example` + README (mkcert / copy env)
- [x] 2.3 OpenSpec change artifacts

## 3. Verify

- [x] 3.1 `git ls-files '*.pem' '.env' 'packages/frontend/.env'` empty
- [x] 3.2 Local certs still present under gitignored `certs/` for ongoing dev

## Follow-up (not this PR)

- Optional history purge / rotate mkcert key (key still in old commits)
- Resolve GitGuardian incident 9401622 after merge
