/**
 * Retrive the gallery items from Wordpress
 */
function fetchItems() {
    return new Promise(function(resolve, reject) {
        let data = {
            'action': 'get_items'
        }

        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                resolve( JSON.parse(response.data) );
            }

            reject('Failed to retrive items');
        })
    });
}

/**
 * Saves the items on the server
 */
function saveItems(items) {
    return new Promise(function(resolve, reject) {
        let data = {
            'action': 'save_items',
            'items': items
        };

        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                resolve('Saved items successfully');
            }

            reject('Failed to save items');
        });
    });
}

/**
 * Returns the image source
 */
function getImageSource(id) {
    return new Promise(function(resolve, reject) {
        let data = {
            'action': 'get_image',
            'id': id
        };

        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                resolve(response.data[0]);
            }

            reject('Failed to retrive image source');
        });
    });
}

/**
 * Returns an image ID from the Wordpress gallery
 */
function pickImage() {
    return new Promise(function(resolve) {
        wp.media.editor.send.attachment = function(props, attachment) {
            resolve(attachment.id);
        }

        wp.media.editor.open();
    });
}

const galleryApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],

        selected: null,
        imageUrls: {},

        mainGrid: null
    }, created() {
        // retrive the gallery items
        fetchItems().then(function(data) {
            galleryApp.items = data;
            
            // retrive the thumbnails
            galleryApp.items.forEach(function(item) {
                if (item.images) {
                    item.images.forEach(function(id) {
                        if (!(id in galleryApp.imageUrls)) {
                            getImageSource(id).then(function(source) {
                                galleryApp.imageUrls[id] = source;
                                galleryApp.refreshMainGrid();
                            });
                        }
                    });
                }
            });
        }, function(error) {
            console.error(error);
        });
    }, methods: {
        refreshMainGrid: function() {
            this.$nextTick(function() {
                if (this.selected) {
                    return;
                }

                if (jQuery('#main-grid').length > 0) {
                    this.mainGrid = new Muuri('#main-grid', {
                        'dragEnabled': true
                    });
                }
            });
            
            this.$forceUpdate();
        },
        syncMainGrid: function() {
            let orderedItems = [];
    
            let galleryItems = this.mainGrid.getItems();
            for (let i=0; i<galleryItems.length; i++) {
                let elementId = parseInt(galleryItems[i].getElement().getAttribute('gallery-id'));
                orderedItems.push(this.items[elementId]);
            }

            return orderedItems;
        },

        newItem: function() {
            this.items.push({
                'blurb': '',
                'images': []
            });

            saveItems(this.syncMainGrid());
        },
        newImage: function() {
            pickImage().then(function(id) {
                if (!galleryApp.selected.images) {
                    galleryApp.selected.images = [];
                }

                if (!(id in galleryApp.imageUrls)) {
                    // retrive the image source
                    getImageSource(id).then(function(source) {
                        galleryApp.imageUrls[id] = source;
                        galleryApp.selected.images.push(id);

                        galleryApp.refreshMainGrid();

                        saveItems(this.syncMainGrid())
                    }, function(reject) {
                        console.error(reject);
                    })
                } else {
                    galleryApp.selected.images.push(id);

                    galleryApp.refreshMainGrid();

                    saveItems(this.syncMainGrid());
                }
            });
        },
        selectClick: function(item) {
            this.selected = item;
        },
        imageClick: function(image) {

        },
        back: function() {
            this.selected = null;
            this.refreshMainGrid();

            saveItems(this.syncMainGrid());
        },
        removeItem: function() {
            let index = this.items.indexOf(this.selected);
            if (index > -1) {
                this.items.splice(index, 1);
                this.selected = null;
            }
        },
        removeImage: function(image) {
            let index = this.selected.images.indexOf(image);
            if (index > -1) {
                this.selected.images.splice(index, 1);
            }
        }
    }
});

var mainGridTouchy = new Touchy('#main-grid',
    // click
    function(id) {
        galleryApp.selected = galleryApp.items[id];
    }, 
    // drag
    function() {
        saveItems(galleryApp.syncMainGrid());
    }
);