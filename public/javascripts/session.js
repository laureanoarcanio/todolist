define([
	'zepto',
	'collections/users'
], function($, Users) {
	'use strict';
	var Session = Users.extend({
		url: "/user",
		user: null,

		initialize: function() {
			this.on("sync", function() {
				this.user = this.getUserData();
			})
		},

		getUserData: function() {
			return this.at(0).toJSON();
		},

		login: function(credentials) {
			var that = this;
		    $.ajax({
		      url: '/login',
		      type: 'POST',
		      data: {
		        username: credentials.username, 
		        password: credentials.password
		      },
		      success: function(data) {
		        that.add(data);
		        // this avoids using router.navigate here and delegates that to router itself
		        that.trigger("sync");
		      },
		      error: function(xhr) {
		        if (xhr.status === 401) {
		          // should render an error page
		        }
		      }
		    });
		},

		logout: function() {
			this.reset();
			$.ajax({
				url: '/logout',
				type: 'GET'
			});
			return false;
		}
		
	});

	var session = new Session();
	return session;
});