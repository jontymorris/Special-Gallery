const galleryApp = new Vue({
    'el': '#galleryApp',
    'data': {
        items: [],
        thumbnails: {},
        fullsize: {},
        selected: null,
        slideIndex: 0
    },
    'methods': {
        itemClick: function(item) {
            this.selected = item;
        },

        close: function() {
            this.selected = null;
            this.slideIndex = 0;
        },

        lastSlide: function() {
            this.slideIndex--;
            this.checkIndex();
        },

        nextSlide: function() {
            this.slideIndex++;
            this.checkIndex();
        },

        checkIndex: function() {
            if (!this.selected) {
                return;
            }

            let count = this.selected.images.length;

            if (count == 0) {
                this.slideIndex = 0;
            }

            else if (this.slideIndex < 0) {
                this.slideIndex = count-1;
            }

            else if (this.slideIndex >= count) {
                this.slideIndex = 0;
            }
        }
    }
});