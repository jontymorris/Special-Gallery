const galleryApp = new Vue({
    el: '#galleryApp',
    data: {
        items: [],
        imageUrls: {},
        selected: null,
        slideIndex: 0
    },
    methods: {
        itemClick: function(item) {
            if (item.images) {
                this.selected = item;
            }
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
        },

        getItemThumbnail: function(item) {
            if (item.images && item.images.length > 0) {
                let id = item.images[0];

                if (id in this.imageUrls) {
                    return this.imageUrls[id];
                }
            }

            return '';
        },
    }
});