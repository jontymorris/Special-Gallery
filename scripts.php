<?php

function gallery_register_scripts() {
    // styles
    wp_enqueue_style( 'embed', plugins_url( 'special-gallery/css/embed.css' ) ); 
    wp_enqueue_style( 'gallery', plugins_url( 'special-gallery/css/gallery.css' ) ); 
    wp_enqueue_style( 'muuri', plugins_url( 'special-gallery/css/muuri.css' ) ); 

    // scripts
    wp_register_script( 'web-animations', 'https://unpkg.com/web-animations-js@2.3.1/web-animations.min.js', array(), null, true );
    wp_register_script( 'hammer', 'https://unpkg.com/hammerjs@2.0.8/hammer.min.js', array(), null, true );
    wp_register_script( 'muuri', 'https://unpkg.com/muuri@0.7.1/dist/muuri.min.js', array('web-animations', 'hammer'), null, true );
    wp_register_script( 'vue', 'https://cdn.jsdelivr.net/npm/vue', array(), null, true );
    
    wp_register_script( 'gallery-utils', plugins_url( '/js/utils.js' , __FILE__ ), array('jquery'), null, true );
    wp_register_script( 'gallery-dashboard', plugins_url( '/js/dashboard.js' , __FILE__ ), array('vue', 'jquery', 'gallery-utils'), null, true );
    wp_register_script( 'gallery-home', plugins_url( '/js/gallery.js' , __FILE__ ), array('vue', 'muuri', 'jquery', 'gallery-utils'), null, true );
    wp_register_script( 'gallery-item', plugins_url( '/js/item.js' , __FILE__ ), array('vue', 'muuri', 'jquery', 'gallery-utils'), null, true );
    wp_register_script( 'gallery-frontend', plugins_url( '/js/frontend.js' , __FILE__ ), array('vue', 'jquery'), null, true );
}

add_action( 'wp_enqueue_scripts', 'gallery_register_scripts' );
add_action( 'admin_enqueue_scripts', 'gallery_register_scripts' );

?>