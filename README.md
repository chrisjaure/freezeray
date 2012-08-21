# freezeray

Scrape your express app to generate static files.

## Getting Started
Once this is published: install the module with: `npm install freezeray`

```javascript
var freezeray = require('freezeray');
freezeray({
	// options
})
```

## Documentation
_(Coming soon)_

## Examples
Sample usage:

```javascript
process.env.NODE_ENV = 'staging';

var freezeray = require('freezeray'),
	config = require('./config'),
	app = require('./app');

freezeray({
	server: app.get('server'),
	requestUrl: 'http://localhost:' + app.get('port'),
	routes: app.routes.get,
	publishDir: config.compile.publish_dir,
	publicDir: config.compile.public_dir
});
```

## License
Copyright (c) 2012 Chris Jaure  
Licensed under the MIT license.
