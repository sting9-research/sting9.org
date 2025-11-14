#!/bin/bash

# Quick test script for Sting9 Email Worker
# Usage: ./test-local.sh [fixture-name]
# Example: ./test-local.sh gmail-forward

set -e

FIXTURE=${1:-"gmail-forward"}
FIXTURE_PATH="test/fixtures/${FIXTURE}.eml"

if [ ! -f "$FIXTURE_PATH" ]; then
    echo "❌ Fixture not found: $FIXTURE_PATH"
    echo "Available fixtures:"
    ls -1 test/fixtures/*.eml
    exit 1
fi

echo "🧪 Testing with fixture: $FIXTURE_PATH"
echo ""

curl -v -X POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=test@example.com' \
  --url-query 'to=submit@sting9.org' \
  --data-binary "@$FIXTURE_PATH"

echo ""
echo "✅ Test complete. Check console logs above for processing details."
