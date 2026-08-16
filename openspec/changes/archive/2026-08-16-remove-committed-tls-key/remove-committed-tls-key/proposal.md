## Why

GitGuardian flagged `localhost-key.pem` (generic private key) in the repo. Local mkcert TLS material and tracked `.env` files must not ship in git.

## What Changes

- Remove `localhost-key.pem` / `localhost.pem` from version control; gitignore `*.pem` and cert dirs
- Untrack `.env` / `packages/frontend/.env`; keep `env.example` + `packages/frontend/.env.example`
- Document regenerating local HTTPS certs
- **Non-goal this PR:** full history rewrite (optional follow-up; coordinate before force-push)

## Capabilities

### New Capabilities
- `secrets-hygiene`: No private keys or live env files in the tree

### Modified Capabilities
- (none requirement-level beyond secrets)

## Impact

- Closes #21
- Local HTTPS: developers generate certs under gitignored paths
- Anyone cloning fresh must copy env examples and optionally run mkcert
