<?php

add_action( 'admin_menu', 'gallery_menu' );

// add menu option
function gallery_menu() {
    add_dashboard_page( 'Gallery Dashboard', 'Special Gallery', 'read', 'special_gallery', 'gallery_dashboard' );
}

// serve the dashboard page
function gallery_dashboard() {
    wp_enqueue_media();

    if ( !isset( $_GET['item'] ) ) {
        include( plugin_dir_path( __FILE__ ) . 'views/home.php' );    
    }

    else {
        include( plugin_dir_path( __FILE__ ) . 'views/item.php' );
    }
}

?>