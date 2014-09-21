/*
 * DB Config
 */
var
	mongoose = require('mongoose'),
	db = mongoose.connection;
	
mongoose.connect('mongodb://localhost:27017/todos');
// Logging
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback () {});
exports.db = db;