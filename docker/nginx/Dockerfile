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

FROM nginx:1.23-alpine
LABEL maintainer="Julien Crochet <julien@crochet.me>"

# Copy built portfolio static files
COPY --from=builder /usr/src/app/apps/portfolio/dist /usr/src/front

COPY docker/nginx/rate-limit.conf /etc/nginx/conf.d/00-rate-limit.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

ARG API_PORT=3000
RUN sed -e "s/%API_PORT%/$API_PORT/" /etc/nginx/conf.d/default.conf | tee /etc/nginx/conf.d/default.conf
