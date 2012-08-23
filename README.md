# freezeray

Scrape your express app to generate static files.

## Getting Started
Once this is published: install the module with: `npm install freezeray`

```javascript
var freezeray = require('freezeray'),
	app = require('./app');
freezeray(app, {
	// options
});
```
`app` is expected to be an Express app. It should not start the server.

## Options

### publishDir
Where do you want the static files to end up? Any existing files will be deleted.

### publicDir
Directory containing assets that should be copied to `publishDir`.

### serverConfig
An object containing `hostname` and `port`.

## Examples
Sample usage:

```javascript
process.env.NODE_ENV = 'staging';

var freezeray = require('freezeray'),
	app = require('./app');

freezeray(app, {
	publishDir: __dirname + '/publish',
	publicDir: __dirname + '/public'
});
```

## License
Copyright (c) 2012 Chris Jaure  
Licensed under the MIT license.
