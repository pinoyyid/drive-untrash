'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('ngtodoApp'));

  // instantiate service
  var Data;
  beforeEach(inject(function (_Data_) {
    Data= _Data_;
  }));

  it('should be instantiated', function () {
    expect(!!Data).toBe(true);
  });

  it('should have the correct sig', function () {
    expect(Data.sig).toBe('Data');
  });

 it('should have an array of Todo items', function () {
    var len = Data.allTodoItemsArray.length;
    expect(len > -1).toBe(true);
  });


});
