const galleriesApp = new Vue({
    el: '#galleriesApp',
    data: {
        galleries: []
    },
    created() {
        // retrive the latest galleries
        fetchGalleries().then(function (data) {
            galleriesApp.galleries = data;
            window.localStorage.setItem('galleries', JSON.stringify(data));
        });
    },
    methods: {
        newGallery: function () {
            this.galleries.push(
                {
                    'title': 'New gallery',
                    'items': []
                }
            );

            saveGalleries(this.galleries).then(function (success) {

            }, function (error) {
                console.error(error);
            });
        },

        galleryClick: function (gallery) {
            let id = this.galleries.indexOf(gallery);
            if (id > -1) {
                let url = new URL(window.location.href);
                url.searchParams.set('gallery', id);
                window.location.href = url.href;
            }
        }
    }
});