define([
	'zepto',
	'underscore',
	'hogan',
	'backbone',
	'text!templates/todo.html'
], function($, _, Hogan, Backbone, template) {
	'use strict';

	var Todo = Backbone.View.extend({
	  tagName: "li",
	  className: "todo",
	  tmpl: template,
	  importanceLevels: ["normal", "relevant", "urgent"],
	  
	  events: {
	  	"click .importance": "togglePriority",
	  	"click .toggle": "toggleStatus",
	  	"click .title-label": "toggleTitle",
	  	"change .duedate": "updateDuedate",
	  	"blur .title-input": "updateTitle",
	  	"click .remove": "clear"
	  },

	  initialize: function() {
	  	this.listenTo(this.model, "change", this.render);
	  	this.listenTo(this.model, 'destroy', this.remove);
	  },

	  dateDiffInDays: function(a, b) {
		var _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// a and b are javascript Date objects
		// Discard the time and time-zone information.
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	  },

	  render: function() {
	    var template = Hogan.compile(this.tmpl, {});
	    var dueIn = this.dateDiffInDays(new Date(), new Date(this.model.get('duedate')));
	    var rawData = this.model.toJSON();
	    rawData.priority = this.importanceLevels[rawData.priority - 1];
	    this.$el.html(template.render({todo: rawData}));
	    
	    // in case it's overdue
	    if (dueIn < 1) {
	    	dueIn = 0;
	    } 
	    // test for the option being present in the select
	    if (this.$(".duedate option[value='" + dueIn + "']").length) {
	    	this.$('.duedate').val(dueIn);
	    } else {
	    	this.$('.duedate').append("<option selected='selected' value='"+ dueIn +"'> due in "+ dueIn +" days</option>");
	    }

	    return this;
	  },

	  togglePriority: function(e) {
		var 
			$el = $(e.target),
			currStatus = this.importanceLevels.indexOf($el.attr("data-value")),
			nextStatus = 0;

		if (currStatus + 1 < this.importanceLevels.length) {
			nextStatus = currStatus + 1;
		}
		$el.attr("data-value", this.importanceLevels[nextStatus]);
		this.model.set('priority', nextStatus + 1).save();
	  },

	  toggleStatus: function() {
	  	this.model.toggle();
	  },

	  toggleTitle: function() {
	  	var $input = this.$(".title-input").toggleClass("hidden");
	  	var $title = this.$(".title-label").toggleClass("hidden");

	  	if (!$input.hasClass('hidden')) {
	  		$input.focus();
	  		$input.val($title.html());
	  	}
	  },

		updateTitle: function() {
			var value = this.$('.title-input').val();
			var trimmedValue = value.trim();

			if (trimmedValue) {
				if (trimmedValue !== this.$('.title-label').html().trim()) {
					this.model.save({ title: trimmedValue });
					if (value !== trimmedValue) {
						// Model values changes consisting of whitespaces only are not causing change to be triggered
						// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
						// And if yes, we've to trigger change event ourselves
						this.model.trigger('change');
					} 
				} else {
					this.toggleTitle();
				}
			} else {
				this.clear();
			}
		},

		updateDuedate: function() {
			var days = this.$(".duedate").val();
			var dueDate = new Date();
			dueDate.setDate( dueDate.getDate() + (+days));
			this.model.set('duedate', dueDate).save();
		},
		
		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}

	});

	return Todo;
});