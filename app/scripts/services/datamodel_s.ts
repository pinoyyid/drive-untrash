/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
'use strict';


module  Drive {
  export class Data {
	sig = 'Data';				// I always do this to help debugging DI, and as my first test
	allTrashedItemsArray:Array<DriveItem> = [];	// all trashed items, as an array
	wipItemsArray:Array<DriveItem> = [];   	// all wip (ie untrash sent, not responded)
	untrashedItemsArray:Array<DriveItem> = [];	// all untrashed items, as an array
  }
}

angular.module('myapp')
  .service('Data', Drive.Data);
