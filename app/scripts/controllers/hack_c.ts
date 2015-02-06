/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../services/datamodel_methods_s.ts"/>

'use strict';


module Todo {

    export class HackCtrl {
        sig = 'HackCtrl'; // I always do this to help debugging DI, and as my first test
        dm: DMMethods; // a reference to the DataModel Methods service
        q: ng.IQService;

        newTitle = '';

        static $inject = ['DMMethods', '$q'];
        constructor(DMMethods, $q) {
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
        doit1() {
            var self = this;
            console.log('sleeping for 1s');
            setTimeout(
                function() {
                    self.getTemp1(1, function() {
                        console.log('sleeping for 1m (although 6s for demo purposes)');
                        setTimeout(
                            function() {
                                self.getTemp1(2,
                                    function() {
                                        console.log('sleeping for 1s');
                                        setTimeout(function() {
                                            console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2));
                                        }, 1000);
                                    })
                            }, 6000);
                    })
                }, 1000);
        }

        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        getTemp1(slot: number, callback: any) {
            setTimeout(() => {
                if (slot == 1) {
                    window['temp1'] = 30;
                } else {
                    window['temp2'] = 32;
                }
                callback();
            }, 1000);
        }


        /**
         * called when the doit2 button is pressed

         wait 1 second
         then fetch the current temperature (A)
         then wait 1 minute
         then fetch the current temperature (B)
         then wait 1 second
         then display the average temperature (A+B/2)
         */
        doit2() {
            var self = this;
            console.log(2);

            this.sleep2(1000)
                .then(() => {
                    this.getTemp2(1)
                        .then(() => {
                            this.sleep2(2000)
                                .then(() => {
                                    this.getTemp2(2)
                                        .then(() => {
                                            this.sleep2(1000)
                                                .then(() => {
                                                    console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2));
                                                })
                                        })
                                })
                        })
                })


        }

        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        getTemp2(slot: number): ng.IPromise < any > {
            var def = this.q.defer();
            setTimeout(() => {
                console.log('temp after 1s');
                if (slot == 1) {
                    window['temp1'] = 30;
                } else {
                    window['temp2'] = 32;
                }
                def.resolve();
            }, 1000);
            return def.promise;
        }


        /**
         * sleep then resolve promise
         */
        sleep2(ms: number): ng.IPromise < any > {
            console.log('sleep ' + ms);
            var def = this.q.defer();
            setTimeout(() => {
                def.resolve();
            }, ms);
            return def.promise;
        }


        /**
         * called when the doit3 button is pressed

         wait 1 second
         then fetch the current temperature (A)
         then wait 1 minute
         then fetch the current temperature (B)
         then wait 1 second
         then display the average temperature (A+B/2)
         */
        doit3() {
            var self = this;
            window['q'] = this.q;
            console.log(2);

            this.sleep(1000)
                .then(() => { return this.getTempPromise(1) })
                .then(() => { return this.sleep(6000) })
                .then(() => { return this.getTempPromise(2) })
                .then(() => { return this.sleep(1000) })
                .then(() => { console.log('average temp over last minute is ' + ((window['temp1'] + window['temp2']) / 2)); })



        }

        /**
         * uses timeout to mimic an xhr.get. Stores a temperature in a global var
         */
        getTempPromise(slot: number): ng.IPromise < any > {
            var def = this.q.defer();
            setTimeout(() => {
                if (slot == 1) {
                    window['temp1'] = 30;
                } else {
                    window['temp2'] = 32;
                }
                def.resolve();
            }, 1000);
            return def.promise;
        }


        /**
         * sleep then resolve promise
         */
        sleep(ms: number) {
            var ms = ms ? ms : 1999;
            console.log('sleeping for  ' + ms + 'ms');
            var def = this.q.defer();
            setTimeout(() => {
                def.resolve();
            }, ms);
            return def.promise;
        }




    }
}

angular.module('ngtodoApp').controller('HackCtrl', Todo.HackCtrl)
