# ---------- Stage 1: Build Node app ----------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY . .

# ---------- Stage 2: Runtime with Nginx ----------
FROM nginx:alpine

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy app
COPY --from=builder /app /app

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

EXPOSE 80 443

#CMD sh -c "node server.js & nginx -g 'daemon off;'"
CMD ["/bin/sh", "-c", "node server.js & nginx -g 'daemon off;'"]

