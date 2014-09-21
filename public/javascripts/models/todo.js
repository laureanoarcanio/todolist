/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Todo = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		idAttribute: "_id",
		defaults: {
			title: '',
			done: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				done: !this.get('done')
			});
		}
	});

	return Todo;
});
