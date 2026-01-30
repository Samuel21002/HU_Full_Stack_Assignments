# Build stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production server stage
FROM nginx:1.28.1-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
