<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-options">
        <button class="button" v-on:click="newItem">New item</button>
    </div>

    <!-- Main grid -->
    <div class="grid">
        <div class="item" v-for="(item, index) in items" :gallery-id="index">
            <div class="item-content">
                <img class="gallery-thumbnail" v-bind:src="getItemThumbnail(item)" :gallery-id="index">
            </div>
        </div>
    </div>

</div>

<!-- CSS --->
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url( 'special-gallery/css/gallery.css' ) ?>">

<!-- Scripts --->
<script src="https://unpkg.com/web-animations-js@2.3.1/web-animations.min.js"></script>
<script src="https://unpkg.com/hammerjs@2.0.8/hammer.min.js"></script>
<script src="https://unpkg.com/muuri@0.7.1/dist/muuri.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/vue"></script>

<script src="<?php echo plugins_url( 'special-gallery/js/utils.js' ) ?>"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/touchy.js' ) ?>"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/gallery.js' ) ?>"></script>
