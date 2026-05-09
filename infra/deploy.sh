#!/usr/bin/env bash

# deployment pipeline: build locally first, then deploy if successful.
set -e

echo "========================================="
echo "🚀 Starting Deployment Pipeline..."
echo "========================================="

echo "\n📦 Step 1: Compiling TypeScript (Strict Mode)..."
# We run the exact same strict compilation that Cloud Build will run
npx tsc -b

echo "\n🛠️ Step 2: Building Vite bundle..."
npm run build

echo "\n✅ Local Build Passed. Proceeding to Cloud Run Deployment..."
mkdir -p docs/build_logs

export HTTP_PROXY="" HTTPS_PROXY="" http_proxy="" https_proxy="" all_proxy="" ALL_PROXY=""

# Deploy to Cloud Run and capture logs
gcloud run deploy bg3-splendor --source . --region asia-east1 --allow-unauthenticated --quiet > docs/build_logs/deploy.log 2>&1

echo "\n🎉 Deployment Pipeline Completed Successfully!"
echo "Check docs/build_logs/deploy.log for Cloud Build details if needed."
