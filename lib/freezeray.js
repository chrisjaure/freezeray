var request = require('request'),
	http = require('http'),
	fs = require('fs'),
	async = require('async'),
	wrench = require('wrench'),
	path = require('path'),
	url = require('url'),
	inherits = require('util').inherits,
	EventEmitter = require('events').EventEmitter;

module.exports = freezeray;

function freezeray(app, opts) {
	return new Freezeray(app, opts);
}

inherits(Freezeray, EventEmitter);

function Freezeray (app, opts) {
	
	opts = opts || {};
	
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

	// clean up before starting
	if (fs.existsSync(publishDir)) {
		wrench.rmdirSyncRecursive(publishDir);
	}
	fs.mkdirSync(publishDir);

	// copy assets
	this.log('copying', publicDir);
	wrench.copyDirSyncRecursive(publicDir, publishDir);

	server.listen(serverConfig.port, serverConfig.hostname, function() {
		// get all the pages
		this.log('scraping pages...');
		async.forEachLimit(routes, 100, this.getPage.bind(this), function(err) {
			if (!err) {
				this.log('Done!');
				this.emit('done');
			}
			else {
				console.error(err);
			}
			server.close();
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

	wrench.mkdirSyncRecursive(path.dirname(pubFilename));
	this.log('writing', pubFilename);
	fs.writeFile(pubFilename, contents, callback);

};

Freezeray.prototype.log = function() {

	if (this.verbose) {
		console.log.apply(console, [].slice.call(arguments, 0));
	}

};