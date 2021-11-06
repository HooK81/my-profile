# Profile
My Profile

# Installation

## Clone project
```shell
git clone git@github.com:HooK81/my-profile.git
```

## Configuration
### Environement
#### DEV
```shell
cp .env.dist .env
cp apps/front/.env.dist apps/front/.env
```

#### PROD
```shell
cp .env.dist .env
cp docker/node/secrets/.env.production.dist docker/node/secrets/.env.production
```

Private key for symfony secrets:
```shell
cp XXXX/prod.decrypt.private.php docker/php/secrets/prod.decrypt.private.php
cp XXXX/prod.jwt.private.pem     docker/php/secrets/prod.jwt.private.pem
```

## Build docker container
### DEV
```shell
cp docker-compose.override.yml.dist docker-compose.override.yml
yarn --cwd apps/front
docker-compose build
docker-compose run --rm php composer build-dev 
```

### PROD
```shell
TAG=X.Y.Z docker-compose -f docker-compose.prod.yml build --force-rm
```

## Start Docker Containers
### DEV
```shell
docker-compose up -d
```
### PROD
```shell
TAG=X.Y.Z docker-compose -f docker-compose.prod.yml up -d
```
In order to restart PHP FPM in production env
```shell
docker exec mp_php_prod kill -USR2 12
```

## Development
### Run PHP CS Fixer
```shell
docker-compose exec -T php composer phpcs
```
### Run PHP Mess Detector
```shell
docker-compose exec -T php composer phpmd
```

### Run PHP Stan
```shell
docker-compose exec -T php composer phpstan
```

### Run all PHP quality tools
This will run 
- PHP CS Fixer
- PHP Mess Detector
- PHP Stan

```shell
docker-compose exec -T php composer phpchecks
```