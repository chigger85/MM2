angular.module('userApp', [
  'ngAnimate',
  'ui.bootstrap',
  'app.routes',
  'authService',
  'mainCtrl',
  'userCtrl',
  'fixtureCtrl',
  'userService',
  'fixtureService',
  'fixtureAttendService',
  'goalService'
  
])

// application configuration to integrate token into requests
.config(function($httpProvider) {
// attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');
});

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
	});




	$locationProvider.html5Mode(true); 


}]);

angular.module('mainCtrl', ['ui.bootstrap'])

.controller('mainController', ["$rootScope", "$location", "Auth", function($rootScope, $location, Auth) {

	var vm = this;

	//get info if person logged in

	//	vm.loggedIn = Auth.isLoggedIn();


	//check to see if user is logged in on every request

	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		// get user information on route change

		Auth.getUser().then(function (data) {

     		vm.user = data.data;
     		console.log(vm.user);

		});
	})


	//function to handle login form

	vm.doLogin = function() {

		vm.processing = true;


		//call Auth.login function()

		// clear the error
    	vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)

			.success(function(data) {

				vm.processing = false;

				//if a user successfully logs in redirect to user page

				if (data.success)
					$location.path('/users')

				else
					vm.error = data.message;

			});

		};


		// function	to handle logging out

	vm.doLogout = function() {

		Auth.logout();
		vm.user = '';

		//reset all user info


		$location.path('/login');
	};

}]);










angular.module('userCtrl', ['userService'])

.controller('userController', ["$scope", "User", "Auth", "$route", "$log", "$modal", function($scope, User, Auth, $route, $log, $modal) {



   

    // set a processing variable to show loading things
	$scope.processing = true;
  // grab all the users at page load
	$scope.refresh = function() { 

			User.all().success(function(data) {
	      // when all the users come back, remove the processing variable
			$scope.processing = false;
	      // bind the users that come back to $scope.users
	    	 $scope.users = data;

    	});
	};

	$scope.refresh();





    // function to delete a user
	$scope.deleteUser = function(id) { 

		$scope.processing = true;
	  	// accepts the user id as a parameter
		User.delete(id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			User.all().success(function(data) { 

				$scope.processing = false; 
				$scope.users = data;
			});
		}); 

	};


	$scope.edit = function(id) {

        console.log(id);
        User.get(id).success(function(data) {
            $scope.userData = data;

            $scope.userData.dob = new Date($scope.userData.dob); 

        });

     };

	$scope.open_submit = function () {


    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalSubmitUser.html',
      controller: 'modalSubmitUser',	
      scope: $scope,
      size: 'lg',
     
      
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.open_edit = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalEditUser.html',
      controller: 'modalEditUser',
      scope: $scope,
      size: 'lg',
     

    	
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

   $scope.open_delete = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalDeleteUser.html',
      controller: 'modalDeleteUser',
      scope: $scope,

    	
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };


}])



.controller("modalSubmitUser", ["$scope","User", "$location", "$timeout", "$modalInstance", "$route",
function($scope,User, $location, $timeout, $modalInstance, $route) {

	// var vm = this;
	$scope.message = "User Created";
	$scope.type = 'create' ;
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    };

    $scope.addUser = function() {


    	$scope.processing = true;
		// clear the message

		$scope.message =  '';

		User.create($scope.userData).success(function(data) {

				$scope.processing = false;

				// clear the form

				$scope.userData = {};

				$scope.message = data.message;

		});

		$timeout(function(){
            
                   $location.path('/users')
              
            		}, 2000);

		

		};


      $scope.deselect = function() {

        $scope.userData = {};

    };




}])

.controller("modalEditUser", ["$scope","User", "$location", "$timeout", "$modalInstance", "$route",
function($scope, User, $location, $timeout, $modalInstance, $route) {

		// var vm = this;
	$scope.message = "User updated";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    };



    $scope.submit = function() {

        
        User.update($scope.userData._id, $scope.userData).success(function(data) {

        	$scope.processing = false;

				// clear the form

			$scope.userData = {};

			$scope.message = data.message; 
			console.log(data.message);
			$route.reload();

        });
    

    };

    $scope.deselect = function() {

        $scope.userData = "";
    }



}])

