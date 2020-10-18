# Node 12.19 LTS
FROM node:lts-alpine
LABEL maintainer="Julien CROCHET <julien@crochet.me>"

RUN mkdir -p /home/user && \
    chmod 777 /home/user && \
    HOME=/home/user

RUN apk add --no-cache bash && \
    echo 'alias ll="ls -la"' >> /home/user/.bashrc

RUN PATH=$PATH:/usr/src/front/node_modules/.bin/
WORKDIR /usr/src/front
