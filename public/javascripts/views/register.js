

define([
  'zepto',
  'underscore',
  'hogan',
  'backbone',
  'text!templates/register.html',
  'collections/users'
], function($, _, Hogan, Backbone, template, Users) {
  'use strict';

  var Register = Backbone.View.extend({
    tagName: "div",
    tmpl: template,
    users: new Users(),
    events: {
      "submit form": "register",
    },
    register: function() {
      this.users.create({
        username: this.$("#username").val().trim(), 
        password: this.$("#password").val().trim(),
        email: this.$("#email").val(),
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

  var register = new Register();

  return register;
});