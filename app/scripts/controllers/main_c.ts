/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../services/datamodel_methods_s.ts"/>

'use strict';


module  Drive {
// Optional. Defines the contract between JS and HTML


  export class MainCtrl {
	sig = 'MainCtrl';				// I always do this to help debugging DI, and as my first test
	dm:DMMethods;					// a reference to the DataModel Methods service

	newTitle = '';

	static $inject = ['DMMethods'];			// allows safe minification
	constructor(DMMethods) {			// NB. no $scope
	this.dm = DMMethods;				// store a reference to the DataModel Methods service
	}

  }
}

angular.module('myapp').controller('MainCtrl',Drive.MainCtrl)
