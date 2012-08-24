var
	path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	chai = require('chai'),
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

	after(function() {
		if (fs.existsSync(config.publishDir)) {
			wrench.rmdirSyncRecursive(config.publishDir);
		}
	});

});