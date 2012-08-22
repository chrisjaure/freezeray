# freezeray

Scrape your express app to generate static files.

## Getting Started
Once this is published: install the module with: `npm install freezeray`

```javascript
var freezeray = require('freezeray');
freezeray({
	// options
});
```

## Options

### server
The http server that's serving your content.

### routes
The `GET` routes from the express app. Can be retrieved from `app.routes.get`.

### publishDir
Where do you want the static files to end up? Any existing files will be deleted.

### publicDir
Directory containing assets that should be copied to `publishDir`.

## Examples
Sample usage:

```javascript
process.env.NODE_ENV = 'staging';

var freezeray = require('freezeray'),
	app = require('./app');

freezeray({
	server: app.get('server'),
	routes: app.routes.get,
	publishDir: __dirname + '/publish',
	publicDir: __dirname + '/public'
});
```

## License
Copyright (c) 2012 Chris Jaure  
Licensed under the MIT license.
