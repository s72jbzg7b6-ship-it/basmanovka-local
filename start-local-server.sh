#!/bin/zsh
set -euo pipefail

ROOT="/Users/user/Desktop/CODEX/basmanovka-local"
PORT="4173"
PID_FILE="$ROOT/.tmp/local-server.pid"
LOG_FILE="$ROOT/.tmp/local-server.log"

mkdir -p "$ROOT/.tmp"

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${OLD_PID:-}" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Server already running on http://127.0.0.1:$PORT (pid $OLD_PID)"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

NEW_PID="$(
  /usr/bin/python3 - <<'PY'
import os
import subprocess

root = "/Users/user/Desktop/CODEX/basmanovka-local"
port = "4173"
log_file = "/Users/user/Desktop/CODEX/basmanovka-local/.tmp/local-server.log"

with open(log_file, "ab", buffering=0) as log:
    proc = subprocess.Popen(
        ["/usr/bin/python3", "-m", "http.server", port, "--bind", "127.0.0.1", "--directory", root],
        stdin=subprocess.DEVNULL,
        stdout=log,
        stderr=subprocess.STDOUT,
        start_new_session=True,
        close_fds=True,
    )
    print(proc.pid)
PY
)"

echo "$NEW_PID" > "$PID_FILE"

sleep 1

if kill -0 "$NEW_PID" 2>/dev/null; then
  echo "Server started on http://127.0.0.1:$PORT (pid $NEW_PID)"
else
  echo "Server failed to start. Check $LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi
