/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
/// <reference path="./datamodel_s.ts"/>
/// <reference path="./restserver_http_s.ts"/>
'use strict';


module Drive {
    /**
     * A class containing all of the method which operate on the Todo data model
     */
    export class DMMethods {
        sig = 'DMMethods'; // I always do this to help debugging DI, and as my first test
        datamodel: Data; // the in-memory data model
        rest: RestServer; // REST
        timeout;
        q;
        initialTrashedCount: number;

        static $inject = ['Data', 'RestServer', '$timeout', '$q'];
        constructor(Data, RestServer, $timeout, $q) {
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
        go() {
            this.loadModel();
        }
        go2() {
            var item = this.datamodel.allTrashedItemsArray[0];
            if (!item) {
                return;
            }
            this.untrash(item) // untrash the first item
                .then(() => {
                    this.timeout(() => { // when done, sleep 1.5s
                        if (this.datamodel.allTrashedItemsArray.length > 0) { // if there are more untrashed
                            console.log("next");
                            this.go2(); // do the next
                        } else {
                            console.log("done? fetching untrashed again");
                            this.go(); // if not, get some more
                        }
                    }, 1500);
                })

        }

        /**
         * load the data model from drive q=trashed
         * once loaded (ie no nextPageToken) call go2 to untrash. This is so we get an accurate
         initial count of trashed items
         */
        loadModel(nextPageToken ? : string) {
            this.rest.listTrashed(nextPageToken).then((data) => {
                console.log("list data", data);
                for (var i = 0; i < data['items'].length; i++) {
                    this.datamodel.allTrashedItemsArray.push(data['items'][i]);
                }
                if (data.nextPageToken) {
                    this.loadModel(data.nextPageToken);
                } else {
                    //console.warn('go2 suppressed');
                    this.initialTrashedCount = this.datamodel.allTrashedItemsArray.length;
                    this.go2();
                }
            });
        }


        /**
         * untrash an item
         * @param Drive item
         */
        untrash(driveItem: DriveItem): ng.IPromise < any > {
            var deferred = this.q.defer();
            this.datamodel.wipItemsArray.push(driveItem);
            this.rest.untrash(driveItem)
                .then((data) => {
                    this.datamodel.untrashedItemsArray.push(driveItem); // add to untrashed
                    var index = this.datamodel.allTrashedItemsArray.indexOf(driveItem);
                    if (index > -1) {
                        this.datamodel.allTrashedItemsArray.splice(index, 1); // remove from trashed
                    }
                    index = this.datamodel.wipItemsArray.indexOf(driveItem);
                    if (index > -1) {
                        this.datamodel.wipItemsArray.splice(index, 1); // remove from wip
                    }
                    deferred.resolve();
                });
            return deferred.promise;
        }
    }
}

angular.module('myapp')
    .service('DMMethods', Drive.DMMethods);