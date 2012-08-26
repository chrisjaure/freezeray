# freezeray

Scrape your express app to generate static files.


## Getting Started

Install the module with: `npm install freezeray`

```javascript
var freezeray = require('freezeray'),
	app = require('./app'),
	options = {},
	cb = function(err) {};

freezeray(app, options, cb);
```

- `app` is expected to be an Express app. It should not start the server.
- `options` are listed below.
- `cb` will be called when complete or if an error is encountered.


## Options

### `publishDir` (default: `'./publish'`)
Where do you want the static files to end up? Any existing files will be deleted.

### `publicDir` (default: `'./public'`)
Directory containing assets that should be copied to `publishDir`.

### `serverConfig` (default: `{ hostname: 'localhost', port: '3456'}`)
An object containing `hostname` and `port`.

### `verbose` (default: `false`)
Log what's happening.

## Examples
Sample usage:

```javascript
process.env.NODE_ENV = 'staging';

var freezeray = require('freezeray'),
	express = require('express'),
	app = express();

app.use(app.router);

app.get('/', function(req, res) {
	res.end('Test');
});

freezeray(app, {
	publishDir: __dirname + '/publish',
	publicDir: __dirname + '/public'
}, function(err) {
	if (err) {
		console.error(err);
	}
	else {
		console.log('Done!');
	}
});
```


## Tests

Install devDependencies and run `npm test`.


## License

Copyright (c) 2012 Chris Jaure  
Licensed under the MIT license.
