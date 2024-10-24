# Special Gallery
<img src="./docs/gallery_view.png" alt="gallery" width="316">
<img src="./docs/gallery_selected.png" alt="gallery_selected" width="300">


## What is this?
A simple gallery plugin for Wordpress. It enables you to manage multiple galleries and insert them into your website. Each gallery contains an array of items, that display in a grid, but expand into a unique slideshow when clicked.


## How do I setup the plugin?
- Install the Elementor plugin.
- Clone the source from Github.
- Inside the repository copy the `special-gallery` folder into `wp-plugins` within Wordpress's files.
- Create a `data` folder in `special-gallery`.
- Then, create a `galleries.json` file in `data` that contains `[]`.
- Activate the plugin through Wordpress.

After you have activated the plugin, click on 'Dashboard'. There will be a new menu option called 'Special Gallery'.
> **Note:** Don't embed multiple galleries on the same page. This will mess up the JavaScript causing the galleries to not show properly.


## Setup Development Environment

### Pre-requisites
For a development environment to get setup, the atmosphere must be primed.
Before running the plugin, you must say "yeah, this gallery is special".

- docker

#### Get started

```bash
docker compose up -f development/docker-compose.yml up
```

admin:admin
