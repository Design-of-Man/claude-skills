#!/usr/bin/env bash
# Install every skill in this repo into ~/.claude/skills/.
#
# Intended for a Claude Code cloud environment Setup script, which runs before
# Claude starts in every session. Also runnable by hand from a clone.
#
# Deliberately never fails hard: a skills-sync problem must not stop a session
# from starting. Missing skills are recoverable; a blocked session is not.
set -u

REPO="${SKILLS_REPO:-https://github.com/nicholasbkashuba-lab/claude-skills}"
DEST="${HOME}/.claude/skills"

if [ -d "$(dirname "$0")/skills" ]; then
    SRC="$(cd "$(dirname "$0")/skills" && pwd)"          # running from a clone
else
    TMP="$(mktemp -d)"
    git clone --depth 1 "$REPO" "$TMP/repo" >/dev/null 2>&1 || {
        echo "skills: clone failed, continuing without them" >&2
        exit 0
    }
    SRC="$TMP/repo/skills"
fi

mkdir -p "$DEST" || exit 0
cp -r "$SRC"/* "$DEST"/ 2>/dev/null || true

echo "skills installed: $(ls -1 "$DEST" 2>/dev/null | tr '\n' ' ')"
exit 0
