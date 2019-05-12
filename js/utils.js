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


/**
 * Checks if an item is in the local storage
 */
function isItemInStorage(key) {
    if (key in window.localStorage) {
        if (window.localStorage.getItem(key) !== 'undefined') {
            return true;
        }
    }

    return false;
}


class Touchy {
    /**
     * Used to capture click and drag events on an element.
     */
    constructor(className, clickCallback, dragCallback) {
        this.mouseClick = false;
        this.isDragging = false;

        jQuery(className)
            .mousedown(function() {
                this.mouseClick = true;
                this.isDragging = false;
            })
            .mousemove(function() {
                if (this.mouseClick) {
                    this.isDragging = true;
                }
            })
            .mouseup(function(event) {
                if (this.isDragging) {
                    dragCallback();
                } else {
                    let id = event.target.getAttribute('gallery-id');

                    if (id) {
                        clickCallback(id);
                    }
                }
            
                this.mouseClick = false;
            });
    }
}