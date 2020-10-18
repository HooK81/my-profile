# profile
My Profile

# Installation

## Clone project
```shell
git clone git@github.com:HooK81/my-profile.git
```

## Configuration
### Environement
```shell
cp .env.dist .env
cp apps/front/.env.dist apps/front/.env
cp XXXX/.env.production docker/node/secrets/.env.production
```

### secrets
Private key for symfony secrets
```shell
cp XXXX/prod.decrypt.private.php docker/php/secrets/prod.decrypt.private.php
cp XXXX/prod.jwt.private.pem     docker/php/secrets/prod.jwt.private.pem
```
## Build docker container
### DEV
```shell
cp docker-compose.override.yml.dist docker-compose.override.yml
docker-compose build
```
### PROD
```shell
docker-compose -f docker-compose.prod.yml build --compress --force-rm
```

## Start Docker Containers
### DEV
```shell
docker-compose up -d

```
### PROD
```shell
docker-compose -f docker-compose.prod.yml up -d
```

## Build Symfony
### DEV
```shell
docker exec -it mp_php composer build-dev
docker exec -it mp_php php bin/console fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json

```