#!/usr/bin/env bash
# Deploy dist/ to the live Njalla nginx root.
# Remote has no rsync — upload via tar over ssh, then fix ownership/perms.
#
# Usage (from repo root, after a clean build):
#   npm run build && npm run deploy
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

echo "→ uploading (tar | ssh)…"
tar -C "$DIST" -czf - . | ssh "$HOST" "tar -C '$REMOTE_ROOT' -xzf -"

echo "→ fixing ownership and permissions…"
ssh "$HOST" "chown -R root:www-data '$REMOTE_ROOT' && find '$REMOTE_ROOT' -type d -exec chmod 755 {} + && find '$REMOTE_ROOT' -type f -exec chmod 644 {} +"

echo
echo "Live check:"
curl -sI https://jpcarpenter.com | grep -Ei 'HTTP/|strict-transport|content-security|x-content-type' || true
echo
echo "Done. Spot-check https://jpcarpenter.com"
