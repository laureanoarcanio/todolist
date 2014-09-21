var restClient = (function() {

	function request(params) {
		$.ajax(params);
	}
	return {
		login: function(user, password) {
			request({
				url: '/login',
				type: 'POST',
				data: {
					username: user, 
					password: password
				},
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
		logout: function() {
			request({
				url: '/logout',
				type: 'GET',
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
		users: function(username) {
			username = (username) ? "/" + username : "";
			request({
				url: '/users' + username,
				type: 'GET',
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
		user: function() {
			request({
				url: '/user',
				type: 'GET',
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
		addUser: function(user) {
			request({
				url: '/users',
				type: 'POST',
				data: user,
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
		populate: function() {
			request({
				url: '/populate',
				type: 'get',
				complete: function(xhr, status) {
					console.log(xhr, status);
				}
			});
		},
	}
})();