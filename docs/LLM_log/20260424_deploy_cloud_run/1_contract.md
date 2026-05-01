# Contract: Deploy to Google Cloud Run

## Context (Entry)
The user requested that the BG3 Splendor application be deployed to Google Cloud Run so it can be accessed publicly over the internet. The app is a static React application built with Vite.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_deploy_cloud_run/test_deployment.mjs`)**: A script that queries the active Google Cloud project for a Cloud Run service named `bg3-splendor`. It fetches the public URL of the service and makes an HTTP request to verify it returns a 200 status code and serves the React application.
2. **Implementation**:
    - Create a `Dockerfile` using Nginx to serve the `dist/` directory.
    - Create an `nginx.conf` that respects the dynamic `$PORT` environment variable required by Cloud Run.
    - Execute `npm run build` to generate the static files.
    - Execute `gcloud run deploy bg3-splendor --source . --region us-central1 --allow-unauthenticated` to build and deploy the container.
3. **Assertion**: The probe must successfully hit the live URL and exit with 0.