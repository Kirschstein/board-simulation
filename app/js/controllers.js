'use strict';

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory',
  function($scope, Random, BugFactory) {
      var board = new Board();

      $scope.backlog = board.backlog;
      $scope.devInProgress = board.devInProgress;
      $scope.devDone = board.devDone;
      $scope.testInProgress = board.testInProgress;
      $scope.testDone = board.testDone;
      $scope.live = board.live;
      $scope.dayCount = 1;
      $scope.liveMetrics = new LiveMetrics(board);
      
      $scope.testDone.isReady = function() { return $scope.testInProgress.length == 0 && $scope.testDone.length > 0;}
      $scope.testDone.pull = function() { 
        $scope.live.push.apply($scope.live, $scope.testDone );
        $scope.testDone.length = 0;
      }


      $scope.testInProgress.excessCapacity = 0;

      $scope.testInProgress.showExcessCapacity = function() {
        return $scope.testInProgress.excessCapacity > 0;
      };

      $scope.testInProgress.canUseExcessCapacity = function() {
        return $scope.testInProgress.showExcessCapacity() && $scope.devDone.length > 0;
      };

      $scope.testInProgress.useExcessCapacity = function() {
        $scope.devDone.pull();
        var excess = $scope.testInProgress.excessCapacity;
        $scope.testInProgress.excessCapacity = 0;
        $scope.doTestWork(excess);
      };

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
                $scope.testInProgress.excessCapacity = 0;
              }
          };
      };

      $scope.backlog.add = function(v, dev, qa) {
          this.push(new Story(v, dev, qa, board));
      };

      $scope.backlog.addBug = function() {
          this.push(new Bug(0, 0, 1, board));
      };

      $scope.doTestWork = function(amount) {
          if ($scope.testInProgress[0]) {
            var diff = $scope.testInProgress[0].qaWork(amount);
            if ($scope.testInProgress[0].qaCost === 0) {
                var finishedTicket = $scope.testInProgress[0];
                BugFactory.processTicket(finishedTicket, $scope.backlog);
                $scope.testDone.push(finishedTicket);
                $scope.testInProgress.splice(0, 1);
                if (diff > 0) {
                  $scope.doTestWork(diff);
                }
            }
          }
          else {
            $scope.testInProgress.excessCapacity = amount;
          }
      };

      $scope.newDay = function() {

        $scope.liveMetrics.newDay();

        for(var i=0; i < 2; ++i) {
           var value = Random.nextRandom(7,1);
           var dice = Math.ceil(value / 2);
           var devCost = Random.nextRandom(7 * dice, 1 * dice);
           var qaCost = Math.min(4, Math.max(2, value));
           $scope.backlog.add(value,devCost,qaCost);
        };

        for (var i =0; i < $scope.devInProgress.length; ++i) {
          if ($scope.devInProgress[i]) {
            $scope.devInProgress[i].devWork(Random.nextRandom(6,1));
          }
        };

        

          $scope.doTestWork(Random.nextRandom(7,1));
          $scope.dayCount++;
      };


      $scope.backlog.add(2,3,4);
      $scope.backlog.add(3,5,3);
      $scope.backlog.add(6,18,4);
      $scope.backlog.add(4,12,3);
  }]);