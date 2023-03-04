FROM nginx:1.23-alpine
LABEL maintainer="Julien CROCHET <julien@crochet.me>"

RUN apk add --no-cache bash && \
    echo 'alias ll="ls -la"' >> ~/.bashrc
WORKDIR /usr/src

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

ARG APP_VERSION=latest
RUN sed -e "s/%APP_VERSION%/$APP_VERSION/" /etc/nginx/conf.d/default.conf | tee /etc/nginx/conf.d/default.conf.new && \
    mv /etc/nginx/conf.d/default.conf.new /etc/nginx/conf.d/default.conf

COPY apps/api/public /usr/src/api

ENV APP_VERSION $APP_VERSION
