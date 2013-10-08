/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiFieldset', function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs) {
                $(function () {

                    var options = scope.$eval(attrs.puiFieldset) || {};
                    var toggleable = options.collapsed !== undefined;
                    options.toggleDuration = options.toggleDuration || 'normal';
                    element.puifieldset({
                        toggleable: toggleable,
                        toggleDuration: options.toggleDuration,
                        collapsed: options.collapsed
                    });

                    if (toggleable) {

                        if (attrs.puiFieldset.trim().charAt(0) !== '{') {
                            scope.$watch(attrs.puiFieldset + '.collapsed', function (value) {
                                if (value === true) {
                                    element.puifieldset('collapse');
                                } else {
                                    element.puifieldset('expand');
                                }

                            });
                        }
                    }
                    if (options.callback) {
                        // TODO Warning when toggleable === false
                        element.bind('puifieldsetaftertoggle', function () {
                            options.callback();
                        });
                    }

                });
            };
        }
    };
});

}());
