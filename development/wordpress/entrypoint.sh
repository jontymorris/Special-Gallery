#!/bin/bash

# WordPress does not have write access to the wp-content folder
# This is a workaround to fix that
echo Fixing permissions...
chown -R www-data:www-data /var/www/html/wp-content/

echo Starting Apache...
docker-entrypoint.sh apache2-foreground