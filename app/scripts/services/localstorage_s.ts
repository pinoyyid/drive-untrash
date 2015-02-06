/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/todoItem.ts"/>
'use strict';

module  Todo {
/**
* A class that implements local storage
*/
  export class LocalStorage{
	sig = 'LocalStorage';				// I always do this to help debugging DI, and as my first test
	key = 'Todolist'
	als;

	static $inject = ['localStorageService'];			// Angular will inject the Data model service
	constructor(als) {
		this.als = als;
	}


	
	/**
	* Save to local storage
	*/
	save(todolist:Array<Todo>) {
	    this.als.set(this.key, todolist);
	}
	
	/**
	* load from local storage
	*/
	load():Array<Todo> {
	    var resp = this.als.get(this.key);
	    return resp;
	}
		
 }
}

angular.module('ngtodoApp')
  .service('LocalStorage', Todo.LocalStorage);