.controller("modalDeleteUser", ["$scope","User","$modalInstance", "$route",
function($scope,User,$modalInstance, $route) {

	$scope.message = "User deleted";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   	$scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



       // function to delete a user
	$scope.deleteUser = function() { 

		$scope.processing = true;
	  	// accepts the user id as a parameter
		User.delete($scope.userData._id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			User.all().success(function(data) { 

				$scope.processing = false; 
				$scope.fixtures = data;
			});

			$route.reload();
	
		}); 

	};

}])




.controller("userCreateController", ["$scope", "User", "$location", "$timeout", function($scope, User, $location, $timeout) {

	
	// variable to hide/show elements of view
	// differentiates between create and edit pages

	$scope.type = 'create' ;

	// function to create user

	$scope.saveUser = function() {

		$scope.processing = true;


		// clear the message

		$scope.message =  '';

		// use the userCreate function in the user Service

		User.create($scope.userData)
			.success(function(data) {

				$scope.processing = false;

				// clear the form

				$scope.userData = {};

				$scope.message = data.message;



			});

		$timeout(function(){
            
                   $location.path('/login')
              
            		}, 2000);

		

		};

}])


.controller("userEditController", ["User", "$routeParams","$location", "$timeout", function(User, $routeParams, $location, $timeout) {

	var $scope = this;

	// variable to hide/show elemnts of the view
	// differentiates between create and edit pages


	$scope.type = 'edit';

	

	// console.log($scope.date)

	// get the user data for the user you want to edit 
	// $routeParams is the way we grab data from the URL

	User.get($routeParams.user_id)
		.success(function(data) {

			$scope.userData = data;

			$scope.userData.dob = new Date($scope.userData.dob);  //need to instantiate dob as date object

		});

	//function to save user


	$scope.saveUser =  function() {

		$scope.processing = true;

		$scope.message = '';


		// call the userService function to update

		User.update($routeParams.user_id, $scope.userData)

			.success(function(data) {

				$scope.processing = false;


				//clear the form

				$scope.userData = {};

				//bind the message from our API to $scope.message

				$scope.message = data.message;


				

			});

			$timeout(function(){
            
                $location.path('/users')
              
            	}, 1000);

		

		};

}])




angular.module('fixtureCtrl', ['fixtureService', 'userService', 'authService', 'fixtureAttendService']) 	

.controller('fixtureController', [ "$scope","Fixture", "FixtureAttend", "Auth", "$location", "$route", "$modal", "$log", 
	function($scope, Fixture,  FixtureAttend, Auth, $location, $route, $modal, $log) {

	// var vm = this;


	    // set a processing variable to show loading things
	$scope.processing = true;

	// grab all the fixtures at page load

	$scope.refresh = function(){

	    Fixture.all().success(function(data) {
      // when all the fixtures come back, remove the processing variable
		$scope.processing = false;
      // bind the fixtures that come back to vm.fixtures
     	$scope.fixtures = data;


   	 });
	};

	$scope.refresh();
	


   Auth.getUser().then(function (data) {

     		$scope.user = data.data

	});




	$scope.edit = function(id) {

        console.log(id);
        Fixture.get(id).success(function(data) {
            $scope.fixtureData = data;

            $scope.fixtureData.date = new Date($scope.fixtureData.date); 

        });

     };




	$scope.getAttend = function(id) {

		FixtureAttend.getAttendance(id).success(function(data) {

			$scope.attData = data;
			
			console.log($scope.user);


		})
	}


	// Fixture.all().success(function(data) {

	// 	$scope.availables = data[0].available;
	// 	if ($scope.availables.indexOf($scope.user.id) > -1) {

	// 		$scope.attending = true;
	// 	}

	// 	else {

	// 		$scope.attending = false;
	// 	}
	// });

	

	$scope.removeAttend = function(id) {

		 FixtureAttend.removeAttendance(id).success(function(data) {

		 	$scope.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		$scope.attData = data;
		 		console.log(data);
		 		console.log($scope.user.id);
		 		$scope.refresh();
		 		


		 	});

		 	

		 
		});

		 


	};



	$scope.addAttend = function(id) {

		 FixtureAttend.addAttendance(id).success(function(data) {

		 	$scope.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		$scope.attData = data;
		 		console.log(data);
		 		console.log($scope.user.id);
		 		$scope.refresh();	
		 	});




		 });

		 


	};



  $scope.open_submit = function () {

  	$scope.fixtureData = "";

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalSubmitFixture.html',
      controller: 'modalSubmitFixture',	
      scope: $scope,

     
      
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.open_edit = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalEditFixture.html',
      controller: 'modalEditFixture',
      scope: $scope,

    	
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

   $scope.open_delete = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalDeleteFixture.html',
      controller: 'modalDeleteFixture',
      scope: $scope,

    	
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };



}])

