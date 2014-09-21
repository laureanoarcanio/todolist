/*
 * Models
 */
var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// User Model
var userSchema = new Schema({
    username: String,
    password: String,
    email: String
}); 

// Todo Model
todoSchema = new Schema({
	_user: {type: ObjectId, ref: 'User'},
	title: String,
	priority: Number,
	date: {type: Date, default: new Date},
	duedate: Date,
	done: {type: Boolean, default: false}
});

var User = mongoose.model('User', userSchema);
var Todo = mongoose.model('Todo', todoSchema);

exports.User = User;
exports.Todo = Todo;