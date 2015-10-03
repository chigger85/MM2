angular.module('fixtureCtrl', ['fixtureService', 'userService', 'authService', 'fixtureAttendService']) 	

.controller('fixtureController', ["Fixture", "FixtureAttend", "Auth", "$location", "$route", function(Fixture,  FixtureAttend, Auth, $location, $route) {

	var vm = this;

	    // set a processing variable to show loading things
	vm.processing = true;

	// grab all the fixtures at page load
	Fixture.all().success(function(data) {
      // when all the fixtures come back, remove the processing variable
		vm.processing = false;
      // bind the fixtures that come back to vm.fixtures
     	vm.fixtures = data;

    });

   Auth.getUser().then(function (data) {

     		vm.user = data.data

	});




    


        // function to delete a user
	vm.deleteFixture = function(id) { 

		vm.processing = true;
	  	// accepts the user id as a parameter
		Fixture.delete(id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			Fixture.all().success(function(data) { 

				vm.processing = false; 
				vm.fixtures = data;
			});
		}); 



	};	


	vm.getAttend = function(id) {

		FixtureAttend.getAttendance(id).success(function(data) {

			vm.attData = data;
			console.log(vm.attData);
		})
	}

	

	vm.removeAttend = function(id) {

		 FixtureAttend.removeAttendance(id).success(function(data) {

		 	vm.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		vm.attData = data;
		 		console.log(data);
		 		console.log(vm.user);


		 	});

		 
		});

		 $route.reload();


	};



	vm.addAttend = function(id) {

		 FixtureAttend.addAttendance(id).success(function(data) {

		 	vm.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		vm.attData = data;
		 		console.log(data);
		 		console.log(vm.user);	
		 	});


		 });

		 $route.reload();


	};


}])


.controller("fixtureCreateController", ["Fixture", "$location", "$timeout", function(Fixture, $location, $timeout) {

	var vm = this;

	// variable to hide/show elements of view
	// differentiates between create and edit pages

	vm.type = 'create' ;

	// function to create user

	vm.saveFixture = function() {

		vm.processing = true;


		// clear the message

		vm.message =  '';

		// use the userCreate function in the user Service

		Fixture.create(vm.fixtureData)
			.success(function(data) {

				vm.processing = false;

				// clear the form

				vm.fixtureData = {};

				vm.message = data.message;



			});

		$timeout(function(){
            
                   $location.path('/availability')
              
            		}, 2000);

		

		};		

}])


.controller("fixtureEditController", ["Fixture", "$routeParams", function(Fixture, $routeParams) {

	var vm = this;

	// variable to hide/show elemnts of the view
	// differentiates between create and edit pages


	vm.type = 'edit';

	

	// console.log(vm.date)

	// get the user data for the user you want to edit 
	// $routeParams is the way we grab data from the URL

	Fixture.get($routeParams.fixture_id)
		.success(function(data) {

			vm.fixtureData = data;

			vm.fixtureData.date = new Date(vm.fixtureData.date);  //need to re-instantiate dob as date object

		});

	//function to save user


	vm.saveFixture =  function() {

		vm.processing = true;

		vm.message = '';


		// call the fixtureService function to update

		Fixture.update($routeParams.fixture_id, vm.fixtureData)

			.success(function(data) {

				vm.processing = false;


				//clear the form

				vm.fixtureData = {};

				//bind the message from our API to vm.message

				vm.message = data.message;

			});

		}

}])






