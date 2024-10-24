<?php

// add menu option
function gallery_menu()
{
    add_dashboard_page('Gallery Dashboard', 'Special Gallery', 'read', 'special_gallery', 'gallery_dashboard');
}

add_action('admin_menu', 'gallery_menu');

// serve the dashboard page
function gallery_dashboard()
{
    wp_enqueue_media();

    if (!isset($_GET['gallery'])) {
        wp_enqueue_script('galleries');
        include(plugin_dir_path(__FILE__) . 'views/galleries.html');
    } else if (!isset($_GET['item'])) {
        wp_enqueue_script('gallery');
        include(plugin_dir_path(__FILE__) . 'views/gallery.html');
    } else {
        wp_enqueue_script('gallery-item');
        include(plugin_dir_path(__FILE__) . 'views/item.html');
    }
}

?>