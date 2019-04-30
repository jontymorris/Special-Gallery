var items = [];

var galleryGrid;
var itemGrid;

var mouseClick;
var mouseDragging;

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
            displayItems();
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
    displayItems();
}

/**
 * Syncs the order of the gallery items with the 'real' items
 */
function syncOrder() {
    let orderedItems = [];
    
    let galleryItems = galleryGrid.getItems();
    for (let i=0; i<galleryItems.length; i++) {
        let elementId = parseInt(galleryItems[i].getElement().getAttribute('gallery-id'));
        orderedItems.push(items[elementId]);
    }

    items = orderedItems;
    saveItems();
}

/**
 * Returns the HTML for an item in the gallery
 */
function getItemHtml(id, blurb) {
    return `<div class="item" gallery-id="${id}">
        <div class="item-content">
            ${blurb}
        </div>
    </div>`;
}

/**
 * Clears the gallery and adds the items
 */
function displayItems() {
    // clear previous items
    if (galleryGrid) {
        galleryGrid.destroy();
        jQuery(galleryGrid.getElement()).empty();
    }

    // insert new items
    for (let i=0; i<items.length; i++) {
        jQuery(galleryGrid.getElement()).append(getItemHtml(i, items[i].blurb));
    }

    // refresh the gallery
    galleryGrid = new Muuri('.gallery-grid', {
        'dragEnabled': true
    });
}

function setupGrid() {
    galleryGrid = new Muuri('.gallery-grid', {
        'dragEnabled': true
    });

    loadItems();

    jQuery('.gallery-grid').mousedown(function() {
        mouseClick = true;
        mouseDragging = false;
    })

    jQuery('.gallery-grid').mousemove(function() {
        if (mouseClick) {
            mouseDragging = true;
        }
    })

    jQuery('.gallery-grid').on('mouseup', '.item', function() {
        if (mouseDragging) {
            syncOrder();
        } else {
            //openModal(this);
        }

        mouseDragging = false;
        mouseClick = false;
    })
}

/**
 * Inits the Speical Gallery
 */
function init() {
    jQuery('#new-item').click(newItem);

    setupGrid(); 
}

jQuery(document).ready(init);