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