#!/bin/sh
set -e

mkdir -p /usr/src/api/var 
setfacl -dR -m u:www-data:rwX -m u:$(whoami):rwX /usr/src/api/var
setfacl -R -m u:www-data:rwX -m u:$(whoami):rwX /usr/src/api/var

docker-php-entrypoint php-fpm