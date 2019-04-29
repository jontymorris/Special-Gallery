jQuery(document).ready(function() {
    var $ = jQuery;
    
    $(document).on('click', '.set_custom_images', function(e) {
        e.preventDefault();
        var button = $(this);
        var id = button.prev();
        wp.media.editor.send.attachment = function(props, attachment) {
            id.val(attachment.id);
            
            let data = {
                'action': 'get_image',
                'id': attachment.id
            };

            $.post(ajaxurl, data, function(response) {
                let imageSrc = response.data[0];
                $('#my-image').attr('src', imageSrc);
            })
        };
        wp.media.editor.open(button);
        return false;
    });
});