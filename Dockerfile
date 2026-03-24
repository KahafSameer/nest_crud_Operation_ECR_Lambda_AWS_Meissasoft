# syntax=docker/dockerfile:1.6

# ------------------------------
# Stage 1: Build NestJS
# ------------------------------
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM node:20 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build NestJS project
RUN npm run build

# ------------------------------
# Stage 2: Lambda compatible image
# ------------------------------
FROM --platform=$TARGETPLATFORM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

# Copy build + package.json + node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy Lambda handler
COPY lambda.ts ./index.js

ENV NODE_ENV=production

# Optional: expose port for local testing
EXPOSE 3000

CMD ["index.handler"]