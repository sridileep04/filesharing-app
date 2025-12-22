# Use Node LTS (stable + secure)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy rest of the application
COPY . .

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

