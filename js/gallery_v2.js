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

