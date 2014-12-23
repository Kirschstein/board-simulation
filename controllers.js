var boardApp = angular.module('boardApp', []);

boardApp.controller('boardController', function ($scope) {
  $scope.backlogTickets = [
    {'value': '3',
     'devCost' : '4',     
     'qaCost': '2',
     'isReady' : function() { return true;},
     'pull' : function() { 
     	this.pull = function() { };
     	this.isReady = function() { return false;}
     	$scope.devInProgressTickets.push(this);
     	var index = $scope.backlogTickets.indexOf(this);
     	$scope.backlogTickets.splice(index, 1);
     }
    },    

     {'value': '4',
     'devCost' : '6',     
     'qaCost': '1',
     'isReady' : function() { return false;}
   },
  ];

   $scope.devInProgressTickets = [];

   
});