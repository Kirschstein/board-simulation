'use strict';

var boardControllers = angular.module('boardControllers', []);

boardControllers.controller('BoardCtrl', ['$scope', 'Random', 'BugFactory',
  function($scope, Random, BugFactory) {
      var board = new Board();
      var analysts = new Analysts(board, Random);
      var testers = new Testers(board, Random, BugFactory);
      var developers = new Developers(board, Random);

      $scope.board = board;
      $scope.backlog = board.backlog;
      $scope.devInProgress = board.devInProgress;
      $scope.devDone = board.devDone;
      $scope.testInProgress = board.testInProgress;
      $scope.testDone = board.testDone;
      $scope.live = board.live;
      $scope.dayCount = 1;
      $scope.liveMetrics = new LiveMetrics(board);

      var newDayListeners = [
        analysts,
        developers,
        testers,
        $scope.liveMetrics
      ];    
  
      $scope.newDay = function() {
        for(var i=0; i < newDayListeners.length; i++) {
          newDayListeners[i].newDay();
        }
        $scope.dayCount++;
      };

      analysts.seedBoard();
  }]);