# ClearME Expo App Dockerfile
FROM node:20-alpine

# Install OS deps
RUN apk add --no-cache bash git python3 make g++

# Set workdir
WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json* ./

# Install deps
RUN npm ci || npm install

# Copy source
COPY . .

# Build args for env (optional)
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MEASUREMENT_ID

# Expose common Expo ports
EXPOSE 8081 19000 19001 19002

# Default to web mode; override with `--entrypoint` for dev server
CMD ["npm", "run", "web"]
