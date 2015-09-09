angular.module('userCtrl', ['userService'])

.controller('userController', ["User", function(User) {


	var vm = this;
    // more stuff to come soon

    // set a processing variable to show loading things
	vm.processing = true;
  // grab all the users at page load
	User.all().success(function(data) {
      // when all the users come back, remove the processing variable
		vm.processing = false;
      // bind the users that come back to vm.users
     vm.users = data;

    });



    // function to delete a user
	vm.deleteUser = function(id) { 

		vm.processing = true;
	  	// accepts the user id as a parameter
		User.delete(id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			User.all().success(function(data) { 

				vm.processing = false; 
				vm.users = data;
			});
		}); 

	};

}])


.controller("userCreateController", ["User", function(User) {

	var vm = this;

	// variable to hide/show elements of view
	// differentiates between create and edit pages

	vm.type = 'create' ;

	// function to create user

	vm.saveUser = function() {

		vm.processing = true;


		// clear the message

		vm.message =  '';

		// use the userCreate function in the user Service

		User.create(vm.userData)
			.success(function(data) {

				vm.processing = false;

				// clear the form

				vm.userData = {};

				vm.message = data.message;

			});

		};

}])

.controller("userEditController", ["User", "$routeParams", function(User, $routeParams) {

	var vm = this;

	// variable to hide/show elemnts of the view
	// differentiates between create and edit pages


	vm.type = 'edit';

	

	// console.log(vm.date)

	// get the user data for the user you want to edit 
	// $routeParams is the way we grab data from the URL

	User.get($routeParams.user_id)
		.success(function(data) {

			vm.userData = data;

			vm.userData.dob = new Date(vm.userData.dob);  //need to instantiate dob as date object

		});

	//function to save user


	vm.saveUser =  function() {

		vm.processing = true;

		vm.message = '';


		// call the userService function to update

		User.update($routeParams.user_id, vm.userData)

			.success(function(data) {

				vm.processing = false;


				//clear the form

				vm.userData = {};

				//bind the message from our API to vm.message

				vm.message = data.message;

			});

		}

}])

