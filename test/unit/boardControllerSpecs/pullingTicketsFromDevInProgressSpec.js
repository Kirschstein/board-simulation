describe('pulling work from devInProgress completed before the current day', function(){

    beforeEach(module('boardSimulationApp'));

  var scope, ctrl, random, workDone;

    beforeEach (inject(function($rootScope, $controller) {
    workDone = 2;
        random = {
          nextRandom : function(high,low) {
            return workDone;
          },
          nextBugRandom : function(high,low) {
            return workDone;
          }
        };

      scope = $rootScope.$new();
      ctrl = $controller('BoardCtrl', {$scope: scope, Random : random });
    }));

    describe('has an item of work already completed in dev', function() {

      it('a dev ticket finished that day cannot be pulled', function() {
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = 2;

      scope.newDay();
      expect(scope.devInProgress[0].devCost).toBe(0); // ensure ticket was finished
      expect(scope.board.canPullFromDevInProgress(0)).toBe(false);
      });

      it('the first ticket in dev in progress is complete and can be pulled', function() {
        scope.backlog[0].push();
        scope.backlog[0].push();
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = 2;
        scope.devInProgress[1].devCost = 2;
        scope.devInProgress[2].devCost = 2;

      scope.newDay(); // ticket completes this day
      scope.newDay();

      expect(scope.board.canPullFromDevInProgress(0)).toBe(true);
      });


      it('a dev ticket finished on a previous day can be pulled', function() {
        var tooMuchWork = 3;
        var justEnoughWork = 2;
        scope.backlog[0].push();
        scope.backlog[0].push();
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = tooMuchWork;
        scope.devInProgress[1].devCost = justEnoughWork;
        scope.devInProgress[2].devCost = tooMuchWork;

        scope.newDay(); // ticket completes this day
        scope.newDay();

        expect(scope.board.canPullFromDevInProgress(0)).toBe(false);
        expect(scope.board.canPullFromDevInProgress(1)).toBe(true);
        expect(scope.board.canPullFromDevInProgress(2)).toBe(false);
      });

      it('pulling a ticket from dev in progress does not invalidate any excess capacity in test', function (){
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = 2;

        scope.newDay(); // ticket completes this day
        scope.newDay();

        scope.devDone.pull(0);
        expect(scope.testInProgress.excessCapacity).toBe(2);
      });

    it('pulling a ticket from dev in progress to dev done puts the ticket in the dev done column', function (){
      scope.backlog[0].push();
      scope.devInProgress[0].devCost = 2;

      scope.newDay(); // ticket completes this day
      scope.newDay();

      scope.devDone.pull(0);
      expect(scope.devDone.length).toBe(1);
      expect(scope.devInProgress.length).toBe(0);
    });

    it('pulling a ticket from dev in progress means it can no longer be pushed individually', function (){
      scope.backlog[0].push();
      scope.devInProgress[0].devCost = 2;

      scope.newDay(); // ticket completes this day
      scope.newDay();

      scope.devDone.pull(0);
      expect(scope.devDone[0].isReady()).toBe(false);
    });

    it('pushing a ticket to dev done means that other tickets can no longer be pulled that day', function() {
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = 2;

        scope.newDay(); // ticket A now complete
        scope.backlog[0].push();
        scope.devInProgress[1].devCost = 2;

        scope.newDay(); // ticket B complete, ticket A can be pulled        

        scope.devInProgress[1].push();
        expect(scope.board.canPullFromDevInProgress(0)).toBe(false);
    });

    it('after a new day tickets can be pulled again', function() {
        scope.backlog[0].push();
        scope.devInProgress[0].devCost = 2;

        scope.newDay(); // ticket A now complete
        scope.backlog[0].push();
        scope.devInProgress[1].devCost = 2;

        scope.newDay(); // ticket B complete, ticket A can be pulled        

        scope.devInProgress[1].push();
        scope.newDay();
        expect(scope.board.canPullFromDevInProgress(0)).toBe(true);
    });


  });
});