## ADDED Requirements

### Requirement: No private keys in the repository
The repository SHALL NOT track TLS private keys or certificate material (e.g. `*.pem` used for local HTTPS).

#### Scenario: Clone has no PEM secrets
- **WHEN** a developer clones the repository
- **THEN** no `localhost-key.pem` (or equivalent private key) is present in the tracked tree

### Requirement: Env templates only
Live `.env` files SHALL be gitignored. Configuration SHALL be documented via `env.example` and `packages/frontend/.env.example`.

#### Scenario: New developer setup
- **WHEN** a developer copies the env examples to local `.env` files
- **THEN** the app can be configured without committing secrets
