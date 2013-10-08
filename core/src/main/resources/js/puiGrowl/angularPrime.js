/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').factory('puiGrowl', function () {

        var growl = {};
        var options = {
            sticky: false,
            life: 3000
        };

        var growlElement;

        var initializeGrowl = function () {
            if (growlElement === undefined) {
                $(function () {
                    growlElement = $('#growl');
                    if (growlElement.length === 1 ) {
                        growlElement.puigrowl();
                    } else {
                        if (growlElement.length === 0) {
                            $('body').append('<div id="growl"></div>');
                            growlElement = $('#growl');
                            growlElement.puigrowl();
                        } else {
                            throw "Growl needs a exactly 1 div with id 'growl'";
                        }
                    }
                });
            }
        };

        growl.showInfoMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'info', summary: title, detail: msg}
            ]);
        };

        growl.showWarnMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'warn', summary: title, detail: msg}
            ]);
        };

        growl.showErrorMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'error', summary: title, detail: msg}
            ]);
        };

        growl.setSticky = function(sticky) {
            if ( typeof sticky !== 'boolean') {
                throw new Error('Only boolean allowed as parameter of setSticky function');
            }
            options.sticky = sticky;
            initializeGrowl();
            growlElement.puigrowl('setOptions', options);
        };

        growl.setStickyRememberOption = function() {
            options.previousStickyValue = options.sticky;
            this.setSticky(true);
        };

        growl.resetStickyOption = function() {
            this.setSticky(options.previousStickyValue);
        };

        growl.setLife = function(time) {
            if ( typeof time !== 'int') {
                throw new Error('Only int allowed as parameter of setSticky function');
            }
            options.life = time;
            initializeGrowl();
            growlElement.puigrowl('setOptions', options);
        };

        growl.clear = function() {
            initializeGrowl();
            growlElement.puigrowl('clear');

        };

        return growl;

    });

}());

