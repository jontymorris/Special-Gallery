<div id="galleryApp">

    <div id="gallery-options">
        <div v-if="!selected">
            <button class="button" v-on:click="newItem">New item</button>
        </div>
        <div v-if="selected">
            <button class="button" v-on:click="back">Back</button>
            <button class="button" v-on:click="newImage">Add image</button>
        </div>
    </div>

    <ul class="gallery-grid" v-if="!selected">
        <div class="gallery-item" v-for="item in items" v-on:click="selectClick(item)">
            {{ item.blurb }}
        </div>
    </ul>
    
    <ul class="gallery-grid" v-if="selected">
        <div class="gallery-item" v-for="image in selected.images" v-on:click="imageClick(item)">
            {{ image }}
        </div>
    </ul>

</div>

<!-- CSS --->
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url( 'special-gallery/css/gallery_v2.css' ) ?>">

<!-- Scripts --->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/gallery_v2.js' ) ?>"></script>
