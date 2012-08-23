var
	path = require('path'),
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

});