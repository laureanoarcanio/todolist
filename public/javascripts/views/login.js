define([
	'zepto',
	'underscore',
	'hogan',
	'backbone',
	'text!templates/login.html',
	'session'
], function($, _, Hogan, Backbone, template, session) {
	'use strict';

	var Login = Backbone.View.extend({
	  tagName: "div",
	  className: "login",
	  tmpl: template,
	  events: {
	    "submit form": "login",
	  },

	  login: function() {
	  	session.login({
	  		username: this.$("#username").val().trim(),
	  		password: this.$("#password").val().trim()
	  	});
	    return false;
	  },
	  
	  render: function() {
	    var template = Hogan.compile(this.tmpl, {});
	    this.$el.html(template.render());
	    $("[component=layout]").html(this.$el);
	    return this;
	  }
	});

	var login = new Login();

	return login;
});