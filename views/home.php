<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-gallery-options">
        <button class="button" v-on:click="newItem">New item</button>
    </div>

    <!-- Main grid -->
    <div class="gallery-grid">
        <div class="gallery-item" v-for="(item, index) in items" :gallery-id="index">
            <div class="gallery-item-content">
                <img class="gallery-thumbnail click" v-bind:src="getItemThumbnail(item)" :gallery-id="index">
            </div>
        </div>
    </div>

</div>
