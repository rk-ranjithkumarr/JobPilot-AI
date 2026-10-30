#!/usr/bin/env bash
# ============================================================
# JobPilot AI — build script (bash + awk, no dependencies)
# Inlines src/css/styles.css and src/js/*.js into a single
# self-contained index.html that works anywhere, even file://
#
# Usage:  bash build.sh
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SHELL_HTML="$ROOT/src/index-shell.html"
OUT="$ROOT/index.html"

awk '
  /link rel="stylesheet"/ {
    print "<style>";
    while ((getline line < "src/css/styles.css") > 0) print line;
    print "</style>";
    next
  }
  /script src="js\// {
    match($0, /js\/[a-z.-]+\.js/);
    fname = "src/" substr($0, RSTART, RLENGTH);
    print "<script>";
    while ((getline line < fname) > 0) print line;
    print "<\/script>";
    next
  }
  { print }
' "$SHELL_HTML" > "$OUT"

echo "Built $OUT ($(wc -c < "$OUT") bytes, single file, zero dependencies)"
