const galleryApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],
        imageUrls: {},
        grid: null
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
            galleryApp.items = data;
            
            // retrive the thumbnails
            galleryApp.items.forEach(function(item, index) {
                if (item.images) {
                    item.images.forEach(function(id) {
                        if (!(id in galleryApp.imageUrls)) {
                            getImageSource(id).then(function(source) {
                                galleryApp.imageUrls[id] = source;
                                galleryApp.refreshGrid();
                            });
                        }
                    });
                }
                
                if (index == galleryApp.items.length-1) {
                    galleryApp.refreshGrid();

                    window.localStorage.setItem('imageUrls', JSON.stringify(galleryApp.imageUrls));
                    window.localStorage.setItem('items', JSON.stringify(galleryApp.items));
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
                galleryApp.grid = new Muuri('.gallery-grid', {
                    'dragEnabled': true
                });

                new Touchy('.gallery-grid', this.itemClick, this.itemDrag);
            });
        },

        getOrderedItems: function() {
            if (!this.grid) {
                return [];
            }

            let orderedItems = [];
            let galleryItems = this.grid.getItems();
            for (let i=0; i<galleryItems.length; i++) {
                let elementId = parseInt(galleryItems[i].getElement().getAttribute('gallery-id'));
                let item = this.items[elementId];

                if (typeof item !== 'undefined') {
                    orderedItems.push(item);
                }
            }

            return orderedItems;
        },

        newItem: function() {
            let orderedItems = this.getOrderedItems();
            orderedItems.push(
                {
                    'blurb': '',
                    'images': []
                }
            );

            saveItems(orderedItems).then(function(resolve) {
                galleryApp.items = orderedItems;
                galleryApp.refreshGrid();
            });
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
            window.location.href += '&item=' + id;
        },

        itemDrag: function() {
            saveItems(this.getOrderedItems());
        }
    }
});
