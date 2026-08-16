# CanvasWorld — Open Design prototypes

Static HTML/CSS under `canvasworld-prototype/`. Visual source of truth before React/WebGL ports.

## Prerequisites

- [Open Design](https://github.com/kgz/open-design) daemon on `http://127.0.0.1:7456`
- OD docker must mount this repo. In `open-design/deploy/docker-compose.wsl.yml`:

```yaml
- ${OPEN_DESIGN_CANVASWORLD_MOUNT:-/mnt/CanvasWorld-Website}:/mnt/CanvasWorld-Website:rw
```

Then:

```bash
cd ~/tools/open-design/deploy
docker compose -f docker-compose.yml -f docker-compose.wsl.yml up -d
```

## Workflow

```bash
# Once (or after resetting OD data)
./bin/od-import-project.sh

# Start a design run (watch in OD UI)
./bin/od-design-run.sh -f design/canvasworld-prototype/od-design-prompt.md

# Issue-linked follow-up
./bin/od-design-run.sh --issue 12 --new-conversation "#12 Home" "Design …"
```

Manifest: `design/canvasworld-prototype/.od-project.json` (written by import).
