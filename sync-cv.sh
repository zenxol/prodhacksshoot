#!/bin/bash
# sync-cv.sh — Pull teammate's latest camera/CV code from his repo.
# Usage: ./sync-cv.sh
#
# This downloads his app/page.tsx and puts it at app/camera/page.tsx
# His code runs completely unchanged at the /camera route.

set -e

REPO="zenxol/prodhacks-image-recognition"
SOURCE_PATH="app/page.tsx"
DEST_PATH="app/camera/page.tsx"

echo "Pulling latest CV code from $REPO..."
gh api "repos/$REPO/contents/$SOURCE_PATH" --jq '.content' | base64 -d > "$DEST_PATH"

echo "Done! Updated $DEST_PATH with latest code from teammate's repo."
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to test"
echo "  2. Check if he added new dependencies (compare his package.json)"
