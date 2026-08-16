#!/usr/bin/env bash
# Import (or re-link) the CanvasWorld OD prototype folder into Open Design.
#
# Usage:
#   ./bin/od-import-project.sh
#   ./bin/od-import-project.sh /path/to/custom/design-folder
#
# Env:
#   OD_DAEMON_URL   default: http://127.0.0.1:7456
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DESIGN_DIR="${1:-$ROOT/design/canvasworld-prototype}"
DAEMON="${OD_DAEMON_URL:-http://127.0.0.1:7456}"
MANIFEST="$DESIGN_DIR/.od-project.json"

if [[ ! -f "$DESIGN_DIR/index.html" ]]; then
	echo "Missing index.html in $DESIGN_DIR" >&2
	exit 1
fi

if ! curl -sf --max-time 2 "$DAEMON/api/daemon/status" >/dev/null; then
	echo "Open Design daemon not reachable at $DAEMON" >&2
	echo "Start OD locally, then retry." >&2
	exit 1
fi

response="$(
	DESIGN_DIR="$DESIGN_DIR" DAEMON="$DAEMON" python3 <<'PY'
import json
import os
from urllib import request

design_dir = os.environ["DESIGN_DIR"]
daemon = os.environ["DAEMON"]

body = json.dumps({"baseDir": design_dir}).encode()
req = request.Request(
    f"{daemon}/api/import/folder",
    data=body,
    method="POST",
    headers={"Content-Type": "application/json"},
)
with request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())

project = data["project"]
conversation_id = data.get("conversationId") or data.get("conversation", {}).get("id")
if not conversation_id:
    conv_req = request.Request(
        f"{daemon}/api/projects/{project['id']}/conversations",
        data=json.dumps({"title": "Main", "sessionMode": "design"}).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with request.urlopen(conv_req) as resp:
        conversation_id = json.loads(resp.read().decode())["conversation"]["id"]

print(json.dumps({
    "projectId": project["id"],
    "projectName": project.get("name"),
    "conversationId": conversation_id,
    "baseDir": project.get("metadata", {}).get("baseDir", design_dir),
}))
PY
)"

project_id="$(echo "$response" | python3 -c 'import json,sys; print(json.load(sys.stdin)["projectId"])')"
conversation_id="$(echo "$response" | python3 -c 'import json,sys; print(json.load(sys.stdin)["conversationId"])')"
project_name="$(echo "$response" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("projectName") or "")')"

python3 -c 'import json,sys; print(json.dumps(json.load(sys.stdin), indent=2))' <<<"$response" >"$MANIFEST"

echo "Imported OD project: $project_id"
[[ -n "$project_name" ]] && echo "Name: $project_name"
echo "Conversation: $conversation_id"
echo "Manifest: $MANIFEST"
echo "Open: http://127.0.0.1:7456/projects/$project_id"
