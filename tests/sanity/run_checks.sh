#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running Sanity Checks..."

echo "1. Running Type Check..."
npm run check

echo "2. Running Lint Check..."
npm run lint

echo "3. Running Unit Tests..."
npx vitest run

echo "4. Running Production Build..."
npm run build

echo "5. Running E2E Tests..."
npx playwright test tests/e2e/core_loop.spec.ts

echo "All sanity checks passed!"
