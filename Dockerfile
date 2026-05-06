# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the application with Node.js Express (which also runs Socket.io)
FROM node:22-alpine

WORKDIR /app

# Only install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets and the backend server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Environment variables
ENV NODE_ENV=production

# Start the Node.js server
CMD ["node", "server/index.js"]