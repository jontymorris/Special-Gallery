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

<div id="galleryApp">

    <div class="special-gallery">
        <div class="thumbnail" v-for="item in items">
            <img :src="thumbnails[item.images[0]]" v-on:click="itemClick(item)">
        </div>
    </div>

    <div id="myModal" class="modal" v-if="selected">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close" v-on:click="close">&times;</span>
            <div class="image-container">
                <img :src="fullsize[selected.images[0]]">
            </div>
            <span class="blurb">
                {{ selected.blurb }}
            </span>
        </div>
    </div>

</div>

<!-- CSS -->
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url( 'special-gallery/css/embed.css' ) ?>">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/frontend.js' ) ?>"></script>

<script>
    // load the gallery
    galleryApp.thumbnails = JSON.parse('<?php echo json_encode( $thumbnails ) ?>');
    galleryApp.fullsize = JSON.parse('<?php echo json_encode( $fullsize ) ?>');
    galleryApp.items = JSON.parse('<?php echo $data; ?>');
</script>