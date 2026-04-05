FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy all workspace package.jsons (npm needs them for workspace resolution)
COPY apps/api/package.json ./apps/api/
COPY apps/portfolio/package.json ./apps/portfolio/
COPY libs/shared/package.json ./libs/shared/

# Install API and shared lib workspace dependencies
RUN npm ci --ignore-scripts --workspace=apps/api --workspace=libs/shared

# Copy shared lib source and build it first
COPY libs/shared/ ./libs/shared/
RUN npm run build --workspace=libs/shared

# Copy API source code and build
COPY apps/api/ ./apps/api/
WORKDIR /usr/src/app/apps/api
RUN npm run build


FROM node:24-alpine AS runner
LABEL maintainer="Julien Crochet <julien@crochet.me>"

ARG API_PORT=3000

ENV PORT=$API_PORT
ENV NODE_ENV=production
ENV APP_ENV=production

RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy all workspace package.jsons
COPY apps/api/package.json ./apps/api/
COPY apps/portfolio/package.json ./apps/portfolio/
COPY libs/shared/package.json ./libs/shared/

# Install production dependencies only
RUN npm ci --ignore-scripts --workspace=apps/api --workspace=libs/shared --omit=dev \
    && npm cache clean --force

# Copy built shared lib (needed at runtime for Zod validation)
COPY --chown=node:node --from=builder /usr/src/app/libs/shared/dist ./libs/shared/dist

# Copy built output and env
COPY --chown=node:node --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --chown=node:node docker/api/.env.production.local ./apps/api/

WORKDIR /usr/src/app/apps/api

USER node

EXPOSE $API_PORT

CMD ["node", "dist/main"]
