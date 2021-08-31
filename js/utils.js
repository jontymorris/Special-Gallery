/**
 * Retrive the galleries
 */
function fetchGalleries() {
    return new Promise(function(resolve, reject) {
        let data = {
            'action': 'get_galleries'
        }

        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                let galleries = JSON.parse(response.data);

                galleries.forEach((gallery) =>{
                    
                    gallery.items.forEach((element) => {
                        element.name = unescape(element.name);
                        element.blurb = unescape(element.blurb);
                    });
                });
                resolve( galleries );
            }

            reject('Failed to retrive galleries');
        })
    });
}


/**
 * Retrives the gallery
 */
function fetchGallery(id) {
    return new Promise(function(resolve, reject) {
        fetchGalleries().then(function(galleries) {
            if (id >= galleries.length) {
                resolve({
                    'title': 'Blank gallery',
                    'items': []
                });
            }

            resolve(galleries[id]);
        }, function(error) {
            reject(error);
        });
    }); 
}


/**
 * Saves the galleries
 */
function saveGalleries(galleries) {
    return new Promise(function(resolve, reject) {

        let data = {
            'action': 'save_galleries',
            'galleries': galleries
        };

        galleries.forEach((gallery) =>{
            gallery.items.forEach((element) => {
                element.name = escape(element.name);
                element.blurb = escape(element.blurb);
            });
        });

        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                resolve('Saved galleries successfully');
            }

            reject('Failed to save galleries');
        });
    });
}


/**
 * Saves the gallery 
 */
function saveGallery(gallery, id) {
    return new Promise(function(resolve, reject) {
        fetchGalleries().then(function(galleries) {
            galleries[id] = gallery;
            saveGalleries(galleries).then(function(success) {
                resolve(success);
            }, function(error) {
                reject(error);
            });
        }, function(error) {
            reject(error);
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
function pickImage(callback) {
    wp.media.editor.send.attachment = function(props, attachment) {
        callback(attachment.id);
    }

    wp.media.editor.open();
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