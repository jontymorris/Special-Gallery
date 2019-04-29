var items = [];
var galleryGrid;

/**
 * Loads the items
 */
function loadItems() {
    let data = {
        'action': 'get_items',
    };

    jQuery.post(ajaxurl, data, function(response) {
        if (response.success) {
            items = JSON.parse(response.data)
        } else {
            console.error('Failed to load gallery items')
        }
    })
}

/**
 * Saves the items
 */
function saveItems() {
    let data = {
        'action': 'save_items',
        'items': items
    };

    jQuery.post(ajaxurl, data, function(response) {
        if (!response.success) {
            console.log('Failed to save the gallery items');
        }
    })
}

/**
 * Creates an empty item and saves it
 */
function newItem() {
    items.push({
        'blurb': '',
        'images': []
    })

    saveItems();
}

function displayItems() {
    
}

/**
 * Inits the Speical Gallery
 */
function init() {
    loadItems();
    jQuery('#new-item').click(newItem);

    galleryGrid = new Muuri('.gallery-grid', {
        'dragEnabled': true
    });
}

jQuery(document).ready(init);