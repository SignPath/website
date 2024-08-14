<a href="https://about.signpath.io"> <img src="docs/assets/signpath-logo.svg" width="500px"> </a>

# SignPath Website

This repository contains the SignPath website data. It runs on Github pages, which is built upon [Jekyll](https://jekyllrb.com).

## Running it locally
There are two ways of running the application locally: Either directly using a local Ruby installation or by using Docker. In both setups the website will be reachable on [http://localhost:4000](http://localhost:4000)

### Running it on local Ruby installation
You need to have Ruby and RubyGems installed. See the [official documentation of Jekyll](https://jekyllrb.com/docs/installation/).
Then, run the following command to install all dependencies:

	gem install jekyll bundler
	bundle install

To run the installation locally, you need to execute

	bundle exec jekyll serve

If you want to include drafts into the blog, add the `--drafts` flag.

Depending on the value of the environment variable `JEKYLL_ENV`, different links will be used on the website. The supported values are `production` (default on Github), `fqa`, `iqa` and `development` (default otherwise)

### Webpack
For JS development (compiled JS is currently checked in):

	yarn install

	yarn watch
	(./node_modules/.bin/webpack --watch | (cd docs/ && bundle exec jekyll serve --livereload --incremental))

	yarn build
	(./node_modules/.bin/webpack | (cd docs/ && bundle exec jekyll build))


### Running it using Docker
You need to have Docker installed.
Then, run the following command (in PowerShell):

	docker run --rm -e JEKYLL_ENV=docker --label=jekyll --volume=${PWD}/docs:/srv/jekyll -it -p 127.0.0.1:4000:4000 jekyll/jekyll jekyll serve --force_polling

## Adding/editing/removing content

### General content

To edit the content, simply edit the respective `*.md` files.

### Adding blog posts

In order to publish a blog post, perform the following steps:

1. Add the content of the blog post in markdown-file titled `YYYY-MM-DD-slug`a folder `blog/_drafts`. Make sure to fill out the metadata at the top of the file (see existing posts)
2. Add two versions of the background image to the `assets/posts/` folder:
 	
 	* A full-resolution version under `YYYY-MM-DD-slug.png|jpg` (must have a width that fills the screen of all devices)
 	* A low-resolution version under `YYYY-MM-DD-slug_small.png|jpg` (width of 340px)
 	* Both images should have a black layer on top with 50% transparency to ensure that white font is easily readable
3. Optionally add the slug to the `featured_slugs` section under `blog/index.md`
4. See if the post works by running the website using the `--drafts` flag.
5. If everything is good, move the markdown file from the `_drafts` to a `_posts` subfolder.

### Adding/removing job posts

In order to add or remove a job, directly edit the `jobs/index.md` file and change the HTML code.

### Changing icon set

The general icons used on the website come from [Line Awesome](https://icons8.com/line-awesome) and a set of them are self-created / from various sources. The latter are collected in `assets/icons/single` and are then combined into the `fontello` font using [fontello.com](http://fontello.com/).

In order to extend the icon set, perform the following steps:

1. Add the new SVG file to `assets/icons/single`
2. Open [fontello.com](http://fontello.com/) and upload all .svg files from the folder
3. Select them all and generate and download the webfont
4. From the `font` folder in the webfont, copy all files to `docs/assets/fonts`
5. Open the `_sass/fontello.scss` file, a) make sure to add a new query parameter to all uris (in order to make sure caches are bypassed) and b) overwrite the block at the bottom with all the `.icon-XXX` CSS classes with the values from the `css/fontello.css` file in the webfont
6. Make sure that the `div.panel-header::before` style for `&.product` still references the `icon-signpath-flag` icon in the `_sass/resources.scss` file


## Deploying

The page deploys to Github Pages using Github Actions. There are multiple environments:

* `production`: Uses github pages right from this repository:
* `fqa`: Deploys to the `website-fqa` repository which in turn uses Github Pages to host the page. 

Deployment happens automatically on pushes to `main` or manually from the Github Actions tab (by running the "Build & Deploy [FQA|PROD]" workflow on the respective branch).

_Note: For the deployments to another git repository, [cpina/github-action-push-to-another-repository](https://github.com/marketplace/actions/push-directory-to-another-repository) is used._
