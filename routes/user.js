
/*
 * GET users listing.
 */
var models = require('../models/models');

exports.users = function(req, res){
	// username present then get an specific user
	if (req.params.username) {
		  models.User.findOne({'username': req.params.username })
		  .select("-password")
		  .exec(function (err, user) {
		    if (err) {
		      // andle error
		    } else {
				if (!user) {
					res.status(404).json({error: err.toString()});
				} else {
					delete user.password;
					res.json(user);
				}
			}
		  });
	} else {
		models.User
		    .find()
		    .select("-password")
		    .lean()
		    .exec(function(err, users) {
				if (err) {
						res.status(404).json({error: err.toString()});
				} else {
					users = users || [];
					res.json(users);
				}
		    });
	}
};

exports.createUser = function(req, res) {
	var newUser = new models.User(req.body);
	newUser.save(function(err, user) {
		if (err) {
			res.json({error: err.toString()})
		} else {
			res.json(user)
		}
	});
};

exports.getUserData = function(req, res) {
  if (req.user) {
    // TODO: do not pass password here
    res.json(req.user);
  } else {
    res.status(401).json({error: 'Not Authorized'});
  }
};