FROM nginx:1.18-alpine
LABEL maintainer="Julien CROCHET <julien@crochet.me>"

ARG APP_VERSION=latest
RUN apk add --no-cache bash && \
    echo 'alias ll="ls -la"' >> ~/.bashrc
WORKDIR /usr/src

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN sed -e "s/%APP_VERSION%/$APP_VERSION/" /etc/nginx/conf.d/default.conf | tee /etc/nginx/conf.d/default.conf.new && \
    mv /etc/nginx/conf.d/default.conf.new /etc/nginx/conf.d/default.conf

COPY apps/api/public /usr/src/api