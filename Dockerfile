# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy only the application source code (skip Docker/Git files via .dockerignore)
COPY . .

# =========================
# Stage 2: Runtime (Final Image)
# =========================
FROM node:20-alpine

# Use a single RUN layer to install and clean up
RUN apk add --no-cache caddy ca-certificates && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/public ./public
COPY --from=builder /app/cron ./cron

# Caddy config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

# Persistence for SSL certs
VOLUME ["/data", "/config"]

CMD ["sh", "-c", "node server.js & exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
