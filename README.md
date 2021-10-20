# DatoCMS Plugin: PLACEHOLDER_PLUGIN_NAME

PLACEHOLDER_PLUGIN_SHORT_DESCRIPTION

## !IMPORTANT Publishing

1. Make sure you have `docs/preview.gif` created that shows an interactive demo of this plugin
2. Create `docs/cover.png` that is displayed as the cover image on DatoCMS plugin page (2400x1600)
3. Publish the plugin ONLY with titelmedia-admin, credentials for this account are in 1Password (npm logout/login)
4. Link images in this readme with absolute paths (for instance `https://raw.githubusercontent.com/titel-media/datocms-plugin-use-link-as-defaults/master/docs/model-demo-article.png`) because NPM registry will fail to display relative paths.
5. Do not leave any secrets in the git history
6. Delete this section from the docs.
7. Search the repository for `PLACEHOLDER_` and make sure you have replaced all occurences
8. Run `yarn publish` after you made sure that you are logged in as titelmedia-admin with `npm who`

## Preview

PLACEHOLDER_PLUGIN_PREVIEW_GIF

## What this plugin can do for you

PLACEHOLDER_PLUGIN_DESCRIPTION

## Plugin Configuration

PLACEHOLDER_PLUGIN_CONFIG

```
{
  "global": [
    {
      "id": "developmentMode",
      "label": "Development Mode",
      "type": "boolean",
      "default": false,
      "hint": "Shows debug messages in console"
    },
    {
      "id": "apiToken",
      "label": "Read-Only API Token",
      "type": "string",
      "required": true,
      "default": "",
      "hint": "The plugin needs to fetch data in order to display it."
    },
  ],
  "instance": [

  ]
}
```

## TODO:

* [ ] Documentation in README
* [ ] Squash commits
* [ ] Publishing notes in readme above
  **
* [ ] Deployment

## Development

Install all the project dependencies with:

```
yarn install
```

Start the local development server with:

```
yarn start
```

The plugin will be served from [http://localhost:5000/](http://localhost:5000/). Insert this URL as the plugin [Entry point URL](https://www.datocms.com/docs/plugins/creating-a-new-plugin/).
