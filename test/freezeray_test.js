var
	path = require('path'),
	fs = require('fs'),
	assert = require('assert'),
	wrench = require('wrench'),
	freezeray = require('../'),
	app = require('./fixture/app'),
	config = {
		publishDir: path.join(__dirname, 'fixture', 'publish'),
		publicDir: path.join(__dirname, 'fixture', 'public')
	};

describe('freezeray', function() {


	it('should complete', function(done) {
		
		freezeray(app, config).on('done', function() {
			done();
		});

	});

	it('should copy the public directory', function() {

		assert(fs.existsSync(path.join(config.publishDir, 'test.css')));

	});

	it('should scrape the index page', function() {

		assert(fs.existsSync(path.join(config.publishDir, 'index.html')));

	});

	it('should create a folder and an index page if the path doesn\'t include an extension', function() {

		assert(fs.existsSync(path.join(config.publishDir, 'test', 'index.html')));

	});

	after(function() {
		if (fs.existsSync(config.publishDir)) {
			wrench.rmdirSyncRecursive(config.publishDir);
		}
	});

});