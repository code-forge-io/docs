# syntax = docker/dockerfile:1.4

# Base dependencies stage
ARG NODE_VERSION=22.17.0
FROM node:${NODE_VERSION}-slim AS base

# Node.js app lives here
WORKDIR /app

# Install pnpm
ARG PNPM_VERSION=10.13.0
RUN npm install -g pnpm@$PNPM_VERSION

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 git

# Dependencies stage
FROM base AS dependencies
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM dependencies AS build
COPY . .
RUN pnpm run generate:docs
RUN pnpm run build
RUN pnpm prune --prod

# Final production stage
FROM base
WORKDIR /app
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/generated-docs /app/generated-docs

# Start the server
EXPOSE 8080
CMD [ "pnpm", "run", "start" ]
