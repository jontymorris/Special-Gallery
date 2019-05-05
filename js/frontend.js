const galleryApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],
        thumbnails: {},
        fullsize: {},
        selected: null
    },
    'methods': {
        itemClick: function(item) {
            this.selected = item;
        },
        close: function() {
            this.selected = null;
        }
    }
});