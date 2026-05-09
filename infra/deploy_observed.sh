#!/bin/bash

# Deployment Observability Script
# Measures and breaks down Cloud Run deployment latency.

# Project Settings
SERVICE_NAME="bg3-splendor"
REGION="us-central1"

echo "🚀 Starting Observed Deployment for $SERVICE_NAME..."
GLOBAL_START=$(date +%s)

# 1. Source Size Analysis
echo "--- Phase 1: Analyzing Source Size ---"
# macOS du doesn't have --exclude. We use a simpler approach or just du -sh .
# Since we have .gcloudignore, the actual upload size is what matters.
# We'll just show the total size of the current dir as a reference.
TOTAL_DIR_SIZE=$(du -sh . | cut -f1)
echo "📦 Total project directory size: $TOTAL_DIR_SIZE"
echo "ℹ️  (Actual upload will be smaller due to .gcloudignore)"

# 2. Uploading & Building
echo "--- Phase 2: Uploading & Building (Cloud Build) ---"
START_BUILD=$(date +%s)

# Unset proxy for gcloud
unset http_proxy https_proxy all_proxy ftp_proxy CLOUDSDK_CONTEXT_AWARE_USE_ECP_HTTP_PROXY

# Run gcloud and capture output
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --quiet

END_BUILD=$(date +%s)
BUILD_DURATION=$((END_BUILD - START_BUILD))

# 3. Final Analysis
TOTAL_DURATION=$((END_BUILD - GLOBAL_START))

echo ""
echo "📊 DEPLOYMENT PERFORMANCE REPORT"
echo "-------------------------------"
echo "Total Upload Size:    $SOURCE_SIZE"
echo "Build & Deploy Time:  ${BUILD_DURATION}s"
echo "Total Elapsed Time:   ${TOTAL_DURATION}s"
echo "-------------------------------"

if [ $BUILD_DURATION -gt 300 ]; then
    echo "⚠️ ALERT: Deployment is taking over 5 minutes. Bottleneck detected."
    echo "💡 Suggestion: Optimize .gcloudignore or move large assets to GCS."
fi
