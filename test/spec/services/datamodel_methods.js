'use strict';

describe('Service: DMMethods', function () {

  var $httpBackend;
  var authRequestHandlerGet;
  var authRequestHandlerPost;
  var value;
  //
  // load the service's module
  beforeEach(module('ngtodoApp'));


  
  beforeEach(function(done) {
    setTimeout(function() {
      value = 0;
      done();
    }, 1);
  });

 beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     // backend definition common for all tests
     // this configures the backed to return specified responses in response to specified http calls
     authRequestHandlerGet = $httpBackend.when('GET', '')
                            .respond({kind: 'tasks#tasks'}, {'A-Token': 'xxx'});
     authRequestHandlerPost = $httpBackend.when('POST', '')
                            .respond(200,{id:'id_from_mock_httpbackend',title:'title'});
 }));

  // instantiate service
  var DMMethods;
  beforeEach(inject(function (_DMMethods_) {
    DMMethods= _DMMethods_;
  }));

  it('should be instantiated', function () {
    expect(!!DMMethods).toBe(true);
  });

  it('should have the correct sig', function () {
    expect(DMMethods.sig).toBe('DMMethods');
  });

 it('should have an array of Todo items', function () {
    var len = DMMethods.datamodel.allTodoItemsArray.length;
    expect(len > -1).toBe(true);
  });

 /*
  * test the newTodo method, including the
  * async execution of the promise that assigns
  * the returned id to the newTodo object
  */
 it('new should return a new Todo', function (done) {
   console.warn('test newTodo');
    var newTodo = DMMethods.newTodo('title');
    expect(newTodo.title).toEqual('title');
    expect(newTodo.id).not.toEqual('id_from_mock_httpbackend'); // this is before $http resolved
    $httpBackend.flush();                                       // force all $http requests to complete
    setTimeout(function(){
      expect(newTodo.id).toEqual('id_from_mock_httpbackend');   // after a while, the success has executed
      done();                                                   // for karma to know to stop waiting
  }, 100);
  });

});
