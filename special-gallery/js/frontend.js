const galleryApp = new Vue({
    el: '#galleryApp',
    data: {
        items: [],
        imageUrls: {},
        selected: null,
        slideIndex: 0,
        currentImage: ''
    },
    methods: {
        itemClick: function (item) {
            if (item.images) {
                this.selected = item;

                this.$nextTick(function () {
                    this.updateImage();
                });
            }
        },

        close: function () {
            this.selected = null;
            this.slideIndex = 0;
        },

        lastSlide: function () {
            this.slideIndex--;
            this.checkIndex();
        },

        nextSlide: function () {
            this.slideIndex++;
            this.checkIndex();
        },

        previewClick: function (index) {
            this.slideIndex = index;
            this.checkIndex();
        },

        centerPreview: function () {
            let images = jQuery('.gallery-preview img');
            let element = images[this.slideIndex];

            let position = 0;
            for (let i = 0; i < this.slideIndex; i++) {
                position += jQuery(images[i]).outerWidth();
                position += 20;
            }

            let halfWindowWidth = jQuery(window).width() / 2;

            if (position + jQuery(element).outerWidth() / 2 < halfWindowWidth) {
                jQuery('.gallery-preview').animate({ 'margin-left': '0px' });
                return;
            };

            position += jQuery(element).outerWidth() / 2;
            position -= halfWindowWidth;

            position = -position;
            position = parseInt(position) + 'px';

            jQuery('.gallery-preview').animate({ 'margin-left': position });
        },

        updateImage: function () {
            let imageUrl = this.imageUrls[this.selected.images[this.slideIndex]];
            jQuery('#gallery-image').attr('src', imageUrl);
        },

        checkIndex: function () {
            if (!this.selected) {
                return;
            }

            let count = this.selected.images.length;

            if (count == 0) {
                this.slideIndex = 0;
            }

            else if (this.slideIndex < 0) {
                this.slideIndex = count - 1;
            }

            else if (this.slideIndex >= count) {
                this.slideIndex = 0;
            }

            this.updateImage();
            this.centerPreview();
        },

        getItemThumbnail: function (item) {
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

window.addEventListener('load', function () {
    jQuery(document).keyup(function (event) {
        if (event.key === 'Escape') {
            galleryApp.close();
        }
    })
})