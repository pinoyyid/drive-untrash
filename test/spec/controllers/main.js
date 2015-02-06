'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ngtodoApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have the correct sig ', function () {
//    expect(scope.vmm.sig).toBe('MainCtrl');
    expect(MainCtrl.sig).toBe('MainCtrl');
  });
});
