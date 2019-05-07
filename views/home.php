<div id="galleryApp">

    <!-- Controls -->
    <div id="gallery-options">
        <button class="button" v-on:click="newItem">New item</button>
    </div>

    <!-- Main grid -->
    <div class="grid">
        <div class="item" v-for="(item, index) in items" :gallery-id="index">
            <div class="item-content">
                <img class="gallery-thumbnail click" v-bind:src="getItemThumbnail(item)" :gallery-id="index">
            </div>
        </div>
    </div>

</div>
