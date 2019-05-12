<?php

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

add_action( 'wp_ajax_get_image', 'gallery_get_image' );

// returns the galleries
function gallery_get_galleries() {
    $path = plugin_dir_path( __FILE__ ) . 'data/galleries.json';

    if ( file_exists( $path ) ) {
        $data = file_get_contents( $path );
        wp_send_json_success( $data );
    }

    else {
        wp_send_json_success( '[]' );
    }
}

add_action( 'wp_ajax_get_galleries', 'gallery_get_galleries' );

// saves the gallery items
function gallery_save_galleries() {
    $data = json_encode( [] );

    if ( array_key_exists( 'galleries', $_POST ) ) {
        $data = json_encode( $_POST['galleries'], JSON_PRETTY_PRINT );
    }

    file_put_contents( plugin_dir_path( __FILE__ ) . 'data/galleries.json', $data );
    wp_send_json_success( 'Saved the galleries' );
}

add_action( 'wp_ajax_save_galleries', 'gallery_save_galleries' );

?>