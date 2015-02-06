/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../services/datamodel_methods_s.ts"/>
'use strict';
var Todo;
(function (Todo) {
    var HackCtrl = (function () {
        function HackCtrl(DMMethods, $q) {
            this.sig = 'HackCtrl'; // I always do this to help debugging DI, and as my first test
            this.newTitle = '';
            this.dm = DMMethods;
            this.q = $q;
        }
        /**
         * called when the doit1 button is pressed

         wait 1 second
         then fetch the current temperature (A)
         then wait 1 minute
         then fetch the current temperature (B)
         then wait 1 second
         then display the average temperature (A+B/2)
         */
        HackCtrl.prototype.doit1 = function () {
            var self = this;
            console.log('sleeping for 1s');
            setTimeout(function () {
                self.getTemp1(1, function () {
                    console.log('sleeping for 1m (although 6s for demo purposes)');
                    setTimeout(function () {
                        self.getTemp1(2, function () {
                            console.log('sleeping for 1s');
                            setTimeout(function () {
                                console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2));
                            }, 1000);
                        });
                    }, 6000);
                });
            }, 1000);
        };
        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        HackCtrl.prototype.getTemp1 = function (slot, callback) {
            setTimeout(function () {
                if (slot == 1) {
                    window['temp1'] = 30;
                }
                else {
                    window['temp2'] = 32;
                }
                callback();
            }, 1000);
        };
        /**
         * called when the doit2 button is pressed

         wait 1 second
         then fetch the current temperature (A)
         then wait 1 minute
         then fetch the current temperature (B)
         then wait 1 second
         then display the average temperature (A+B/2)
         */
        HackCtrl.prototype.doit2 = function () {
            var _this = this;
            var self = this;
            console.log(2);
            this.sleep2(1000).then(function () {
                _this.getTemp2(1).then(function () {
                    _this.sleep2(2000).then(function () {
                        _this.getTemp2(2).then(function () {
                            _this.sleep2(1000).then(function () {
                                console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2));
                            });
                        });
                    });
                });
            });
        };
        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        HackCtrl.prototype.getTemp2 = function (slot) {
            var def = this.q.defer();
            setTimeout(function () {
                console.log('temp after 1s');
                if (slot == 1) {
                    window['temp1'] = 30;
                }
                else {
                    window['temp2'] = 32;
                }
                def.resolve();
            }, 1000);
            return def.promise;
        };
        /**
         * sleep then resolve promise
         */
        HackCtrl.prototype.sleep2 = function (ms) {
            console.log('sleep ' + ms);
            var def = this.q.defer();
            setTimeout(function () {
                def.resolve();
            }, ms);
            return def.promise;
        };
        /**
         * called when the doit3 button is pressed

         wait 1 second
         then fetch the current temperature (A)
         then wait 1 minute
         then fetch the current temperature (B)
         then wait 1 second
         then display the average temperature (A+B/2)
         */
        HackCtrl.prototype.doit3 = function () {
            var _this = this;
            var self = this;
            window['q'] = this.q;
            console.log(2);
            this.sleep(1000).then(function () {
                return _this.getTempPromise(1);
            }).then(function () {
                return _this.sleep(6000);
            }).then(function () {
                return _this.getTempPromise(2);
            }).then(function () {
                return _this.sleep(1000);
            }).then(function () {
                console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2));
            });
        };
        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        HackCtrl.prototype.getTempPromise = function (slot) {
            var def = this.q.defer();
            setTimeout(function () {
                if (slot == 1) {
                    window['temp1'] = 30;
                }
                else {
                    window['temp2'] = 32;
                }
                def.resolve();
            }, 1000);
            return def.promise;
        };
        /**
         * sleep then resolve promise
         */
        HackCtrl.prototype.sleep = function (ms) {
            var ms = ms ? ms : 1999;
            console.log('sleeping for  ' + ms + 'ms');
            var def = this.q.defer();
            setTimeout(function () {
                def.resolve();
            }, ms);
            return def.promise;
        };
        HackCtrl.$inject = ['DMMethods', '$q'];
        return HackCtrl;
    })();
    Todo.HackCtrl = HackCtrl;
})(Todo || (Todo = {}));
angular.module('ngtodoApp').controller('HackCtrl', Todo.HackCtrl);
