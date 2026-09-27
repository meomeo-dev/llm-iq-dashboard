#!/bin/sh
# POSIX sh askpass script for Git HTTPS authentication with GitHub App token.
set -eu

case "${*:-}" in
  *Username*)
    printf '%s\n' "x-access-token"
    exit 0
    ;;
esac

TOKEN_FILE="${PELICAN_GIT_TOKEN_FILE:-}"
if [ -n "$TOKEN_FILE" ] && [ -f "$TOKEN_FILE" ]; then
  cat "$TOKEN_FILE"
  exit 0
fi

exit 1
