/*global define*/
define([
	'underscore',
	'backbone',
	'models/todo',
	'session'
], function (_, Backbone, Todo, session) {
	'use strict';

	var Todos = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Todo,
		url: "/todos",
		sort_key: "priority",

		// Filter down the list of all todo items that are finished.
		completed: function () {
			return this.filter(function (todo) {
				return todo.get('done');
			});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function () {
			return this.without.apply(this, this.completed());
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},
		
		comparator: function(a, b) {
		    // Assuming that the sort_key values can be compared with '>' and '<',
		    // modifying this to account for extra processing on the sort_key model
		    // attributes is fairly straight forward.
		    a = a.get(this.sort_key);
		    b = b.get(this.sort_key);
		    if (this.sort_key === "duedate") {
			    return a > b ?  1
			         : a < b ? -1
			         :          0;
		    } else if (this.sort_key === "priority") {
			    return a > b ?  -1
			         : a < b ? 1
			         :          0;
		    }
		} 
	});

	return new Todos();
});
