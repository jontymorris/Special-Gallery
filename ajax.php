<?php

add_action( 'wp_ajax_get_image', 'gallery_get_image' );
add_action( 'wp_ajax_get_items', 'gallery_get_items' );
add_action( 'wp_ajax_save_items', 'gallery_save_items' );

// return an image src from id
function gallery_get_image() {
    $id = absint( $_POST['id'] );
    $source = wp_get_attachment_image_src( $id, 'thumbnail' );

    if ( $source ) {
        wp_send_json_success( $source );
    } else {
        wp_send_json_error();
    }
}

// returns the gallery items
function gallery_get_items() {
    $path = plugin_dir_path( __FILE__ ) . 'data/items.json';

    if ( file_exists( $path ) ) {
        $data = file_get_contents( plugin_dir_path( __FILE__ ) . 'data/items.json' );
        wp_send_json_success( $data );
    }

    else {
        wp_send_json_success( '[]' );
    }
}

// saves the gallery items
function gallery_save_items() {
    $data = json_encode( [] );

    if ( array_key_exists( 'items', $_POST ) ) {
        $data = json_encode( $_POST['items'] );
    }

    file_put_contents( plugin_dir_path( __FILE__ ) . 'data/items.json', $data );
    wp_send_json_success( 'Saved the items' );
}

?>