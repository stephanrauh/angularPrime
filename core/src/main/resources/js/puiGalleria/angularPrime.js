/*globals angular $ */
(function () {
    "use strict";

angular.module('angular.prime').directive('puiGalleria', function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs) {
                var options = scope.$eval(attrs.puiGalleria) || {};
                $(function () {
                    element.puigalleria({
                        panelWidth: options.panelWidth,
                        panelHeight: options.panelHeight
                    });
                });


            };

        }
    };
});

}());
