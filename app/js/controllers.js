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
      $scope.devDone = [];
      $scope.testInProgress = [];
      $scope.devDone.pull = function() {
        $scope.testInProgress.push.apply($scope.testInProgress, $scope.devDone );
        $scope.devDone.length = 0;
        $scope.devDone.isReady = function() { return false;};
      };

      $scope.devInProgress.devCount = 3;

      $scope.devDone.add = function(card) {
          this.push(card);
          card.isReady = function() { return false;}
          this.isReady = function() { return true;}
      };

      $scope.devInProgress.add = function(card) {
          this.push(card);
          card.isReady = function() {
              return this.devCost <= 0;
          };
          card.pull = function() {
            var index = $scope.devInProgress.indexOf(this);
            if (index != -1) {
                $scope.devDone.add(this);
                $scope.devInProgress.splice(index, 1);
              }
          };
      };

      $scope.backlog.add = function(v, dev, qa) {
          this.push({
            value : v,
            devCost : dev,
            qaCost : qa,     
            isReady : function() { return $scope.devInProgress.devCount > $scope.devInProgress.length;},
            pull : function() { 
              var index = $scope.backlog.indexOf(this);
              if (index != -1) {
                $scope.devInProgress.add(this);
                $scope.backlog.splice(index, 1);
              }
            },
            devWork : function(amount) {
              this.devCost -= amount;
              if (this.devCost < 0)
                this.devCost = 0;
            },
            qaWork : function(amount) {
              this.qaCost -= amount;
              if (this.qaCost < 0)
                this.qaCost = 0;          
            },
          });
      };

      $scope.newDay = function() {
          for (var i =0; i < $scope.devInProgress.length; ++i) {
              if ($scope.devInProgress[i]) {
                $scope.devInProgress[i].devWork(Random.nextRandom(0,0));
              }
          };

          for(var i=0; i < $scope.testInProgress.length; ++i) {
              if ($scope.testInProgress[i]) {
                $scope.testInProgress[i].qaWork(Random.nextRandom(0,0));
              }
          };
      };

      $scope.backlog.add(2,3,4);
      $scope.backlog.add(4,3,5);
      $scope.backlog.add(6,18,6);
      $scope.backlog.add(4,12,6);
  }]);
