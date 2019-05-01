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
                resolve(response.data);
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
        selected: null
    }, created() {
        // Retrive the gallery items
        fetchItems().then(function(data) {
            galleryApp.items = data;
        }, function(error) {
            console.log(error);
        });
    }, methods: {
        newItem: function() {
            this.items.push( {'blurb': 'test'} );
        },
        newImage: function() {
            pickImage().then(function(id) {
                if (!galleryApp.selected.images) {
                    galleryApp.selected.images = [];
                }

                galleryApp.selected.images.push(id);
                galleryApp.$forceUpdate();
            });
        },
        selectClick: function(item) {
            this.selected = item;
        },
        imageClick: function(image) {

        },
        back: function() {
            this.selected = null;
        }
    }
});

