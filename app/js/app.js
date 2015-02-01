'use strict';

/* App Module */

var boardApp = angular.module('boardSimulationApp', [
  'ngRoute',

  'phonecatControllers',
  'boardControllers',
  'boardServices',
  'phonecatServices'
]);

boardApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/board', {
        templateUrl: 'partials/board.html',
        controller: 'BoardCtrl'
      }).
      otherwise({
        redirectTo: '/board'
      });
  }]);