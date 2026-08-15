## Context

Issue #21 / GitGuardian incident 9401622. Key is local-dev TLS, still must leave HEAD.

## Decisions

1. **Remove from index now; history purge later** — avoid force-push without explicit ask.
2. **Certs live under `packages/frontend/certs/`** (gitignored), referenced by frontend env example.
3. **Untrack env files** — `env.example` + `packages/frontend/.env.example` are the templates.

## Risks

- Fresh clones need one-time cert + env setup (documented).
- Key remains in git history until optional purge.
