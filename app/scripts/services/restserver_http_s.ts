/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
'use strict';

module Drive {
    /**
     * A class that handles inserting and listing to a REST service using $http
     */

    export class RestServer {
        sig = 'RestServer'; // I always do this to help debugging DI, and as my first test
        TASKLIST_ID = 'MDM4NjIwODI0NzAwNDQwMjQ2MjU6OTEzMzE4NTkxOjA';
        http: ng.IHttpService;
        timeout;
        window;
        q: ng.IQService;
        authing = false;

        clientId = "946089256146-v31sfl8j89432aohke3fjp7u2iecso0q.apps.googleusercontent.com";
        scopes = "https://www.googleapis.com/auth/drive"
        immediate = false; // first time

        listPromise: ng.IHttpPromise < any > ;




        LIST_URL = "https://www.googleapis.com/drive/v2/files?maxResults=1000&q=trashed%3Dtrue&fields=items(id%2Ctitle)%2CnextPageToken";
        UNTRASH_URL = "https://www.googleapis.com/drive/v2/files/:ID/untrash";

        static $inject = ['$http', '$window', '$timeout', '$q']; // Angular will inject the Data model service
        constructor($http, $window, $timeout, $q) {
            this.http = $http;
            this.window = $window;
            this.timeout = $timeout;
            this.q = $q;

            // set a default Authorization header to include an access token from somewhere
        }


        /**
         * return an access token. Where an access token is fetched from varies from service to service.
         * In the case of Google, one would normally call gapi.auth.getToken()
         *
         * @return the access token string
         */
        getAccessToken(): string {
            if (!this.window.gapi || !this.window.gapi.auth) {
                console.log('waiting for gapi load');
                //debugger;
                //return this.getAccessToken();
                return;
            }
            if (this.window.gapi.auth.getToken()) {
                return this.window.gapi.auth.getToken()['access_token'];
            } else {
                this.refreshAccessToken();
                return undefined;
            }
        }


        /**
         *  call gapi authorize. first time, immediate = false, subsequently immediate is true
         */
        refreshAccessToken() {
            if (this.authing) {
                return;
            }
            this.authing = true;

            if (!this.window.gapi || !this.window.gapi.auth) {
                console.warn('gapi not yet loaded');
                return;
            }
            this.window.gapi.auth.authorize({
                client_id: this.clientId,
                scope: this.scopes,
                immediate: this.immediate
            }, () => {
                this.authing = false;
                this.immediate = true;
                console.log('authed')
            });
        }




        /**
         * Untrash an item
         */
        untrash(item: DriveItem, retryCounter ? : number): ng.IPromise < any > {
            var def = this.q.defer();

            if (item) {
                this._untrash(item, def, 4);
            }
            return def.promise;
        }



        /**
         * Untrash an item, inner function. This is recursed by errors
         */
        _untrash(item: DriveItem, def: ng.IDeferred < any > , retryCounter: number) {
            this.http.defaults.headers.common.Authorization = 'Bearer ' + this.getAccessToken();
            var url = this.UNTRASH_URL.replace(":ID", item.id)
            var promise = this.http.post(url, undefined);
            promise.error((data, status, headers, config) => {
                if (status == 401) {
                    console.warn("Need to acquire a new Access Token and resubmit");
                    this.refreshAccessToken();
                    retryCounter ? retryCounter-- : retryCounter = 5;
                    if (retryCounter > 1) {
                        this.timeout(() => {
                            return this._untrash(item, def, retryCounter);
                        }, 2000)
                    }
                }
            });
            promise.success((data) => {
                def.resolve(data)
            })

        }





        /**
         * fetch list of trashed items, this does NOT deal with pagination, which must be dealt with by then in the caller
         */
        listTrashed(nextPageToken: string): ng.IPromise < any > {
            var def = this.q.defer();
            this._listTrashed(def, nextPageToken, 5);
            return def.promise;
        }


        /**
         * internal $http call. This is recursed for errors
         */
        _listTrashed(def: ng.IDeferred < any > , nextPageToken: string, retryCounter: number) {
            this.http.defaults.headers.common.Authorization = 'Bearer ' + this.getAccessToken();
            var url = this.LIST_URL;
            if (nextPageToken) {
                url += '&pageToken=' + nextPageToken;
            }
            console.log("pt=" + nextPageToken);
            console.log("url=" + url)
            var promise = this.http.get(url);
            promise.error((data, status, headers, config) => {
                if (status == 401) {
                    this.refreshAccessToken();
                    console.warn("Need to acquire a new Access Token and resubmit");
                    retryCounter ? retryCounter-- : retryCounter = 2;
                    this._listTrashed(def, nextPageToken, retryCounter);
                }
            })
            promise.success((data) => {
                def.resolve(data)
            });
        }


    }
}

angular.module('myapp')
    .service('RestServer', Drive.RestServer);