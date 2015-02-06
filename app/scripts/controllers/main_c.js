/// <reference path="../../../tsdefs/angularjs/angular.d.ts"/>
/// <reference path="../services/datamodel_methods_s.ts"/>
'use strict';
var Drive;
(function (Drive) {
    // Optional. Defines the contract between JS and HTML
    var MainCtrl = (function () {
        function MainCtrl(DMMethods) {
            this.sig = 'MainCtrl'; // I always do this to help debugging DI, and as my first test
            this.newTitle = '';
            this.dm = DMMethods; // store a reference to the DataModel Methods service
        }
        MainCtrl.$inject = ['DMMethods']; // allows safe minification
        return MainCtrl;
    })();
    Drive.MainCtrl = MainCtrl;
})(Drive || (Drive = {}));
angular.module('myapp').controller('MainCtrl', Drive.MainCtrl);
