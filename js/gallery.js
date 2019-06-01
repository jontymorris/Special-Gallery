const galleryApp = new Vue({
    el: '#galleryApp',
    data: {
        imageUrls: {},

        id: 0,
        gallery: null,
        
        grid: null,

        isChanged: false
    },
    created() {
        // load cached data
        if (isItemInStorage('imageUrls')) {
            this.imageUrls = JSON.parse(window.localStorage.getItem('imageUrls'));
        }

        let url = new URL(window.location.href);
        this.id = url.searchParams.get('gallery');

        this.shortcode = `[special-gallery id=${this.id}]`;

        // retrive the gallery items
        fetchGallery(this.id).then(function(gallery) {
            galleryApp.gallery = gallery;
            galleryApp.refreshGrid();
            
            // retrive the thumbnails
            if (gallery.items) {
                gallery.items.forEach(function(item, index) {
                    if (item.images) {
                        item.images.forEach(function(id) {
                            if (!(id in galleryApp.imageUrls)) {
                                getImageSource(id).then(function(source) {
                                    galleryApp.imageUrls[id] = source;
                                    window.localStorage.setItem('imageUrls', JSON.stringify(galleryApp.imageUrls));
    
                                    galleryApp.refreshGrid();
                                });
                            }
                        });
                    }
                });
            }
        }, function(error) {
            console.error(error);
        });
    },
    methods: {
        refreshGrid: function() {
            this.$forceUpdate();

            this.$nextTick(function() {
                galleryApp.grid = new Muuri('.gallery-grid', {
                    'dragEnabled': true
                });

                new Touchy('.gallery-grid', this.itemClick, this.itemDrag);
            });
        },

        saveChanges: function() {
            if (!this.gallery.items) {
                this.gallery.items = [];
            }

            this.gallery.items = this.getOrderedItems();

            saveGallery(this.gallery, this.id).then(function(success) {
                window.location.reload();
            });
        },

        getOrderedItems: function() {
            if (!this.grid) {
                return [];
            }

            let orderedItems = [];

            this.grid.getItems().forEach(function(element) {
                let elementId = parseInt(element.getElement().getAttribute('gallery-id'));
                let item = galleryApp.gallery.items[elementId];

                if (typeof item !== 'undefined') {
                    orderedItems.push(item);
                }
            });
            
            return orderedItems;
        },

        newItem: function() {
            this.isChanged = true;

            this.gallery.items = this.getOrderedItems();
            this.gallery.items.push(
                {
                    'name': '',
                    'blurb': '',
                    'images': []
                }
            );

            this.refreshGrid();
        },

        getItemThumbnail: function(item) {
            if (item.images && item.images.length > 0) {
                let id = item.images[0];

                if (id in this.imageUrls) {
                    return this.imageUrls[id];
                }
            }

            return '';
        },

        itemClick: function(id) {
            let clicked = this.gallery.items[id];
            this.gallery.items = this.getOrderedItems();

            saveGallery(this.gallery, this.id).then(function(success) {
                let url = new URL(window.location.href);
                url.searchParams.set('item', galleryApp.gallery.items.indexOf(clicked));
                window.location.href = url.href;
            });
        },

        itemDrag: function() {
            this.isChanged = true;
        },

        back: function() {
            let url = new URL(window.location.href);
            url.searchParams.delete('gallery');
            window.location.href = url.href;
        },

        removeGallery: function() {
            fetchGalleries().then(function(galleries) {
                galleries.splice(galleryApp.id, 1);
                saveGalleries(galleries).then(function(success) {
                    let url = new URL(window.location.href);
                    url.searchParams.delete('gallery');
                    window.location.href = url.href;
                }, function(error) {
                    console.error(error);
                });
            }, function(error) {
                console.error(error);  
            });
        }
    }
});