angular.module('userCtrl', ['userService'])

.controller('userController', ["$scope", "User", "Auth", "$route", "$log", "$modal", function($scope, User, Auth, $route, $log, $modal) {



   

    // set a processing variable to show loading things
	$scope.processing = true;
  // grab all the users at page load
	User.all().success(function(data) {
      // when all the users come back, remove the processing variable
		$scope.processing = false;
      // bind the users that come back to $scope.users
     $scope.users = data;

    });



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



