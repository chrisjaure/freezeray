var
	request = require('request'),
	http = require('http'),
	fs = require('fs'),
	async = require('async'),
	wrench = require('wrench'),
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
			port: 50505
		},
		requestUrl = url.format(serverConfig),
		verbose = opts.verbose || false;

	this.publicDir = publicDir;
	this.publishDir = publishDir;
	this.requestUrl = requestUrl;
	this.verbose = verbose;
	this.cb = done;
	this.server = server;

	// clean up before starting
	if (fs.existsSync(publishDir)) {
		wrench.rmdirSyncRecursive(publishDir);
	}
	fs.mkdirSync(publishDir);

	// copy assets
	this.log('copying', publicDir);
	try {
		wrench.copyDirSyncRecursive(publicDir, publishDir);
	}
	catch (err) {
		this.done(err);
		return;
	}

	server.listen(serverConfig.port, serverConfig.hostname, function() {
		// get all the pages
		this.log('scraping pages...');
		async.forEachLimit(routes, 100, this.getPage.bind(this), function(err) {
			if (!err) {
				this.log('Done!');
			}
			this.done(err);
		}.bind(this));
	}.bind(this));

}

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

	try {
		wrench.mkdirSyncRecursive(path.dirname(pubFilename));
	}
	catch(err) {
		this.done(err);
		return;
	}
	this.log('writing', pubFilename);
	fs.writeFile(pubFilename, contents, callback);

};

Freezeray.prototype.done = function(err) {

	this.cb(err);
	try {
		this.server.close();
	} catch(err) {}

};

Freezeray.prototype.log = function() {

	if (this.verbose) {
		console.log.apply(console, [].slice.call(arguments));
	}

};
