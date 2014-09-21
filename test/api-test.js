
var request = require('request'),
    vows = require('vows'),
    assert = require('assert'),
    apiUrl = "http://localhost:3000/",
    cookie = null,
	todo = {
		done: false,
		duedate: "2014-01-22T18:03:57.144Z",
		priority: 1,
		title: "Test todo item"
	},
	todoId = null;
 
 
var apiTest = {
  general: function( method, url, data, cb ){
    //console.log( 'cb?', cb )
    request(
      {
        method: method,
        url: apiUrl+(url||''),
        json: data || {},
        headers: {Cookie: cookie}
      },
      function(req, res){
        cb( res )
      }
    )
  },
  get: function( url, data, cb  ){ apiTest.general( 'GET', url, data, cb    )  },
  post: function( url, data, cb ){ apiTest.general( 'POST', url, data, cb   )  },
  put: function( url, data, cb  ){ apiTest.general( 'PUT', url, data, cb    )  },
  del: function( url, data, cb  ){ apiTest.general( 'DELETE', url, data, cb )  }
}
 
function assertStatus(code) {
  return function (res, b, c) {
    assert.equal(res.statusCode, code);
  };
}
 
function assertJSONHead(){
  return function(res, b, c ){
    assert.equal( res.headers['content-type'], 'application/json; charset=utf-8' )
  }
}
 
function assertValidJSON(){
  return function(res, b ){
    // this can either be a Object or Array
    assert.ok( typeof( res.body ) == 'object' )
    //assert.isObject( res.body)
  }
}

// TODO include unauthed tests
var suite = vows.describe('API Localhost HTTP Authenticated Tests')
 
// Very first test!
.addBatch({
  "Server should be UP as in: var apiUrl": {
    topic: function(){
      apiTest.get('', {} ,this.callback )
    },
 
    '/ should repond something' : function(res, b){
      assert.ok(res.body)
    }
  }
})
.addBatch({
  'User shouldnt be logged in': {
    topic: function(){
      apiTest.get('user', {}, this.callback)
    },
    'should be 401': assertStatus(401),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
  },
})
.addBatch({
  'Authenticate to /login': {
    topic: function(){
		apiTest.post("login", {username: 'laureano', password: '1234'}, this.callback);
    },
    'get a valid Cookie': function(req, res, body, err){
      try{
        cookie = req.headers['set-cookie'].pop().split(';')[0]
      } catch(e){ }
 
      assert.ok( typeof(cookie) == 'string' && cookie.length > 10 )
    }
  }
})
.addBatch({
  'Get user data': {
    topic: function(){
      apiTest.get('user', {}, this.callback)
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
  },
})
.addBatch({
  'Get todo list': {
    topic: function(){
      apiTest.get('todos', {}, this.callback)
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
  },
})
.addBatch({
	'Add a Todo item': {
		topic: function(){
			apiTest.post("todos", todo, this.callback);
		},
		'should be 200': assertStatus(200),
		'should be persisted in DB': function(res, b ){
			todoId = res.body._id;
			assert.equal(todo.title, res.body.title);
			assert.equal(!!todo.done, !!res.body.done);
			assert.equal(todo.priority, res.body.priority);
			assert.equal(todo.duedate, res.body.duedate);
		}
	}
})
.addBatch({
	'Delete a Todo item': {
		topic: function(){
			apiTest.del("todos/" + todoId, {}, this.callback);
		},
		'should be 200': assertStatus(200)
	}
})

.addBatch({
	'Logout user': {
		topic: function(){
			apiTest.get("logout", {}, this.callback);
		},
		'should be 200': assertStatus(200)
	}
})
suite.export(module);