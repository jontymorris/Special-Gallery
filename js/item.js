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
        if ('imageUrls' in window.localStorage) {
            if (window.localStorage.getItem('imageUrls') !== 'undefined') {
                this.imageUrls = JSON.parse(window.localStorage.getItem('imageUrls'));
                this.refreshGrid();
            }
        }

        if ('items' in window.localStorage) {
            if (window.localStorage.getItem('items') !== 'undefined') {
                this.items = JSON.parse(window.localStorage.getItem('items'));
                this.refreshGrid();
            }
        }

        // retrive the gallery items
        fetchItems().then(function(data) {
            itemApp.items = data;
            
            // find the selected item
            itemApp.params = new window.URLSearchParams(window.location.search);
            itemApp.selected = itemApp.items[itemApp.params.get('item')];

            // retrive the thumbnails
            itemApp.items.forEach(function(item, index) {
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
                
                if (index == itemApp.items.length-1) {
                    itemApp.refreshGrid();

                    window.localStorage.setItem('imageUrls', JSON.stringify(itemApp.imageUrls));
                    window.localStorage.setItem('items', JSON.stringify(itemApp.items));
                }
            });
        }, function(error) {
            console.error(error);
        });
    },
    methods: {
        refreshGrid: function() {
            this.$forceUpdate();

            this.$nextTick(function() {
                if (jQuery('.grid').length == 0) {
                    return;
                }

                itemApp.grid = new Muuri('.grid', {
                    'dragEnabled': true
                });

                new Touchy('.grid', this.imageClick, this.imageDrag);
            });
        },

        getOrderedImages: function() {
            let orderedItems = [];
    
            let galleryImages = this.grid.getItems();
            for (let i=0; i<galleryImages.length; i++) {
                let elementId = parseInt(galleryImages[i].getElement().getAttribute('gallery-id'));
                orderedItems.push(this.selected.images[elementId]);
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
                        
                        if (itemApp.selected.images.length > 1) {
                            itemApp.selected.images = itemApp.getOrderedImages();
                        }
                        
                        itemApp.selected.images.push(id);
                        
                        saveItems(itemApp.items).then(function(resolve) {    
                            itemApp.refreshGrid();
                        });
                    }, function(reject) {
                        console.error(reject);
                    })
                } else {
                    if (itemApp.selected.images.length > 1) {
                        itemApp.selected.images = itemApp.getOrderedImages();
                    }
                    
                    itemApp.selected.images.push(id);
                    
                    saveItems(itemApp.items).then(function(resolve) {
                        itemApp.refreshGrid();
                    });
                }
            });
        },
        
        imageClick: function(image) {
            
        },

        imageDrag: function() {

        },

        back: function() {
            if (this.selected) {
                if (this.selected.images && this.selected.images.length > 1) {
                    this.selected.images = this.getOrderedImages()
                }
            }
            
            if (this.grid) {
                this.grid.destroy(false);
            }

            saveItems(this.items).then(function() {
                let id = itemApp.params.get('item');
                let subString = 'item=' + id;

                window.location.href = window.location.href.replace('&' + subString, '');
                window.location.href = window.location.href.replace(subString, '');
            });
        },

        removeImage: function(image) {
            this.selected.images = this.getOrderedImages();

            let index = this.selected.images.indexOf(image);
            if (index > -1) {
                this.selected.images.splice(index, 1);

                saveItems(this.items).then(function(resolve) {
                    itemApp.$forceUpdate();
                    itemApp.refreshGrid();
                });
            }
        },
        
        removeItem: function() {
            this.grid.destroy(true);
            this.grid = null;

            let index = this.items.indexOf(this.selected);
            if (index > -1) {
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
