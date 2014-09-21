
/*
 * GET todos listing.
 */
models = require('../models/models');

exports.todos = function(req, res) {
	// user id
	var _id = req.session.passport.user;
	models.Todo
		.find({_user: _id})
		.sort('-priority')
		.exec(function(err, todos) {
			if (err) {
				res.status(404).json({error: err.toString()});
			} else {
				res.json(todos);
			}
		});
};

exports.addTodo = function(req, res) {
	var _id = req.session.passport.user;
	var todo = new models.Todo(req.body);
	todo._user = _id;
	todo.save(function(err, todo) {
		if (err) {
			res.json({error: err.toString()});
		} else {
			res.json(todo);
		}
	});
};

exports.updateTodo = function(req, res) {
	var _id = req.session.passport.user;
	models.Todo.findOne({_user: _id, _id: req.params.id}).exec(function(err, todo) {
		todo
			// Should do some validation
			.set('title', req.body.title)
			.set('priority', req.body.priority)
			.set('duedate', req.body.duedate)
			.set('done', req.body.done || false)
			.save(function(err, todo) {
				if (err) {
					res.json({error: err.toString()});
				} else {
					res.json(todo);
				}
			});
	});
};

exports.deleteTodo = function(req, res) {
	var _id = req.session.passport.user;
	models.Todo.findOne({_user: _id, _id: req.params.id}).remove(function(err, todo) {
		if (err) {
			res.json({error: err.toString()});
		} else {
			res.json(todo);
		}
	});
};