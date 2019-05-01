<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-options">
        <div v-if="!selected">
            <button class="button" v-on:click="newItem">New item</button>
        </div>
        <div v-if="selected">
            <button class="button" v-on:click="back">Back</button>
            <button class="button" v-on:click="newImage">Add image</button>
            <div class="right">
                <button class="button danger" v-on:click="removeItem">Remove</button>
            </div>
        </div>
        <div v-if="selected">
            <br>
            <input class="gallery-input" placeholder="Enter the blurb here" v-model="selected.blurb">
        </div>
    </div>

    <!-- Gallery grid -->
    <ul class="gallery-grid" v-if="!selected">
        <div class="gallery-item" v-for="item in items" v-on:click="selectClick(item)">
            <img v-if="item.images" class="gallery-thumbnail" v-bind:src="imageUrls[item.images[0]]">
        </div>
    </ul>
    
    <!-- Item grid -->
    <ul class="gallery-grid" v-if="selected">
        <div class="gallery-item" v-for="image in selected.images" v-on:click="imageClick(image)">
            <img class="gallery-thumbnail" v-bind:src="imageUrls[image]">
            <span class="gallery-remove" v-on:click="removeImage(image)">&times;</span>
        </div>
    </ul>

</div>

<!-- CSS --->
<link rel="stylesheet" type="text/css" href="<?php echo plugins_url( 'special-gallery/css/gallery_v2.css' ) ?>">

<!-- Scripts --->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="<?php echo plugins_url( 'special-gallery/js/gallery_v2.js' ) ?>"></script>
