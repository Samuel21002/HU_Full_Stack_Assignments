# Base dependencies stage
FROM node:20-alpine AS build-deps

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

RUN npm ci --include=dev

# Test stage
FROM build-deps AS test

WORKDIR /usr/src/app

COPY --chown=nodejs:nodejs . .
USER nodejs

RUN npm run test || { echo "Tests failed! Build cancelled."; exit 1; }

# Build stage
FROM build-deps AS build

WORKDIR /usr/src/app

COPY --from=test --chown=nodejs:nodejs /usr/src/app ./
USER nodejs

ENV VITE_BACKEND_URL=http://localhost:8080/api/

RUN npm run build

# Production server stage
FROM nginx:1.28.1-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html