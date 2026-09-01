#!/bin/bash
# Refuse to upload if build/source.zip contains files git doesn't track.
# The zip includes everything .gitignore doesn't match — untracked notes,
# files reached through symlinks — and none of that belongs on Zapier.
set -e

tracked()  { git ls-files | sort; }
uploaded() { zipinfo -1 build/source.zip | grep -v '/$' | sort; }

untracked=$(comm -13 <(tracked) <(uploaded))

if [[ -n "$untracked" ]]; then
  echo "Refusing to upload: build/source.zip contains files not tracked by git:" >&2
  sed 's/^/  /' <<< "$untracked" >&2
  exit 1
fi

echo "source.zip OK: all files are git-tracked"
