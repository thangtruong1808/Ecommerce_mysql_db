FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared /shared

# Vite reads frontend/.env during the build. Empty build args are removed so
# they do not override that file. Pass a build arg only to override one value.
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_SHOWCASE_HOURS_ENABLED
ARG VITE_SHOWCASE_TIMEZONE
ARG VITE_SHOWCASE_HOURS_START
ARG VITE_SHOWCASE_HOURS_END
ARG VITE_SHOWCASE_BUSINESS_DAYS
RUN for name in \
      VITE_API_URL \
      VITE_STRIPE_PUBLISHABLE_KEY \
      VITE_SHOWCASE_HOURS_ENABLED \
      VITE_SHOWCASE_TIMEZONE \
      VITE_SHOWCASE_HOURS_START \
      VITE_SHOWCASE_HOURS_END \
      VITE_SHOWCASE_BUSINESS_DAYS; do \
      eval "value=\${$name-}"; \
      if [ -z "$value" ]; then unset "$name"; fi; \
    done && npm run build

FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
