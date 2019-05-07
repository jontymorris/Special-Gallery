<?php

// Used to embed the gallery
function gallery_embed() {
    // is the Elementor editor open?
    if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
        return;
    }

    wp_enqueue_script( 'gallery-frontend' );
    include( plugin_dir_path( __FILE__ ) . 'views/embed.php' );
}

add_shortcode( 'special-gallery', 'gallery_embed' );

?>