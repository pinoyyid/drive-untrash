/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
'use strict';
var Drive;
(function (Drive) {
    var Data = (function () {
        function Data() {
            this.sig = 'Data'; // I always do this to help debugging DI, and as my first test
            this.allTrashedItemsArray = []; // all trashed items, as an array
            this.wipItemsArray = []; // all wip (ie untrash sent, not responded)
            this.untrashedItemsArray = []; // all untrashed items, as an array
        }
        return Data;
    })();
    Drive.Data = Data;
})(Drive || (Drive = {}));
angular.module('myapp').service('Data', Drive.Data);
