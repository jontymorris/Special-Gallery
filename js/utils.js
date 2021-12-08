/**
 * Replace unsafe chars with escaped HTML
 */

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/**
 * Replace escaped HTML with raw chars
 */
function unescapeHtml(safe) {
    return safe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}

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

                galleries.forEach(gallery => {
                    gallery.title = unescapeHtml(gallery.title);
                    if (!gallery.items) return;
                    gallery.items.forEach(item => {
                        item.name = unescapeHtml(item.name);
                        item.blurb = unescapeHtml(item.blurb);
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

        let g = JSON.parse(JSON.stringify(galleries));

        g.forEach(gallery => {
            gallery.title = escapeHtml(gallery.title);
            gallery.items.forEach(item => {
                item.name = escapeHtml(item.name);
                item.blurb = escapeHtml(item.blurb);
            });
        });

        let data = {
            "action": "save_galleries",
            "galleries": g
        }

        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: data, 
            success: function() {
                resolve('Saved galleries successfully');
            },
            error: function() {
                reject('Failed to save galleries');
            }
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