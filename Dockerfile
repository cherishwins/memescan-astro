# syntax=docker/dockerfile:1

# Base images are pinned by digest so rebuilds are reproducible and a
# compromised or regressed upstream re-push of a floating tag cannot be pulled
# silently. The tag is kept before the @sha256 purely as a human-readable hint;
# the digest is what Docker enforces, and it resolves the multi-arch manifest
# index (so linux/amd64 and linux/arm64 both still select correctly).
#
# To update deliberately (let Dependabot/Renovate track these):
#   docker buildx imagetools inspect node:22-alpine   -> copy the top-level Digest
#   docker buildx imagetools inspect nginx:alpine     -> copy the top-level Digest
# Pins resolved 2026-09-26: node 22.23.3 / alpine 3.24.2, nginx 1.31.6 / alpine 3.24.2.

# ---- Stage 1: build the static Astro site ----
FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS build
WORKDIR /app

# Install dependencies against the lockfile first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Build the site. Astro has no adapter here, so output is a static dist/.
COPY . .
RUN npm run build

# ---- Stage 2: serve dist/ with a non-root nginx ----
FROM nginx:alpine@sha256:1ed1b0e1d7652937d6cbdaf4018c7b6fc009a7dd6c3047351e2eddda745de43f AS runner

# curl is only pulled in for the container HEALTHCHECK.
RUN apk add --no-cache curl \
    && mkdir -p /tmp/nginx \
    && chown -R nginx:nginx /tmp/nginx /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Drop privileges: the server binds 8080 and writes only under /tmp.
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
