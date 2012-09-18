var
	path = require('path'),
	fs = require('fs'),
	assert = require('assert'),
	rimraf = require('rimraf'),
	clone = require('clone'),
	freezeray = require('../'),
	app = require('./fixture/app'),
	config = {
		publishDir: path.join(__dirname, 'fixture', 'publish'),
		publicDir: path.join(__dirname, 'fixture', 'public')
	};

describe('freezeray', function() {


	it('should complete', function(done) {
		
		freezeray(app, config, function() {
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

	it('shouldn\'t create a folder id the path includes an extension', function() {

		assert(fs.existsSync(path.join(config.publishDir, 'test.html')));

	});

	it('should be verbose when requested', function(done) {

		var oldWrite = process.stdout.write,
			output = '',
			verboseConfig = clone(config);

		process.stdout.write = function(string, encoding, fd) {
			output += string;
		};

		verboseConfig.verbose = true;
		freezeray(app, verboseConfig, function() {
			process.stdout.write = oldWrite;
			assert(output !== '');
			done();
		});

	});

	it('should error', function(done) {

		freezeray(app, null, function(err) {
			assert(err);
			done();
		});

	});

	after(function(done) {
		rimraf(config.publishDir, done);
	});

});