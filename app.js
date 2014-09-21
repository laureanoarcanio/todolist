
/**
 * Module dependencies.
 */

var 
	express = require('express'),
	http = require('http'),
	path = require('path'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
  db = require('./config/db'),
  userRoutes = require('./routes/user'),
  todosRoutes = require('./routes/todos'),
  models = require('./models/models'),

// PASSPORT CONFIG
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function (err, user) {
    if (err) {
      done(new Error('User ' + id + ' does not exist'));
    } else {
      done(err, user);
    }
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      models.User.findOne({'username': username }, function (err, user) {
        if (err) {
          return done(err);
        } 
        if (!user) {
          return done(null, false, { message: 'Unknown user ' + username });
        }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

var app = express();

// EXPRESS CONFIG
app.set('port', process.env.PORT || 3000);
app.use(express.compress())
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('thisismysecret'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public')));
// Use the public HTML
app.use("/", express.static(path.join(__dirname, 'public', "index.html")));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ROUTES / RESOURCES

// only to test if it's logged in
// browserless clients can use it to get the Cookie
// read the test/api-test.js for example
app.get("/user", userRoutes.getUserData);
app.get('/users', requireAuth,  userRoutes.users);
app.get('/users/:username', requireAuth,  userRoutes.users);
app.post('/users', userRoutes.createUser)

// Todos
app.get('/todos', requireAuth, todosRoutes.todos)
app.post('/todos', requireAuth, todosRoutes.addTodo)
app.put('/todos/:id', requireAuth, todosRoutes.updateTodo)
app.delete('/todos/:id', requireAuth, todosRoutes.deleteTodo)

// Credentials
app.post('/login',  passport.authenticate('local'), function(req, res) {
    // just to avoid sending credentials in response
    var user = {
      username: req.user.username,
      email: req.user.email
    };
    res.json(user);
  }
);
app.get('/logout', function(req, res){
  req.logout();
  res.json({status: 'Logged out'});
});

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401).json({error: 'Not Authorized'});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});