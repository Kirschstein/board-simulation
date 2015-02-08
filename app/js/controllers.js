'use strict';

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory',
  function($scope, Random, BugFactory) {
      var board = new Board();
      var analysts = new Analysts(board, Random);
      var testers = new Testers(board, Random, BugFactory);
      var developers = new Developers(board, Random);

      $scope.backlog = board.backlog;
      $scope.devInProgress = board.devInProgress;
      $scope.devDone = board.devDone;
      $scope.testInProgress = board.testInProgress;
      $scope.testDone = board.testDone;
      $scope.live = board.live;
      $scope.dayCount = 1;
      $scope.liveMetrics = new LiveMetrics(board);
      

  

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
        developers.newDay();

        $scope.dayCount++;
      };


      $scope.backlog.push(new Story(2,3,4, board));
      $scope.backlog.push(new Story(3,5,3, board));
      $scope.backlog.push(new Story(6,18,4, board));
      $scope.backlog.push(new Story(4,12,3, board));
  }]);