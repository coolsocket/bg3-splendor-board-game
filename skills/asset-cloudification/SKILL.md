# Asset Cloudification Protocol (ACP)

This skill provides a workflow for migrating heavy local assets to Google Cloud Storage (GCS) and resolving them via CDN.

## Purpose
To keep the application's deployment image lightweight (<10MB) and ensure high-speed global delivery of media assets.

## Mandatory Workflow

### 1. The GCS Upload
Upload all new images or audio to the production bucket:
- **Bucket**: `gs://bg3-splendor-static-assets`
- **Region**: `asia-east1`
- **Access**: Ensure all objects have `allUsers: Reader` permission.

### 2. The Asset Mapping
Register the new asset in `src/repositories/assetMapping.json`.
- **Key**: A semantic ID (e.g., `card_shadowheart`).
- **Value**: The relative path in the bucket (e.g., `cards/shadowheart.png`).

### 3. The Repository Resolution
Verify that the `AssetRepository` can resolve the URL:
- **Call**: `AssetRepository.getArt('card_shadowheart')`.
- **Expected**: `https://storage.googleapis.com/bg3-splendor-static-assets/cards/shadowheart.png`.

### 4. CORS Management
If assets fail to load due to CORS, verify the bucket's CORS configuration:
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

## Anti-Patterns
- ❌ **Git Assets**: Storing `.png` or `.mp3` files in the `src/assets` directory (except for small UI icons).
- ❌ **Direct URLs**: Hardcoding `storage.googleapis.com` links in components. Always use the `AssetRepository`.
