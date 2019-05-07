<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-options">
        <div>
            <button class="button" v-on:click="back">Back</button>
            <button class="button" v-on:click="newImage">Add image</button>
            <div class="gallery-right">
                <button class="button gallery-danger" v-on:click="removeItem">Remove item</button>
            </div>
        </div>
        <div>
            <br>
            <input class="gallery-input" placeholder="Enter the blurb here" v-if="selected" v-model="selected.blurb">
        </div>
    </div>

    <!-- Item grid -->
    <div class="gallery-grid" v-if="selected">
        <div class="gallery-item" v-for="(image, index) in selected.images" :gallery-id="index">
            <div class="gallery-item-content">
                <img class="gallery-thumbnail" v-bind:src="imageUrls[image]" :gallery-id="index">
                <span class="gallery-remove gallery-danger" v-on:click="removeImage(image)">&times;</span>
            </div>
        </div>
    </div>

</div>
