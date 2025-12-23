#!/bin/bash

# Skip build if commit message contains [skip ci]
if git log -1 --pretty=%B | grep -qF "[skip ci]"; then
  echo "🛑 - Build cancelled ([skip ci] detected)"
  exit 0
fi

# Skip build for gh-pages branch
if [ "$VERCEL_GIT_COMMIT_REF" == "gh-pages" ]; then
  echo "🛑 - Build cancelled (gh-pages branch)"
  exit 0
fi

# Proceed with build
echo "✅ - Build can proceed"
exit 1
