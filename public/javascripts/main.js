/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		zepto: {
			exports: "$"
		},
		backbone: {
			deps: [
				'underscore',
				'zepto'
			],
			exports: 'Backbone'
		},
		hogan: {
			exports: 'Hogan'
		}
	},
	paths: {
		zepto: 'vendor/zepto.min',
		underscore: 'vendor/underscore.min',
		backbone: 'vendor/backbone.min',
		text: 'vendor/text',
		hogan: 'vendor/hogan.min'
	}
});

require([
	'backbone',
	'zepto',
	'routers/router',
	'session'
], function (Backbone, $, router, session) {
	// If request is not authorized go to login
	$(document).on('ajaxError', function(e, xhr) {
		if (xhr.status === 401) {
		    console.log("Not loged in");
		    router.navigate("/login", {trigger: true})
		}
	});
	session.fetch();
	Backbone.history.start();
});
