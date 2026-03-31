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
# Stage 2: Lambda runtime for AWS/ECR
# ------------------------------
FROM --platform=$TARGETPLATFORM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

# Copy built app + dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Lambda entrypoint (CommonJS)
COPY lambda.js ./index.js

ENV NODE_ENV=production

# For local testing only (Lambda Runtime Interface Emulator)
EXPOSE 3000

CMD ["index.handler"]