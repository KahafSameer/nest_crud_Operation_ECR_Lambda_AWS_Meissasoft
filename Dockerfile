# syntax=docker/dockerfile:1.6

# buildx sets TARGETPLATFORM automatically; default keeps plain `docker build` working too
ARG TARGETPLATFORM=linux/amd64

# Stage 1: Build NestJS (platform-aware for buildx)
FROM --platform=$TARGETPLATFORM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Lambda compatible
FROM --platform=$TARGETPLATFORM public.ecr.aws/lambda/nodejs:20

# Copy dist + lambda handler
COPY --from=build /app/dist /var/task/dist
COPY lambda.ts /var/task/index.js
COPY --from=build /app/package*.json /var/task

ENV NODE_ENV=production
RUN npm ci --omit=dev

# Lambda entrypoint
CMD ["index.handler"]