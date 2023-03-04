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
cp docker compose.override.yml.dist docker compose.override.yml
yarn --cwd apps/front
docker compose build
docker compose run -u root --rm app chmod -R 777 var/cache 
docker compose run --rm app composer build:dev 
```

### PROD
```shell
TAG=X.Y.Z docker compose -f docker compose.prod.yml build --force-rm
```

## Start Docker Containers
### DEV
```shell
docker compose up -d
```

### PROD
```shell
TAG=X.Y.Z docker compose -f docker compose.prod.yml up -d
```
In order to restart PHP FPM in production env
```shell
docker compose exec -u root app kill -USR2 12
```

## Development
### Front
#### Dependencies
Each time packages.json is updated, followings command must be run to keep dependencies folder up to date on host and inside container.
```shell
nvm use
yarn --cwd apps/front
docker compose down
docker compose up -d
```
#### Tests
Run all tests
```shell
docker compose exec node yarn test
```

Run all tests with coverage report
```shell
docker compose exec node yarn test:cov
```
### Back

#### Tests
Prepare environnement
```shell
cp .env.dev.local .env.test.local
```

Run all tests
```shell
docker compose exec php composer test
```
Run all tests with coverage report
```shell
docker compose exec php composer test:cov
```

#### Run PHP CS Fixer
```shell
docker compose exec php composer php:cs
```

#### Run PHP Mess Detector
```shell
docker compose exec php composer php:md
```

#### Run PHP Stan
```shell
docker compose exec php composer php:phpstan
```

#### Run Symfony Security Check
```shell
docker compose exec php composer security:check
```

#### Run all PHP quality tools
This will run 
- PHP CS Fixer
- PHP Mess Detector
- PHP Stan
- Symfony Security Check

```shell
docker compose exec php composer php:quality
```