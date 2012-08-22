var request = require('request'),
	fs = require('fs'),
	async = require('async'),
	wrench = require('wrench'),
	path = require('path'),
	url = require('url'),
	inherits = require('util').inherits,
	EventEmitter = require('events').EventEmitter;

module.exports = freezeray;

function freezeray(opts) {
	return new Freezeray(opts);
}

inherits(Freezeray, EventEmitter);

function Freezeray (opts) {
	
	opts = opts || {};
	
	var
		publishDir = opts.publishDir,
		publicDir = opts.publicDir,
		server = opts.server,
		routes = opts.routes,
		address = opts.server.address(),
		requestUrl = url.format({
			protocol: 'http',
			hostname: address.address,
			port: address.port
		});

	this.publicDir = publicDir;
	this.publishDir = publishDir;
	this.requestUrl = requestUrl;

	// clean up before starting
	if (fs.existsSync(publishDir)) {
		wrench.rmdirSyncRecursive(publishDir);
	}
	fs.mkdirSync(publishDir);

	// copy assets
	console.log('copying', publicDir);
	wrench.copyDirSyncRecursive(publicDir, publishDir);

	server.on('listening', function(){
		// get all the pages
		console.log('scraping pages...');
		async.forEachLimit(routes, 100, this.getPage.bind(this), function(err) {
			if (!err) {
				console.log('Done!');
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
	console.log('writing', pubFilename);
	fs.writeFile(pubFilename, contents, callback);

};