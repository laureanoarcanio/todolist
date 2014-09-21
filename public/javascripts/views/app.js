define([
	'zepto',
	'underscore',
	'hogan',
	'backbone',
	'text!templates/app.html',
	'collections/todos',
	'views/todo'
], function($, _, Hogan, Backbone, template, todosCollection, TodoView) {
	'use strict';

	var App = Backbone.View.extend({
		tagName: "div",
		tmpl: template,
		importanceLevels: ["normal", "relevant", "urgent"],

		events: {
			"submit form": "createOne",
			"click .new-todo .importance": "changeImportance",
			"click #sortby-priority": "prioritySort",
			"click #sortby-duedate": "duedateSort"
		},
		initialize: function() {
			this.listenTo(todosCollection, "add", this.addOne);
			this.listenTo(todosCollection, 'sync', this.addAll);
			this.listenTo(todosCollection, 'sort', this.addAll);
		},

		getFormData: function() {
			var dueDate = new Date();
			dueDate.setDate( dueDate.getDate() + (+this.$("#duedate").val()));
			return {
				title: this.$("#title").val().trim(),
				priority: this.importanceLevels.indexOf(this.$("#priority").attr("data-value")) + 1,
				duedate: dueDate,
				done: false
			};
		},

		clearAddForm: function() {
			 this.$("#title").val("");
			 this.$("#priority").attr("data-value", "normal");
			 this.$("#duedate").val("1");
		},

		createOne: function(e) {
			var todo = this.getFormData();
			todosCollection.create(todo);
			todosCollection.sort();
			this.clearAddForm();
			return false;
		},

		render: function() {
			var template = Hogan.compile(this.tmpl, {});
			this.$el.html(template.render());
			$("[component=layout]").html(this.$el);
			todosCollection.fetch();
			return this;
		},

		addOne: function (todo) {
			var view = new TodoView({ model: todo });
			this.$('#todos-list').append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$('#todos-list').html('');
			todosCollection.each(this.addOne, this);
		},

		changeImportance: function(e) {
			var 
				$el = $(e.target),
				currStatus = this.importanceLevels.indexOf($el.attr("data-value")),
				nextStatus = 0;

			if (currStatus + 1 < this.importanceLevels.length) {
				nextStatus = currStatus + 1;
			}
			$el.attr("data-value", this.importanceLevels[nextStatus]);
		},

		prioritySort: function() {
			todosCollection.sort_key = "priority";
			todosCollection.sort();
			return false;
		},

		duedateSort: function() {
			todosCollection.sort_key = "duedate";
			todosCollection.sort();
			return false;
		}
	});

	var todos = new App();
	return todos;
});