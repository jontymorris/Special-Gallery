<?php
    $data =  file_get_contents( plugin_dir_path( __FILE__ ) . '../data/items.json' );
    $items = json_decode( $data );

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
?>

<script>
    jQuery(window).ready(function() {
        // load the gallery
        galleryApp.thumbnails = JSON.parse('<?php echo json_encode( $thumbnails ) ?>');
        galleryApp.fullsize = JSON.parse('<?php echo json_encode( $fullsize ) ?>');
        galleryApp.items = JSON.parse('<?php echo $data; ?>');
    });
</script>

<div id="galleryApp">

    <div class="special-gallery">
        <div class="special-gallery-item" v-for="item in items">
            <img :src="thumbnails[item.images[0]]" v-on:click="itemClick(item)">
        </div>
    </div>

    <div id="myModal" class="gallery-modal" v-if="selected">
        <!-- Modal content -->
        <div class="gallery-modal-content">
            <span class="gallery-close" v-on:click="close">&times;</span>

            <div class="gallery-image-container">
                <img :src="fullsize[selected.images[slideIndex]]">
            </div>
            
            <span class="gallery-slide-button gallery-left-control" v-on:click="lastSlide">&lt;</span>
            <span class="gallery-slide-button gallery-right-control" v-on:click="nextSlide">&gt;</span>

            <span class="gallery-blurb">
                {{ selected.blurb }}
            </span>
        </div>
    </div>

</div>