# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/web ./apps/web

# Build
WORKDIR /app/apps/web
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets to Nginx html folder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config for SPA fallback
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
