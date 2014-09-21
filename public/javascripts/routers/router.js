/*global define*/
define([
	'zepto',
	'backbone',
	'session',
	'views/login',
	'views/register',
	'views/app'
], function ($, Backbone, session, loginView, registerView, appView) {
	'use strict';

	var Routes = Backbone.Router.extend({
		routes: {
			"todos": "todos",
			"login": "login",
			"logout": "logout",
			"register": "register"
		},
		initialize: function() {
			this.listenTo(session, "sync", function() {
				this.navigate("/todos", {trigger: true});
			});
			this.listenTo(registerView.users, "sync", function() {
				this.navigate("/login", {trigger: true});
			});
		},
		todos: function() {
			// test if it's logged in
			if (session.length) {
				appView.render();
			} else {
				this.navigate("/login", {trigger: true});
			}
		},
		login: function(){
			loginView.render();
		},
		logout: function() {
			session.logout();
			this.navigate("/login", {trigger: true});
		},
		register: function(){
			registerView.render();
		},
	});
	var router = new Routes();
	return router;
});
