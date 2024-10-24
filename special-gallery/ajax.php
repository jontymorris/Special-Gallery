<?php

// return an image src from id
function gallery_get_image()
{
    $id = absint($_POST['id']);
    $source = wp_get_attachment_image_src($id, 'thumbnail');

    if ($source) {
        wp_send_json_success($source);
    } else {
        wp_send_json_error();
    }
}

add_action('wp_ajax_get_image', 'gallery_get_image');

// get multiple images at once
function gallery_get_multiple_images() {
    // Ensure we have an array of IDs
    $ids = isset($_POST['ids']) ? json_decode(stripslashes($_POST['ids']), true) : [];
    
    if (!is_array($ids)) {
        wp_send_json_error('Invalid input format');
        return;
    }

    $results = [];
    foreach ($ids as $id) {
        $id = absint($id);
        $source = wp_get_attachment_image_src($id, 'thumbnail');
        if ($source) {
            $results[$id] = $source[0]; // Just store the URL, not the full array
        }
    }

    if (!empty($results)) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error('No images found');
    }
}

add_action('wp_ajax_get_multiple_images', 'gallery_get_multiple_images');

// returns the galleries
function gallery_get_galleries()
{
    $path = plugin_dir_path(__FILE__) . 'data/galleries.json';

    if (file_exists($path)) {
        $data = file_get_contents($path);
        if ($data === false) {
            wp_send_json_error('Failed to read galleries file');
            return;
        }
        wp_send_json_success($data);
    } else {
        wp_send_json_success('[]');
    }
}

add_action('wp_ajax_get_galleries', 'gallery_get_galleries');

// validate gallery item structure
function validate_gallery_item($item)
{
    if (!is_array($item)) {
        return false;
    }

    // Required fields
    if (!isset($item['name']) || !isset($item['blurb']) || !isset($item['images'])) {
        return false;
    }

    // Validate string fields
    if (
        !is_string($item['name']) || strlen($item['name']) > 200 ||
        !is_string($item['blurb']) || strlen($item['blurb']) > 1000
    ) {
        return false;
    }

    // Validate images array
    if (!is_array($item['images'])) {
        return false;
    }

    // Validate each image ID
    foreach ($item['images'] as $image_id) {
        if (!is_numeric($image_id) || $image_id <= 0) {
            return false;
        }
    }

    return true;
}

// saves the gallery items
function gallery_save_galleries()
{
    // Check user is authenticated
    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Insufficient permissions');
        return;
    }

    // Check galleries data is provided
    if (!isset($_POST['galleries'])) {
        wp_send_json_error('No galleries data provided');
        return;
    }

    // Decode galleries data
    $galleries = json_decode(wp_unslash($_POST['galleries']), true);
    if (!is_array($galleries)) {
        wp_send_json_error('Invalid galleries data');
        return;
    }

    // Validate all galleries
    foreach ($galleries as $gallery) {
        if (
            !isset($gallery['title']) || !isset($gallery['items']) ||
            !is_string($gallery['title']) || strlen($gallery['title']) > 200 ||
            !is_array($gallery['items'])
        ) {
            wp_send_json_error('Invalid gallery structure');
            return;
        }

        foreach ($gallery['items'] as $item) {
            if (!validate_gallery_item($item)) {
                wp_send_json_error('Invalid gallery item');
                return;
            }
        }
    }

    $path = plugin_dir_path(__FILE__) . 'data/galleries.json';
    $result = file_put_contents(
        $path,
        json_encode($galleries, JSON_PRETTY_PRINT),
        LOCK_EX
    );

    if ($result === false) {
        wp_send_json_error('Failed to save galleries');
        return;
    }

    wp_send_json_success('Galleries saved successfully');
}

add_action('wp_ajax_save_galleries', 'gallery_save_galleries');

?>