/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').directive('puiSticky', function () {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {

                    element.puisticky({});
                };
            }
        };
    });
}());
