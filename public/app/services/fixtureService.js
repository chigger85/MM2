angular.module('fixtureService', [])

.factory('Fixture', ["$http", function($http) {

	// create fixture object

	var fixtureFactory = {};

	// get single fixture

	fixtureFactory.get = function(id) {

		return $http.get('/api/fixtures/' + id);
	};

	// get all fixtures

	fixtureFactory.all = function() {

		return $http.get('/api/fixtures/');
	};

	// create a fixture

	fixtureFactory.create = function(fixtureData) {

		return $http.post('api/fixtures/', fixtureData);
	};

	 // update a fixture
	fixtureFactory.update = function(id, fixtureData) { 

		return $http.put('/api/fixtures/' + id, fixtureData);
	};


	// delete a fixture

	fixtureFactory.delete = function(id) { 

		return $http.delete('/api/fixtures/' + id);
	};

	// return our entire fixtureFactory object
	return fixtureFactory;

}]);


