angular.module('goalService', [])

.factory('Goal', ["$http", function($http) {

	// create goal object

	var goalFactory = {};

	// get single goal

	goalFactory.get = function(id) {

		return $http.get('/api/goals/' + id);
	};

	// get all goals

	goalFactory.all = function() {

		return $http.get('/api/goals/');
	};

	// create a goal

	goalFactory.create = function(goalData) {

		return $http.post('api/goals/', goalData);
	};

	 // update a goal
	goalFactory.update = function(id, goalData) { 

		return $http.put('/api/goals/' + id, goalData);
	};


	// delete a goal

	goalFactory.delete = function(id) { 

		return $http.delete('/api/goals/' + id);
	};

	// return our entire goalFactory object
	return goalFactory;

}]);



