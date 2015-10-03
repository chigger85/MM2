angular.module('fixtureAttendService', [])

.factory('FixtureAttend', ["$http", function($http) {

	// create fixture object

	var fixtureFactory = {};

	fixtureFactory.getAttendance= function(fixture_id) {

		return $http.get('/api/fixtures/'+fixture_id+'/availability')

	}

	fixtureFactory.addAttendance= function(fixture_id) {

		return $http.put('/api/fixtures/'+fixture_id+'/yes')

	}

	fixtureFactory.removeAttendance= function(fixture_id) {

		return $http.put('/api/fixtures/'+fixture_id+'/no')

	}


	// return our entire fixtureFactory object
	return fixtureFactory;

}]);



