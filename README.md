[![SignPath logo](./assets/logo_signpath_500.png)](https://about.signpath.io)

# SignPath Website

This repository contains the SignPath website data. It runs on Github pages, which is built upon [Jekyll](https://jekyllrb.com).

## Running it
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
For JS development:

	yarn install

	yarn watch
	(./node_modules/.bin/webpack --watch | (cd docs/ && bundle exec jekyll serve --livereload --incremental))

	yarn build
	(./node_modules/.bin/webpack | (cd docs/ && bundle exec jekyll build))


### Running it using Docker
You need to have Docker installed.
Then, run the following comand (in PowerShell):

	docker run --rm -e JEKYLL_ENV=docker --label=jekyll --volume=${PWD}/docs:/srv/jekyll -it -p 4000:4000 jekyll/jekyll jekyll serve --force_polling

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

## Deploying

In order to deploy to the FQA environment, you need to install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) and connect it to your Azure account. Afterwards, set the environment variable `SubscriptionId`

	$Env:SubscriptionId = "<subscription-id>" # Paid Dev

and call the PowerShell script:

	.\deploy-to-fqa.ps1
