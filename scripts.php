<?php

function gallery_register_scripts() {
    // styles
    wp_enqueue_style( 'gallery-css', plugins_url( 'Special-Gallery/css/master.css' ) ); 

    // scripts
    wp_register_script( 'web-animations', 'https://unpkg.com/web-animations-js@2.3.1/web-animations.min.js', array(), null, true );
    wp_register_script( 'hammer', 'https://unpkg.com/hammerjs@2.0.8/hammer.min.js', array( ), null, true );
    wp_register_script( 'muuri', 'https://unpkg.com/muuri@0.7.1/dist/muuri.min.js', array( 'web-animations', 'hammer' ), null, true );
    wp_register_script( 'vue', 'https://v2.vuejs.org/js/vue.min.js', array(), null, true );
    
    wp_register_script( 'gallery-utils', plugins_url( '/js/utils.js' , __FILE__ ), array( 'jquery' ), null, true );
    wp_register_script( 'galleries', plugins_url( '/js/galleries.js' , __FILE__ ), array( 'vue', 'jquery', 'gallery-utils' ), null, true );
    wp_register_script( 'gallery', plugins_url( '/js/gallery.js' , __FILE__ ), array( 'vue', 'muuri', 'jquery', 'gallery-utils' ), null, true );
    wp_register_script( 'gallery-item', plugins_url( '/js/item.js' , __FILE__ ), array( 'vue', 'muuri', 'jquery', 'gallery-utils' ), null, true );
    wp_register_script( 'gallery-frontend', plugins_url( '/js/frontend.js' , __FILE__ ), array( 'vue', 'jquery' ), null, true );
}

add_action( 'wp_enqueue_scripts', 'gallery_register_scripts' );
add_action( 'admin_enqueue_scripts', 'gallery_register_scripts' );

?>