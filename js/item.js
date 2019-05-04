const itemApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],
        selected: null,
        imageUrls: {},
        grid: null,
        params: null
    },
    created() {
        // retrive the gallery items
        fetchItems().then(function(data) {
            itemApp.items = data;

            // find the selected item
            itemApp.params = new window.URLSearchParams(window.location.search);
            itemApp.selected = itemApp.items[itemApp.params.get('item')];

            // retrive the thumbnails
            itemApp.items.forEach(function(item) {
                if (item.images) {
                    item.images.forEach(function(id) {
                        if (!(id in itemApp.imageUrls)) {
                            getImageSource(id).then(function(source) {
                                itemApp.imageUrls[id] = source;
                                itemApp.refreshGrid();
                            });
                        }
                    });
                }
            });
        }, function(error) {
            console.error(error);
        });
    },
    methods: {
        refreshGrid: function() {
            this.$nextTick(function() {
                this.grid = new Muuri('.grid', {
                    'dragEnabled': true
                });

                new Touchy('.grid',
                    itemApp.imageClick, // click
                    itemApp.imageDrag // drag
                );
            });
            
            this.$forceUpdate();
        },

        getOrderedImages: function() {
            let orderedItems = [];
    
            let galleryImages = this.grid.getItems();
            for (let i=0; i<galleryImages.length; i++) {
                let elementId = parseInt(galleryImages[i].getElement().getAttribute('gallery-id'));
                orderedItems.push(this.selected[elementId]);
            }

            return orderedItems;
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
            pickImage().then(function(id) {
                if (!itemApp.selected.images) {
                    itemApp.selected.images = [];
                }

                // check we don't already have the thumbnail
                if (!(id in itemApp.imageUrls)) {
                    // retrive the image source
                    getImageSource(id).then(function(source) {
                        itemApp.imageUrls[id] = source;
                        itemApp.selected.images.push(id);

                        itemApp.refreshGrid();
                        //saveItems(galleryApp.syncMainGrid())
                    }, function(reject) {
                        console.error(reject);
                    })
                } else {
                    itemApp.selected.images.push(id);
                    itemApp.refreshGrid();
                    //saveItems(galleryApp.syncMainGrid())
                }
            });
        },
        
        imageClick: function(image) {
            console.log(image);
        },

        imageDrag: function() {

        },

        back: function() {
            this.selected.images = this.getOrderedImages();
            saveItems(this.items).then(function(resolve) {
                let id = itemApp.params.get('item');
                let subString = 'item=' + id;

                window.location.href = window.location.href.replace('&' + subString, '');
                window.location.href = window.location.href.replace(subString, '');
            }, function(reject) {
                console.error(reject);
            });
        },

        removeImage: function(image) {
            //let images = this.getOrderedImages();

            let index = this.selected.images.indexOf(image);
            if (index > -1) {
                this.selected.images.splice(index, 1);
            }

            //this.selected.images = images;
            this.refreshGrid();
        },
        
        removeItem: function() {
            let index = this.items.indexOf(this.selected);
            if (index > -1) {
                this.grid.destroy(true);
                this.grid = null;
                
                this.items.splice(index, 1);
                saveItems(this.items).then(function(resolve) {
                    let id = itemApp.params.get('item');
                    let subString = 'item=' + id;

                    window.location.href = window.location.href.replace('&' + subString, '');
                    window.location.href = window.location.href.replace(subString, '');
                });
            }
        }
    }
});
