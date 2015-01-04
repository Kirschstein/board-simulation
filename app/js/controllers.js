'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);


phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 
  function($scope) {
      $scope.backlogTickets = [];

      $scope.backlogTickets.push({
        value : 1,
        devCost : 2,
        qaCost : 2,
        isReady : function() { return true;},
        pull : function() { this.value = 2; }
      });
      $scope.backlogTickets.push({
        value : 2,
        devCost : 3,
        qaCost : 3,
        isReady : function() { return false;}
      });
  }]);
