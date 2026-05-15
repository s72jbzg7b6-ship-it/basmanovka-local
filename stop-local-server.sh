#!/bin/zsh
set -euo pipefail

ROOT="/Users/user/Desktop/CODEX/basmanovka-local"
PID_FILE="$ROOT/.tmp/local-server.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No PID file found"
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  echo "Stopped server pid $PID"
else
  echo "Server process not running"
fi

rm -f "$PID_FILE"
