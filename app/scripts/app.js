'use strict';

/**
 * Main module of the application.
 */
angular
  .module('myapp', [
    'ngRoute',
    'ngSanitize',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/hack', {
        templateUrl: 'views/hack.html',
        controller: 'HackCtrl as vmh'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as vmm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
