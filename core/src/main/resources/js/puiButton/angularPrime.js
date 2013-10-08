/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiButton', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    var titleWatches = [] ,
                        parsedExpression = $interpolate(element.text());
                    element.text(scope.$eval(parsedExpression));
                    angular.forEach(parsedExpression.parts, function (part) {
                        if (angular.isFunction(part)) {
                            titleWatches.push(part.exp);
                        }
                    }, titleWatches);

                    $(function () {

                        var options = scope.$eval(attrs.puiButton) || {};
                        element.puibutton({
                            icon: options.icon,
                            iconPos: options.iconPosition || 'left'
                        });
                    });

                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, function (value) {
                            if (value === false) {
                                $(function () {
                                    element.puibutton('enable');
                                });
                            } else {
                                $(function () {
                                    element.puibutton('disable');
                                });

                            }
                        });
                    }
                    angular.forEach(titleWatches, function(watchValue) {
                        scope.$watch(watchValue, function (value) {
                            $(function () {
                                element.puibutton('setTitle', scope.$eval(parsedExpression));
                            });
                        });
                    });

                };
            }

        };
    }]

);

}());
