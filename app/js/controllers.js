'use strict';

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory',
  function($scope, Random, BugFactory) {
      var board = new Board();
      var analysts = new Analysts(board, Random);
      var testers = new Testers(board, Random, BugFactory);

      $scope.backlog = board.backlog;
      $scope.devInProgress = board.devInProgress;
      $scope.devDone = board.devDone;
      $scope.testInProgress = board.testInProgress;
      $scope.testDone = board.testDone;
      $scope.live = board.live;
      $scope.dayCount = 1;
      $scope.liveMetrics = new LiveMetrics(board);
      

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



      $scope.newDay = function() {

        $scope.liveMetrics.newDay();
        analysts.newDay();
        testers.newDay();

       for (var i =0; i < $scope.devInProgress.length; ++i) {
          if ($scope.devInProgress[i]) {
            $scope.devInProgress[i].devWork(Random.nextRandom(6,1));
          }
        };

          $scope.dayCount++;
      };


      $scope.backlog.push(new Story(2,3,4, board));
      $scope.backlog.push(new Story(3,5,3, board));
      $scope.backlog.push(new Story(6,18,4, board));
      $scope.backlog.push(new Story(4,12,3, board));
  }]);