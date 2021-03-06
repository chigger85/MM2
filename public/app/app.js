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
