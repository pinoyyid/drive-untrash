'use strict';
//
// tests for the RestService. Simply test that each method makes the correct 
// call to $http
//
// Once this class is certified, it can be replaced by a mock equivalent that either mocks out
// all of its methods, or includes with $httpBackend to mock the server
describe('Service: RestServer', function () {

  // load the service's module
  beforeEach(module('ngtodoApp'));

  // instantiate service
  var RestServer;
  var $httpBackend;
  var authRequestHandlerGet;
  var authRequestHandlerPost;

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

  beforeEach(inject(function (_RestServer_) {
    RestServer= _RestServer_;
  }));


   afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });


  it('should be instantiated', function () {
    expect(!!RestServer).toBe(true);
  });

  it('should have the correct sig', function () {
    expect(RestServer.sig).toBe('RestServer');
  });


  // test each method by first defining what we expect it to send to $http
  // and then call the method
   it('list should call GET on the tasks endpoint', function() {
     $httpBackend.expectGET("http://localhost:8080/tasks/v1/lists/MDM4NjIwODI0NzAwNDQwMjQ2MjU6OTEzMzE4NTkxOjA/tasks");
     RestServer.list();
     $httpBackend.flush();
   });



   it('insert should call POST on the tasks endpoint', function() {
     console.log("test insert");
     $httpBackend.expectPOST("http://localhost:8080/tasks/v1/lists/MDM4NjIwODI0NzAwNDQwMjQ2MjU6OTEzMzE4NTkxOjA/tasks");
     RestServer.insert({title:'foo'});
     $httpBackend.flush();
   });


});