.controller("modalSubmitFixture", ["$scope","Fixture","$modalInstance", "$route",
function($scope, Fixture, $modalInstance, $route) {

	// var vm = this;
	$scope.message = "Fixture created";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    };

    $scope.addFixture = function() {

    	$scope.processing = true;

    	$scope.message =  '';

    	


       	Fixture.create($scope.fixtureData).success(function(data) {

				$scope.processing = false;

				// clear the form

				$scope.fixtureData = {};

				$scope.message = data.message;

				$scope.fixtureData = '';

			});
    
      };

      $scope.deselect = function() {

        $scope.fixtureData = {};
    }




}])

.controller("modalEditFixture", ["$scope","Fixture", "$modalInstance", "$route",
function($scope,Fixture, $modalInstance, $route) {

	// var vm = this;
	$scope.message = "Fixture updated";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    };



    $scope.submit = function() {

        
        Fixture.update($scope.fixtureData._id, $scope.fixtureData).success(function(data) {

        	$scope.processing = false;

				// clear the form

			$scope.fixtureData = {};

			$scope.message = data.message; 
			console.log(data.message);
			$route.reload();

        });
    

    };

    $scope.deselect = function() {

        $scope.fixtureData = "";
    }



}])

.controller("modalDeleteFixture", ["$scope","Fixture","$modalInstance", "$route",
function($scope,Fixture,$modalInstance, $route) {

	$scope.message = "Fixture created";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   	$scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



       // function to delete a user
	$scope.deleteFixture = function() { 

		$scope.processing = true;
	  	// accepts the user id as a parameter
		Fixture.delete($scope.fixtureData._id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			Fixture.all().success(function(data) { 

				$scope.processing = false; 
				$scope.fixtures = data;
			});

			$route.reload();
	
		}); 

	};

}])


// .controller("fixtureCreateController", ["Fixture", "$location", "$timeout", function(Fixture, $location, $timeout) {

// 	var vm = this;

// 	// variable to hide/show elements of view
// 	// differentiates between create and edit pages

// 	vm.type = 'create' ;

// 	// function to create user


// 	vm.saveFixture = function() {

// 		vm.processing = true;


// 		// clear the message

// 		vm.message =  '';

// 		// use the userCreate function in the user Service

// 		Fixture.create(vm.fixtureData)
// 			.success(function(data) {

// 				vm.processing = false;

// 				// clear the form

// 				vm.fixtureData = {};

// 				vm.message = data.message;



// 			});

// 		$timeout(function(){
            
//                    $location.path('/availability')
              
//             		}, 1000);

		

// 		};		

// }])


// .controller("fixtureEditController", ["Fixture", "$routeParams", function(Fixture, $routeParams) {

// 	var vm = this;

// 	// variable to hide/show elemnts of the view
// 	// differentiates between create and edit pages


// 	vm.type = 'edit';

	

// 	// console.log(vm.date)

// 	// get the user data for the user you want to edit 
// 	// $routeParams is the way we grab data from the URL

// 	Fixture.get($routeParams.fixture_id)
// 		.success(function(data) {

// 			vm.fixtureData = data;

