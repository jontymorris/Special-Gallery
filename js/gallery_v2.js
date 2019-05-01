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
        imageUrls: {}
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
                                galleryApp.$forceUpdate();
                            });
                        }
                    });
                }
            });
        }, function(error) {
            console.error(error);
        });
    }, methods: {
        newItem: function() {
            this.items.push({
                'blurb': '',
                'images': []
            });

            saveItems(this.items);
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
                        galleryApp.$forceUpdate();

                        saveItems(galleryApp.items)
                    }, function(reject) {
                        console.error(reject);
                    })
                } else {
                    galleryApp.selected.images.push(id);
                    galleryApp.$forceUpdate();

                    saveItems(galleryApp.items);
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
            saveItems(this.items);
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

