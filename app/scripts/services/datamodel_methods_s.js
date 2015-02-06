/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
/// <reference path="./datamodel_s.ts"/>
/// <reference path="./restserver_http_s.ts"/>
'use strict';
var Drive;
(function (Drive) {
    /**
     * A class containing all of the method which operate on the Todo data model
     */
    var DMMethods = (function () {
        function DMMethods(Data, RestServer, $timeout, $q) {
            this.sig = 'DMMethods'; // I always do this to help debugging DI, and as my first test
            this.datamodel = Data; // store the reference to the data model
            this.rest = RestServer; // store the reference to the REST service        // REST
            this.timeout = $timeout;
            this.q = $q;
            this.go();
        }
        /**
         * do everything
         * - load the array
         * when done loading, start untrashing
         */
        DMMethods.prototype.go = function () {
            this.loadModel();
        };
        DMMethods.prototype.go2 = function () {
            var _this = this;
            var item = this.datamodel.allTrashedItemsArray[0];
            if (!item) {
                return;
            }
            this.untrash(item).then(function () {
                _this.timeout(function () {
                    if (_this.datamodel.allTrashedItemsArray.length > 0) {
                        console.log("next");
                        _this.go2(); // do the next
                    }
                    else {
                        console.log("done? fetching untrashed again");
                        _this.go(); // if not, get some more
                    }
                }, 1500);
            });
        };
        /**
         * load the data model from drive q=trashed
         * once loaded (ie no nextPageToken) call go2 to untrash. This is so we get an accurate
         initial count of trashed items
         */
        DMMethods.prototype.loadModel = function (nextPageToken) {
            var _this = this;
            this.rest.listTrashed(nextPageToken).then(function (data) {
                console.log("list data", data);
                for (var i = 0; i < data['items'].length; i++) {
                    _this.datamodel.allTrashedItemsArray.push(data['items'][i]);
                }
                if (data.nextPageToken) {
                    _this.loadModel(data.nextPageToken);
                }
                else {
                    //console.warn('go2 suppressed');
                    _this.initialTrashedCount = _this.datamodel.allTrashedItemsArray.length;
                    _this.go2();
                }
            });
        };
        /**
         * untrash an item
         * @param Drive item
         */
        DMMethods.prototype.untrash = function (driveItem) {
            var _this = this;
            var deferred = this.q.defer();
            this.datamodel.wipItemsArray.push(driveItem);
            this.rest.untrash(driveItem).then(function (data) {
                _this.datamodel.untrashedItemsArray.push(driveItem); // add to untrashed
                var index = _this.datamodel.allTrashedItemsArray.indexOf(driveItem);
                if (index > -1) {
                    _this.datamodel.allTrashedItemsArray.splice(index, 1); // remove from trashed
                }
                index = _this.datamodel.wipItemsArray.indexOf(driveItem);
                if (index > -1) {
                    _this.datamodel.wipItemsArray.splice(index, 1); // remove from wip
                }
                deferred.resolve();
            });
            return deferred.promise;
        };
        DMMethods.$inject = ['Data', 'RestServer', '$timeout', '$q'];
        return DMMethods;
    })();
    Drive.DMMethods = DMMethods;
})(Drive || (Drive = {}));
angular.module('myapp').service('DMMethods', Drive.DMMethods);
