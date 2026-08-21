---
name: redeploy-chaos
description: >-
  Redeploy Classical Chaos (CanvasWorld) to matf.dev/chaos by building the
  Docker image locally, loading it onto the droplet over SSH, and running
  Ansible compose-up with pull:false. Use when the user asks to redeploy,
  deploy chaos, ship to matf.dev/chaos, push a new chaos image, or refresh
  production after frontend/backend changes — without GitHub Actions or GHCR.
---

# Redeploy chaos (local → droplet)

**No GitHub Actions. No GHCR.** Build on the workstation, `docker load` on the droplet, Ansible only starts compose.

## Paths / hosts

| What | Value |
|------|--------|
| App repo | `/mnt/CanvasWorld-Website` |
| IaC | `~/projects/matf.dev_iac` |
| Droplet | `deploy@152.42.219.255` (inventory `matf-dev`) |
| SSH key | `~/.ssh/id_ed25519` |
| Image tag | `chaos:latest` |
| Live URL | https://matf.dev/chaos/ |

## Steps

Copy and run in order. Do not `docker build` on the droplet (OOM risk on the small DO box).

### 1. SSH check

```bash
timeout 15 ssh -i ~/.ssh/id_ed25519 -o ConnectTimeout=10 deploy@152.42.219.255 'echo UP; free -h'
```

If TCP connects but banner hangs, or SSH times out while ping works: power-cycle the droplet in DigitalOcean, poll until `UP`, then continue.

### 2. Build locally

```bash
cd /mnt/CanvasWorld-Website
docker build -t chaos:latest -f Dockerfile .
```

Dockerfile runs `pnpm exec vite build` (not `tsc`) — pre-existing TS debt.

### 3. Load onto droplet

```bash
docker save chaos:latest | ssh -i ~/.ssh/id_ed25519 deploy@152.42.219.255 'sudo docker load'
```

### 4. Compose up (pull: false)

```bash
cd ~/projects/matf.dev_iac/ansible
ansible-playbook playbooks/deploy-apps.yml -b \
  -e ansible_ssh_private_key_file=~/.ssh/id_ed25519 \
  -e '{"matf_apps":[{"name":"chaos","image":"chaos:latest","pull":false,"route":"/chaos","port":8080,"strip_prefix":true}]}'
```

Expect: registry login / pull / git clone / build **skipped**; `Compose up — chaos` **changed**.

### 5. Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://matf.dev/chaos/
curl -sS -o /dev/null -w '%{http_code}\n' https://matf.dev/chaos/blog
```

Both should be `200`. Tell the user to hard-refresh if they still see an old hashed JS bundle.

## Do not

- Add or re-enable `.github/workflows` image publish (Actions minutes)
- Push to GHCR unless the user explicitly asks
- Run `docker build` via Ansible on the droplet
- Set `pull: true` for `chaos:latest` (local tag only)

## Related IaC

`apps.yml` chaos entry: `image: chaos:latest`, `pull: false`.  
`deploy_docker.yml` only pulls when `app.pull | default(true)`.
