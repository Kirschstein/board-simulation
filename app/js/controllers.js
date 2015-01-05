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

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 
  function($scope, Random) {
      $scope.backlog = [];
      $scope.devInProgress = [];

      $scope.devInProgress.devCount = 3;

      $scope.devInProgress.add = function(card) {
          this.push(card);
          card.isReady = function() {
              return this.devCost <= 0;
          };
      };

      $scope.backlog.add = function(v, dev, qa) {
          this.push({
            value : v,
            devCost : dev,
            qaCost : qa,     
            isReady : function() { return $scope.devInProgress.devCount > $scope.devInProgress.length;},
            pull : function() { 
              $scope.devInProgress.add(this);
              var index = $scope.backlog.indexOf(this);
              $scope.backlog.splice(index, 1);
            },
            devWork : function(amount) {
              this.devCost -= amount;
            }     
          });
      };

      $scope.newDay = function() {
          for (var i =0; i < $scope.devInProgress.length; ++i) {
              if ($scope.devInProgress[i]) {
                $scope.devInProgress[i].devWork(Random.nextRandom(0,0));
              }
          };
      };

      $scope.backlog.add(2,3,4);
      $scope.backlog.add(4,3,5);
      $scope.backlog.add(6,18,6);
      $scope.backlog.add(4,12,6);
  }]);
