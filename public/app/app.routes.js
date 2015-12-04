angular.module('app.routes', ['ngRoute']) 

.config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  
  	$routeProvider
    // home page route
    .when('/', {
      templateUrl : 'app/views/pages/home.html'
    })
    // get rid of the hash in the URL

  	


	// login page
	.when('/login', {
	    templateUrl : 'app/views/pages/login.html',
	    controller  : 'mainController',
	    controllerAs: 'login'

	  })

		// show all users
	.when('/users', {
	  templateUrl: 'app/views/pages/users/all.html',
	  controller: 'userController',
	  controllerAs: 'user'
	})

	// form to create a new user // same view as edit page 
	.when('/users/create', {
	  templateUrl: 'app/views/pages/users/single.html',
	  controller: 'userCreateController',
	  controllerAs: 'user'
	})



		//pagetoeditauser
	.when('/users/:user_id', {
	  templateUrl: 'app/views/pages/users/single.html',
	  controller: 'userEditController',
	  controllerAs: 'user'
	})

		//pagetoview fixtures
	.when('/availability', {
	  templateUrl: 'app/views/pages/users/availability2.html',
	  controller: 'fixtureController',
	  controllerAs: 'fixture'
	})


			//page to create fixtures
	.when('/availability/create', {
	  templateUrl: 'app/views/pages/users/createFixture.html',
	  controller: 'fixtureCreateController',
	  controllerAs: 'fixture'
	})


				//page to editfixtures
	.when('/availability/:fixture_id', {
	  templateUrl: 'app/views/pages/users/fixture.html',
	  controller: 'fixtureEditController',
	  controllerAs: 'fixture'
	})

				//page to editfixtures
	.when('/afc_match_centre', {
	  templateUrl: 'app/views/pages/users/league.html',
	  controller: 'fixtureEditController',
	  controllerAs: 'fixture'
	});





	$locationProvider.html5Mode(true); 


}]);
