<?php

// Used to embed the gallery
function gallery_embed($atts) {
    // is the Elementor editor open?
    if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
        return;
    }

    // parse the shortcode atts
    $atts = shortcode_atts( array(
        'id' => 0
    ), $atts, 'special-gallery' );

    // retrive the gallery
    $data = file_get_contents( plugin_dir_path( __FILE__ ) . 'data/galleries.json' );
    $galleries = json_decode( $data );
    $gallery = $galleries[$atts['id']];

    // check the gallery has items
    if ( !array_key_exists( 'items', (array) $gallery) ) {
        return '';
    }

    // retrive the thumbnails
    $image_urls = array();
    foreach ($gallery->items as &$item) {

        // does the item have any images?
        if ( !array_key_exists( 'images', (array) $item ) ) {
            continue;
        }

        // loop through the item images
        foreach ($item->images as $image) {
            // check if they have already been loaded
            if ( !array_key_exists( $image, $image_urls) ) {
                $image_urls[$image] = wp_get_attachment_image_src( $image, 'full' )[0];
            }
        }
    }

    // enqueue the js
    wp_enqueue_script( 'gallery-frontend' );

    ?>
        <script>
            function unescapeHtml(safe) {
                return safe
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"")
                    .replace(/&#039;/g, "'");
            }

            window.onload = function () {
                var items = <?php echo json_encode( $gallery->items ); ?>

                items.forEach(item => {
                    if (item.name) item.name = unescapeHtml(item.name);
                    if (item.blurb) item.blurb = unescapeHtml(item.blurb);
                })

                galleryApp.imageUrls = <?php echo json_encode( $image_urls ) ?>;
                galleryApp.items = items;
            };
        </script>
    <?php

    // return the shortcode content
    return file_get_contents( plugin_dir_path( __FILE__ ) . 'views/shortcode.html' );
}

add_shortcode( 'special-gallery', 'gallery_embed' );

?>