// 			vm.fixtureData.date = new Date(vm.fixtureData.date);  //need to re-instantiate dob as date object

// 		});

// 	//function to save user


// 	vm.saveFixture =  function() {

// 		vm.processing = true;

// 		vm.message = '';


// 		// call the fixtureService function to update

// 		Fixture.update($routeParams.fixture_id, vm.fixtureData)

// 			.success(function(data) {

// 				vm.processing = false;


// 				//clear the form

// 				vm.fixtureData = {};

// 				//bind the message from our API to vm.message

// 				vm.message = data.message;

// 			});

// 		}



// }])







angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================


.factory('Auth', ["$http", "$q", "AuthToken", function($http, $q, AuthToken) {


	//create auth factory object

	var authFactory = {};	

	//log a user in

	authFactory.login = function(username, password) {

		// return the promise object and its data
		return $http.post('/api/authenticate', { 
			username: username,
			password: password
		})
			.success(function(data) {

			    AuthToken.setToken(data.token);
				return data; 

			});
		};

	authFactory.createLogin = function(username, password) {

		// return the promise object and its data
		return $http.post('/api/authenticate', { 
			username: username,
			password: password
		})
			.success(function(data) {

			    AuthToken.setToken(data.token);
				return data; 

			});
		};


	// log a user out by clearing the token
	authFactory.logout = function() { 

	// clear the token 

		AuthToken.setToken();
	

	};

	// check if a user is logged in
	// checks if there is a local token 

	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken()) 

			return true;
		else
			return false;

	};


	// get the logged in user

	authFactory.getUser = function() { 
		if (AuthToken.getToken())
			return $http.get('/api/me'); 
		else
			return $q.reject({ message: 'User has no token.' }); 

	};

	return authFactory;

}])


// factory for handling tokens
// inject $window to store token client-side
// ===================================================

.factory('AuthToken', ["$window", function($window) {


	var authTokenFactory = {};

	// get token from browaer local storage

	authTokenFactory.getToken = function () {

		return $window.localStorage.getItem('token');

	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage


	authTokenFactory.setToken = function(token) {

		if (token) 
			$window.localStorage.setItem('token', token);
		else
      		$window.localStorage.removeItem('token');
  };

	return authTokenFactory;

}])



// ===================================================
// application configuration to integrate token into requests
 // ===================================================


.factory('AuthInterceptor', ["$q", "$location", "AuthToken",function($q, $location, AuthToken) {

	var interceptorFactory = {};

	// This will happen on all http requests

	interceptorFactory.request = function(config) {

		// grab the token

		var token = AuthToken.getToken();

		//if the token exists, add it to the 

		if (token) 

			config.headers['x-access-token'] = token;
		
		return config;
	};

	// happens on response errors
	interceptorFactory.responseError = function(response) {
    // if our server returns a 403 forbidden response
		if (response.status == 403) {

			AuthToken.setToken(); 
			$location.path('/login');

		}

		return $q.reject(response); 
	};

			
    // return the errors from the server as a promise

	return interceptorFactory;


}]);






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




angular.module('fixtureService', ['userService'])

.factory('Fixture', ["$http", "User", function($http, User) {

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

	
	fixtureFactory.attending = function(fixture_id) {


		return $http.get('/api/fixtures/' + fixture_id);



	};


	// return our entire fixtureFactory object
	return fixtureFactory;

}]);




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




angular.module('userService', [])

.factory('User', ["$http", function($http) {

	// create user object

	var userFactory = {};

	// get single user

	userFactory.get = function(id) {

		return $http.get('/api/users/' + id);
	};

	// get all users

	userFactory.all = function() {

		return $http.get('/api/users/');
	};

	// create a user

	userFactory.create = function(userData) {

		return $http.post('api/users/', userData);
	};

	 // update a user
	userFactory.update = function(id, userData) { 

		return $http.put('/api/users/' + id, userData);
	};


	// delete a user

	userFactory.delete = function(id) { 

		return $http.delete('/api/users/' + id);
	};

	// return our entire userFactory object
	return userFactory;

}]);



