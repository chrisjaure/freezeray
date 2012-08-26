var
	express = require('express'),
	http = require('http'),
	path = require('path'),

	app,
	server;

app = module.exports = express();

app.use(app.router);

app.get('/', function(req, res) {
	res.end('Test');
});

app.get('/test/', function(req, res) {
	res.end('Test2');
});

app.get('/test.html', function(req, res) {
	res.end('Test3');
});