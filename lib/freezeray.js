var
	request = require('request'),
	http = require('http'),
	fs = require('fs'),
	async = require('async'),
	mkdirp = require('mkdirp'),
	ncp = require('ncp').ncp,
	rimraf = require('rimraf'),
	path = require('path'),
	url = require('url'),

	freezeray = module.exports = function (app, opts, done) {
		return new Freezeray(app, opts || {}, done || function() {});
	};

function Freezeray (app, opts, done) {

	var
		publishDir = opts.publishDir || './publish',
		publicDir = opts.publicDir || './public',
		routes = app.routes.get,
		server = http.createServer(app),
		serverConfig = opts.serverConfig || {
			protocol: 'http',
			hostname: 'localhost',
			port: 3456
		},
		requestUrl = url.format(serverConfig),
		verbose = opts.verbose || false;

	this.publicDir = publicDir;
	this.publishDir = publishDir;
	this.requestUrl = requestUrl;
	this.verbose = verbose;
	this.cb = done;
	this.server = server;

	async.series([

		this.cleanup.bind(this),

		function(next) {

			this.log('copying', publicDir);
			ncp(publicDir, publishDir, next);

		}.bind(this),

		function(next) {

			this.log('starting server on', serverConfig.hostname, serverConfig.port);
			server.listen(serverConfig.port, serverConfig.hostname, next);

		}.bind(this),

		function(next) {

			this.log('scraping pages...');
			async.forEachLimit(routes, 100, this.getPage.bind(this), function(err) {
				next(err);
			}.bind(this));

		}.bind(this)

	], function(err) {
		if (!err) {
			this.log('Done!');
		}
		this.done(err);
	}.bind(this));

}

Freezeray.prototype.cleanup = function (callback) {

	this.log('emptying', this.publishDir);

	async.series([

		async.apply(rimraf, this.publishDir),
		async.apply(fs.mkdir, this.publishDir)

	], function() {
		callback();
	});

};

Freezeray.prototype.getPage = function (route, callback) {

	var url = this.requestUrl + route.path;
	request.get(url, function(err, res, body) {
		if (!err) {
			this.writeFile(route.path, body, callback);
		}
		else {
			callback(err);
		}
	}.bind(this));

};

Freezeray.prototype.writeFile = function (filename, contents, callback) {

	var pubFilename = path.join(this.publishDir, filename);

	if (!path.extname(filename)) {
		pubFilename = path.join(pubFilename, 'index.html');
	}

	mkdirp(path.dirname(pubFilename), function() {
		this.log('writing', pubFilename);
		fs.writeFile(pubFilename, contents, callback);
	}.bind(this));

};

Freezeray.prototype.done = function(err) {

	try {
		this.server.close();
	} catch(e) {}
	this.cb(err);

};

Freezeray.prototype.log = function() {

	if (this.verbose) {
		console.log.apply(console, [].slice.call(arguments));
	}

};
