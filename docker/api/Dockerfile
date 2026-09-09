FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/portfolio/package.json ./apps/portfolio/
COPY libs/shared/package.json ./libs/shared/

# Single install for both stages. No install scripts: no native module in the
# API tree, and the root `prepare: husky` must not run.
RUN npm ci --ignore-scripts --workspace=apps/api --workspace=libs/shared

COPY libs/shared/ ./libs/shared/
RUN npm run build --workspace=libs/shared

COPY apps/api/ ./apps/api/
RUN npm run build --workspace=apps/api

# Drop dev dependencies in place (scoped to the two workspaces, otherwise
# npm re-resolves the tree for apps/portfolio too): the runner gets exactly
# the versions resolved here, without a second network round-trip.
RUN npm prune --omit=dev --ignore-scripts --workspace=apps/api --workspace=libs/shared \
    && npm cache clean --force \
    && mkdir -p apps/api/node_modules


FROM node:24-alpine AS runner
LABEL maintainer="Julien Crochet <julien@crochet.me>"

ARG API_PORT=3000

ENV PORT=$API_PORT
ENV NODE_ENV=production
ENV APP_ENV=production

RUN apk add --no-cache curl

WORKDIR /usr/src/app

# node_modules holds the workspace symlinks (my-profile-shared → ../libs/shared,
# my-profile-api → ../apps/api): the same layout is reproduced here.
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/libs/shared/package.json ./libs/shared/
COPY --from=builder /usr/src/app/libs/shared/dist ./libs/shared/dist
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/
COPY --from=builder /usr/src/app/apps/api/node_modules ./apps/api/node_modules
COPY --chown=node:node --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --chown=node:node docker/api/.env.production.local ./apps/api/

WORKDIR /usr/src/app/apps/api

USER node

EXPOSE $API_PORT

CMD ["node", "dist/main.js"]
