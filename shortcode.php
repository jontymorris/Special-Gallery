<?php

add_shortcode( 'special-gallery', 'gallery_embed' );

// Used to embed the gallery
function gallery_embed() {
    include( plugin_dir_path( __FILE__ ) . 'views/embed.php' );
}

?>