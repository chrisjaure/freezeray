process.env.NODE_ENV = 'staging';

var request = require('request'),
	fs = require('fs'),
	async = require('async'),
	wrench = require('wrench'),
	path = require('path'),

	publishDir,
	publicDir,
	server,
	routes,
	requestUrl;

module.exports = freezeray;

function freezeray (opts) {
	
	opts = opts || {};
	publishDir = path.join(process.cwd(), opts.publishDir);
	publicDir = path.join(process.cwd(), opts.publicDir);
	server = opts.server;
	routes = opts.routes;
	requestUrl = opts.requestUrl;

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
		async.forEachLimit(routes, 100, getPage, function(err) {
			if (!err) {
				console.log('Done!');
			}
			else {
				console.error(err);
			}
			server.close();
		});
	});

}

function getPage (route, callback) {

	var url = requestUrl + route.path;
	request.get(url, function(err, res, body) {
		if (!err) {
			writeFile(route.path, body, callback);
		}
		else {
			callback(err);
		}
	});

}

function writeFile (filename, contents, callback) {

	var pubFilename = path.join(publishDir, filename);

	if (!path.extname(filename)) {
		pubFilename = path.join(pubFilename, 'index.html');
	}

	wrench.mkdirSyncRecursive(path.dirname(pubFilename));
	console.log('writing', pubFilename);
	fs.writeFile(pubFilename, contents, callback);

}