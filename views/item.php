<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-options">
        <div>
            <button class="button" v-on:click="back">Back</button>
            <button class="button" v-on:click="newImage">Add image</button>
            <div class="right">
                <button class="button danger" v-on:click="removeItem">Remove</button>
            </div>
        </div>
        <div>
            <br>
            <input class="gallery-input" placeholder="Enter the blurb here" v-if="selected" v-model="selected.blurb">
        </div>
    </div>

    <!-- Item grid -->
    <div class="grid" v-if="selected">
        <div class="item" v-for="(image, index) in selected.images" :gallery-id="index">
            <div class="item-content">
                <img class="gallery-thumbnail" v-bind:src="imageUrls[image]" :gallery-id="index">
                <span class="gallery-remove" v-on:click="removeImage(image)">&times;</span>
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
<script src="<?php echo plugins_url( 'special-gallery/js/item.js' ) ?>"></script>
