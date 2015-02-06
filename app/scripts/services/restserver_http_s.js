/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../common/driveItem.ts"/>
'use strict';
var Drive;
(function (Drive) {
    /**
     * A class that handles inserting and listing to a REST service using $http
     */
    var RestServer = (function () {
        function RestServer($http, $window, $timeout, $q) {
            this.sig = 'RestServer'; // I always do this to help debugging DI, and as my first test
            this.TASKLIST_ID = 'MDM4NjIwODI0NzAwNDQwMjQ2MjU6OTEzMzE4NTkxOjA';
            this.authing = false;
            this.clientId = "946089256146-v31sfl8j89432aohke3fjp7u2iecso0q.apps.googleusercontent.com";
            this.scopes = "https://www.googleapis.com/auth/drive";
            this.immediate = false; // first time
            this.LIST_URL = "https://www.googleapis.com/drive/v2/files?maxResults=1000&q=trashed%3Dtrue&fields=items(id%2Ctitle)%2CnextPageToken";
            this.UNTRASH_URL = "https://www.googleapis.com/drive/v2/files/:ID/untrash";
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
        RestServer.prototype.getAccessToken = function () {
            if (!this.window.gapi || !this.window.gapi.auth) {
                console.log('waiting for gapi load');
                //debugger;
                //return this.getAccessToken();
                return;
            }
            if (this.window.gapi.auth.getToken()) {
                return this.window.gapi.auth.getToken()['access_token'];
            }
            else {
                this.refreshAccessToken();
                return undefined;
            }
        };
        /**
         *  call gapi authorize. first time, immediate = false, subsequently immediate is true
         */
        RestServer.prototype.refreshAccessToken = function () {
            var _this = this;
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
            }, function () {
                _this.authing = false;
                _this.immediate = true;
                console.log('authed');
            });
        };
        /**
         * Untrash an item
         */
        RestServer.prototype.untrash = function (item, retryCounter) {
            var def = this.q.defer();
            if (item) {
                this._untrash(item, def, 4);
            }
            return def.promise;
        };
        /**
         * Untrash an item, inner function. This is recursed by errors
         */
        RestServer.prototype._untrash = function (item, def, retryCounter) {
            var _this = this;
            this.http.defaults.headers.common.Authorization = 'Bearer ' + this.getAccessToken();
            var url = this.UNTRASH_URL.replace(":ID", item.id);
            var promise = this.http.post(url, undefined);
            promise.error(function (data, status, headers, config) {
                if (status == 401) {
                    console.warn("Need to acquire a new Access Token and resubmit");
                    _this.refreshAccessToken();
                    retryCounter ? retryCounter-- : retryCounter = 5;
                    if (retryCounter > 1) {
                        _this.timeout(function () {
                            return _this._untrash(item, def, retryCounter);
                        }, 2000);
                    }
                }
            });
            promise.success(function (data) {
                def.resolve(data);
            });
        };
        /**
         * fetch list of trashed items, this does NOT deal with pagination, which must be dealt with by then in the caller
         */
        RestServer.prototype.listTrashed = function (nextPageToken) {
            var def = this.q.defer();
            this._listTrashed(def, nextPageToken, 5);
            return def.promise;
        };
        /**
         * internal $http call. This is recursed for errors
         */
        RestServer.prototype._listTrashed = function (def, nextPageToken, retryCounter) {
            var _this = this;
            this.http.defaults.headers.common.Authorization = 'Bearer ' + this.getAccessToken();
            var url = this.LIST_URL;
            if (nextPageToken) {
                url += '&pageToken=' + nextPageToken;
            }
            console.log("pt=" + nextPageToken);
            console.log("url=" + url);
            var promise = this.http.get(url);
            promise.error(function (data, status, headers, config) {
                if (status == 401) {
                    _this.refreshAccessToken();
                    console.warn("Need to acquire a new Access Token and resubmit");
                    retryCounter ? retryCounter-- : retryCounter = 2;
                    _this._listTrashed(def, nextPageToken, retryCounter);
                }
            });
            promise.success(function (data) {
                def.resolve(data);
            });
        };
        RestServer.$inject = ['$http', '$window', '$timeout', '$q']; // Angular will inject the Data model service
        return RestServer;
    })();
    Drive.RestServer = RestServer;
})(Drive || (Drive = {}));
angular.module('myapp').service('RestServer', Drive.RestServer);
