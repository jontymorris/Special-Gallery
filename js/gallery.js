const galleryApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],
        imageUrls: {},
        grid: null
    },
    created() {
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
                } else if (index == galleryApp.items.length-1) {
                    galleryApp.refreshGrid();
                }
            });
        }, function(error) {
            console.error(error);
        });
    },
    methods: {
        refreshGrid: function() {
            this.$nextTick(function() {
                galleryApp.grid = new Muuri('.grid', {
                    'dragEnabled': true
                });

                new Touchy('.grid', this.itemClick, this.itemDrag);
            })

            this.$forceUpdate();
        },

        getOrderedItems: function() {
            let orderedItems = [];
    
            let galleryItems = this.grid.getItems();
            for (let i=0; i<galleryItems.length; i++) {
                let elementId = parseInt(galleryItems[i].getElement().getAttribute('gallery-id'));
                orderedItems.push(this.items[elementId]);
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
