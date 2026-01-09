#!/bin/bash

# Deployment Script for VPS
# Usage: ./deploy.sh

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
git pull origin main

# 2. Build and Start Containers
# Uses the production compose file
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Prune unused images to save space
docker image prune -f

echo "✅ Deployment Complete!"
echo "API running on port 3000"
echo "Web running on port 80"
