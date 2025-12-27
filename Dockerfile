FROM node:20-alpine

# Install Caddy via apk (safest for cross-platform)
RUN apk add --no-cache caddy curl ca-certificates bash

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy app code
COPY . .

# Copy Caddy config
COPY Caddyfile /etc/caddy/Caddyfile

# Persistence
VOLUME ["/data", "/config"]

EXPOSE 80 443

# Using a single CMD script is cleaner
CMD ["sh", "-c", "node server.js & caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
