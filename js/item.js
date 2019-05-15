const itemApp = new Vue({
    el: '#galleryApp',
    data: {
        imageUrls: {},

        id: 0,
        gallery: null,
        selected: null,

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

        // retrive the gallery items
        fetchGallery(this.id).then(function(gallery) {
            itemApp.gallery = gallery;

            if (itemApp.gallery.items) {
                itemApp.selected = itemApp.gallery.items[url.searchParams.get('item')];

                if (!itemApp.selected) {
                    itemApp.selected = [];
                    url.searchParams.delete('item');
                    window.location.href = url.href;
                }

                itemApp.refreshGrid();
            } else {
                itemApp.gallery.items = [
                    {
                        'blurb': '',
                        'images': []
                    }
                ];
                itemApp.selected = itemApp.gallery.items[0];
            }

            // retrive the thumbnails
            if (itemApp.selected.images) {
                itemApp.selected.images.forEach(function(image) {
                    getImageSource(image).then(function(source) {
                        itemApp.imageUrls[image] = source;
                        window.localStorage.setItem('imageUrls', JSON.stringify(itemApp.imageUrls));
                        itemApp.refreshGrid();
                    });
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
                if (jQuery('.gallery-grid').length == 0) {
                    return;
                }

                itemApp.grid = new Muuri('.gallery-grid', {
                    'dragEnabled': true
                });

                new Touchy('.gallery-grid', this.imageClick, this.imageDrag);
            });
        },

        saveChanges: function() {
            if (!this.selected.images) {
                this.selected.images = [];
            }

            this.selected.images = this.getOrderedImages();

            saveGallery(this.gallery, this.id).then(function(resolve) {
                window.location.reload();
            });
        },

        getOrderedImages: function() {
            if (!this.grid) {
                return [];
            }

            let orderedImages = [];

            this.grid.getItems().forEach(function(element) {
                let elementId = parseInt(element.getElement().getAttribute('gallery-id'));
                let image = itemApp.selected.images[elementId]

                if (typeof image !== 'undefined') {
                    orderedImages.push(image);
                }
            });

            let difference = this.selected.images.length - orderedImages.length;
            if (difference > 0) {
                orderedImages = orderedImages.concat(this.selected.images.splice(this.selected.images.length - difference));
            }

            return orderedImages;
        },
        
        getItemThumbnail: function(item) {
            if (item.images & item.images.length > 0) {
                let id = item.images[0];
                if (id in this.imageUrls) {
                    return this.imageUrls[id];
                }
            }

            return '';
        },

        newImage: function() {
            pickImage(this.addImage);
        },

        addImage: function(id) {
            this.isChanged = true;

            if (!itemApp.selected.images) {
                itemApp.selected.images = [];
            }

            // is the thumbnail in the cache?
            if (id in this.imageUrls) {
                this.selected.images = this.getOrderedImages();
                this.selected.images.push(id);
                
                this.refreshGrid();
            }

            // retrive the image source
            else {
                getImageSource(id).then(function(source) {
                    itemApp.imageUrls[id] = source;
                    itemApp.selected.images = itemApp.getOrderedImages();
                    itemApp.selected.images.push(id);

                    window.localStorage.setItem('imageUrls', JSON.stringify(itemApp.imageUrls));

                    itemApp.refreshGrid();
                }, function(reject) {
                    console.error(reject);
                })
            }
        },
        
        imageClick: function(image) {
            
        },

        imageDrag: function() {
            this.isChanged = true;
        },

        back: function() {
            let url = new URL(window.location.href);
            url.searchParams.delete('item');
            window.location.href = url.href;
        },

        removeImage: function(image) {
            this.isChanged = true;

            this.selected.images = this.getOrderedImages();

            let index = this.selected.images.indexOf(image);
            if (index > -1) {
                this.selected.images.splice(index, 1);
                itemApp.$forceUpdate();
                itemApp.refreshGrid();
            }

            if (this.selected.images.length == 0) {
                this.saveChanges();
            }
        },
        
        removeItem: function() {
            let index = this.gallery.items.indexOf(this.selected);
            if (index > -1) {
                this.gallery.items.splice(index, 1);

                saveGallery(this.gallery, this.id).then(function(success) {
                    let url = new URL(window.location.href);
                    url.searchParams.delete('item');
                    window.location.href = url.href;
                });
            }
        }
    }
});
