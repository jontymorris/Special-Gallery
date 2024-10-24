#!/bin/bash -e

# This should be the path that WordPress mounts the Special Gallery.
PLUGIN_PATH="/var/www/html/wp-content/plugins/special-gallery"

# Wait until MySQL is up and running by using wp-cli db check
until wp db check --path=/var/www/html --allow-root; do
    echo 'waiting for mysql to be connectable...'
    sleep 3
done

# Install WordPress if it's not already installed
if ! wp core is-installed --path=/var/www/html; then
    wp core install --url='http://localhost' \
        --title='My Wordpress Site' \
        --admin_user='admin' \
        --admin_password='admin' \
        --admin_email='admin@example.com' \
        --path=/var/www/html
fi

# Install and activate the Elementor plugin
wp plugin install https://downloads.wordpress.org/plugin/elementor.3.6.0.zip --activate --path=/var/www/html
