#!/usr/bin/env bash
# Build branded DOCX + PDF for a resource markdown pack.
# Usage: scripts/build-branded-resource.sh <basename> ["Document Title"]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ID="${1:?resource basename without extension}"
TITLE="${2:-$ID}"
SRC="$ROOT/public/downloads/resources/${ID}.md"
OUT_DIR="$ROOT/public/downloads/resources"
DOCX="$OUT_DIR/${ID}.docx"
PDF="$OUT_DIR/${ID}.pdf"

if [[ ! -f "$SRC" ]]; then
  echo "missing $SRC" >&2
  exit 1
fi

pandoc "$SRC" \
  -o "$DOCX" \
  --from=gfm \
  --to=docx \
  -M title="$TITLE" \
  -M author="JP Carpenter" \
  -M subject="JP Carpenter working template — not legal advice" \
  -M keywords="JP Carpenter, security awareness, GRC, training campaign, jpcarpenter.com" \
  --metadata=creator:"JP Carpenter" \
  --metadata=description:"Working template from JP Carpenter (jpcarpenter.com). Not legal advice."

soffice --headless --convert-to pdf --outdir "$OUT_DIR" "$DOCX" >/dev/null

if command -v exiftool >/dev/null 2>&1; then
  exiftool -overwrite_original \
    -Creator="JP Carpenter" \
    -Author="JP Carpenter" \
    -Title="$TITLE" \
    -Subject="JP Carpenter · jpcarpenter.com · Working template · Not legal advice" \
    -Keywords="JP Carpenter, security awareness, training campaign" \
    "$PDF" >/dev/null
fi

echo "Wrote $DOCX"
echo "Wrote $PDF"
