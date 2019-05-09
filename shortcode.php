<?php

// Used to embed the gallery
function gallery_embed() {
    // is the Elementor editor open?
    if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
        return;
    }

    wp_enqueue_script( 'gallery-frontend' );

    // retrive the items
    $data =  file_get_contents( plugin_dir_path( __FILE__ ) . 'data/items.json' );
    $items = json_decode( $data );

    // retrive the thumbnails
    $thumbnails = array();
    $fullsize = array();
    foreach ($items as $item) {
        foreach ($item->images as $image) {
            if ( !array_key_exists( $image, $thumbnails) ) {
                $thumbnails[$image] = wp_get_attachment_image_src( $image, 'thumbnail' )[0];
            }

            if ( !array_key_exists( $image, $fullsize) ) {
                $fullsize[$image] = wp_get_attachment_image_src( $image, 'full' )[0];
            }
        }
    }

    // embed loading script
    ?> <script>
        jQuery(window).ready(function() {
            // load the gallery
            galleryApp.thumbnails = JSON.parse('<?php echo json_encode( $thumbnails ) ?>');
            galleryApp.fullsize = JSON.parse('<?php echo json_encode( $fullsize ) ?>');
            galleryApp.items = JSON.parse('<?php echo $data; ?>');
        });
    </script> <?php

    return file_get_contents( plugin_dir_path( __FILE__ ) . 'views/shortcode.html' );
}

add_shortcode( 'special-gallery', 'gallery_embed' );

?>