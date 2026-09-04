#!/usr/bin/env bash
# Deploy dist/ to the live Njalla nginx root.
# Remote has no rsync — upload via tar over ssh into a staging dir, then swap it in so
# deletions actually propagate and the previous build stays around for rollback.
#
# Usage (from repo root, after a clean build):
#   npm run build && npm run deploy     # npm run deploy runs the ship gate first
#
# Rollback (previous build is kept next to the live root):
#   ssh root@HOST "rm -rf /var/www/jpcarpenter.com && mv /var/www/jpcarpenter.com.prev /var/www/jpcarpenter.com"
#
# Env overrides:
#   DEPLOY_HOST   default: root@80.78.27.111
#   DEPLOY_ROOT   default: /var/www/jpcarpenter.com
#   DEPLOY_YES=1  skip the interactive confirm

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
HOST="${DEPLOY_HOST:-root@80.78.27.111}"
REMOTE_ROOT="${DEPLOY_ROOT:-/var/www/jpcarpenter.com}"

if [[ ! -d "$DIST" ]]; then
  echo "No dist/ — run: npm run build" >&2
  exit 1
fi

if [[ ! -f "$DIST/index.html" ]]; then
  echo "dist/index.html missing — build looks incomplete. Run: npm run build" >&2
  exit 1
fi

echo "Deploy jpcarpenter.com"
echo "  local:  $DIST"
echo "  remote: $HOST:$REMOTE_ROOT"
echo

if [[ "${DEPLOY_YES:-}" != "1" ]]; then
  read -r -p "Upload and replace live site files? [y/N] " ans
  case "$ans" in
    y|Y|yes|YES) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

# Unpack into a staging directory and swap it in, rather than extracting over the live
# root. Extracting in place only ever adds and overwrites: a page deleted from the repo
# stayed served forever. /logo-sampler survived that way long after its route was gone.
STAGE="${REMOTE_ROOT}.staging"
PREV="${REMOTE_ROOT}.prev"

echo "→ uploading to staging (tar | ssh)…"
ssh "$HOST" "rm -rf '$STAGE' && mkdir -p '$STAGE'"
tar -C "$DIST" -czf - . | ssh "$HOST" "tar -C '$STAGE' -xzf -"

echo "→ verifying staged build…"
ssh "$HOST" "test -f '$STAGE/index.html'" || {
  echo "staged build has no index.html — aborting, live site untouched" >&2
  ssh "$HOST" "rm -rf '$STAGE'"
  exit 1
}

echo "→ fixing ownership and permissions…"
ssh "$HOST" "chown -R root:www-data '$STAGE' && find '$STAGE' -type d -exec chmod 755 {} + && find '$STAGE' -type f -exec chmod 644 {} +"

echo "→ swapping staging into place (previous kept at $PREV)…"
ssh "$HOST" "set -e; rm -rf '$PREV'; if [ -d '$REMOTE_ROOT' ]; then mv '$REMOTE_ROOT' '$PREV'; fi; mv '$STAGE' '$REMOTE_ROOT'"

echo
echo "Live check:"
curl -sI https://jpcarpenter.com | grep -Ei 'HTTP/|strict-transport|content-security|x-content-type' || true
echo
echo "Done. Spot-check https://jpcarpenter.com"
