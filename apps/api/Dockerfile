# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY apps/api ./apps/api
COPY apps/api/prisma ./apps/api/prisma

# Build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --production

# Copy built artifacts from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["npm", "start"]
