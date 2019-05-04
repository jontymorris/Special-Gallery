<?php
    function get_thumbnail($id) {
        return wp_get_attachment_image_src( $id, 'thumbnail' )[0];
    }

    $data =  file_get_contents( plugin_dir_path( __FILE__ ) . '../data/items.json' );
    $items = json_decode( $data );

    $thumbnails = array();
    foreach ($items as $item) {
        foreach ($item->images as $image) {
            if ( array_key_exists( $image, $thumbnails) ) {
                continue;
            }

            $thumbnails[$image] = get_thumbnail( $image );
        }
    }
?>

<div id="galleryApp">

    <div class="special-gallery">
        <div class="thumbnail" v-for="item in items">
            <img :src="thumbnails[item.images[0]]">
        </div>
    </div>

</div>

<!-- CSS -->
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url( 'special-gallery/css/embed.css' ) ?>">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/frontend.js' ) ?>"></script>

<script>
    galleryApp.thumbnails = JSON.parse('<?php echo json_encode( $thumbnails ) ?>');
    galleryApp.items = JSON.parse('<?php echo $data; ?>');
</script>