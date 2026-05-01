# Plan: Deploy to Cloud Run

## 1. Preparation
- The app uses Vite, so we need to run `npm run build` to generate the `dist` folder.
- Cloud Run requires a web server to serve these static files. Nginx is lightweight and perfect for this.

## 2. Docker & Nginx Configuration
- We will create a `Dockerfile` that uses `nginx:alpine`.
- We will create an `nginx.conf` template that uses `envsubst` or similar to inject the `$PORT` variable provided by Cloud Run (default 8080) at runtime, as Cloud Run dynamically assigns the port the container must listen on.
- *Wait*, a simpler approach for Cloud Run and Nginx is to use a simple startup script or just replace the port in the default conf via CMD: `CMD sed -i -e 's/80/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'`.

## 3. Deployment Command
- `gcloud run deploy bg3-splendor --source . --platform managed --region us-central1 --allow-unauthenticated`
- This command uses Cloud Build behind the scenes to build the Docker image and deploy it.

## 4. Verification
- `test_deployment.mjs` will run `gcloud run services describe bg3-splendor --region us-central1 --format 'value(status.url)'` to fetch the URL.
- It will use `node-fetch` or `Playwright` to navigate to the URL and verify that the BG3 Splendor app is running (e.g., checking for the title).