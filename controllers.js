var boardApp = angular.module('boardApp', []);

boardApp.controller('boardController', function ($scope) {
  $scope.backlogTickets = [
    {'value': '3',
     'devCost' : '4',     
     'qaCost': '2',
     'showCard' : function() { return true;}
    },    

     {'value': '4',
     'devCost' : '6',     
     'qaCost': '1',
     'showCard' : function() { return false;}
   },
  ];
});