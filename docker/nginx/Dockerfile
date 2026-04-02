FROM node:22-slim AS builder

WORKDIR /usr/src/app
# Copy root workspace files
COPY package.json package-lock.json ./

# Copy all workspace package.jsons (npm needs them for workspace resolution)
COPY apps/portfolio/package.json ./apps/portfolio/
COPY libs/shared/package.json ./libs/shared/

# Install portfolio and shared lib workspace dependencies
RUN npm ci --ignore-scripts --workspace=apps/portfolio --workspace=libs/shared

# Copy shared lib source and build it first
COPY libs/shared/ ./libs/shared/
RUN npm run build --workspace=libs/shared

# Copy portfolio source code and build
COPY apps/portfolio/ ./apps/portfolio/
COPY docker/nginx/.env.production.local ./apps/portfolio/
RUN npm run build --workspace=apps/portfolio

FROM nginx:stable-alpine
LABEL maintainer="Julien Crochet <julien@crochet.me>"

RUN apk add --no-cache curl

# Configure nginx to run as non-root
RUN sed -i '/^pid/d' /etc/nginx/nginx.conf \
    && echo 'pid /tmp/nginx.pid;' >> /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
    && chmod -R 755 /var/cache/nginx /var/log/nginx

# Copy built portfolio static files
COPY --chown=nginx:nginx --from=builder /usr/src/app/apps/portfolio/dist /usr/src/front

COPY --chown=nginx:nginx docker/nginx/rate-limit.conf /etc/nginx/conf.d/00-rate-limit.conf
COPY --chown=nginx:nginx docker/nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf
COPY --chown=nginx:nginx docker/nginx/default.conf /etc/nginx/conf.d/default.conf

ARG API_PORT=3000
RUN sed -e "s/%API_PORT%/$API_PORT/" /etc/nginx/conf.d/default.conf | tee /etc/nginx/conf.d/default.conf

USER nginx
