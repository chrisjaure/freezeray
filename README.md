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


## Methods

### freezeray(app, options={}, callback)

`app` should be an Express app. Freezeray will manage the server so please don't start it.

`options` should be an object of any of the following:

- `publishDir`: 
Where do you want the static files to end up? Any existing files will be deleted.
*default: `'./publish'`*

- `publicDir`:
Directory containing assets that should be copied to `publishDir`.
*default: `'./public'`*

- `serverConfig`:
An object containing `hostname` and `port`.
*default: `{ hostname: 'localhost', port: '3456'}`*

- `verbose`:
Log what's happening.
*default: `false`*

`callback` will be called when it's done or there's an error.

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
