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









