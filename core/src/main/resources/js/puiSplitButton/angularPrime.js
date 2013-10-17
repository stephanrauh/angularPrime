/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiSplitbutton', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    var titleWatches = [],
                        parsedExpression = $interpolate(element.text()),
                        buttons = element.data('puiButtons') || [];

                    element.text(scope.$eval(parsedExpression));
                    angular.forEach(parsedExpression.parts, function (part) {
                        if (angular.isFunction(part)) {
                            titleWatches.push(part.exp);
                        }
                    }, titleWatches);

                    $(function () {

                        var options = scope.$eval(attrs.puiSplitbutton) || {};
                        element.puisplitbutton({
                            icon: options.icon,
                            iconPos: options.iconPosition || 'left',
                            items : buttons
                        });
                    });

                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, function (value) {
                            if (value === false) {
                                $(function () {
                                    element.puisplitbutton('enable');

                                    element.bind("click", function (event) {
                                        scope.$apply(function () {
                                            scope.$eval(attrs.ngClick);
                                        });
                                    });
                                });
                            } else {
                                $(function () {
                                    element.puisplitbutton('disable');
                                    element.off("click");
                                });

                            }
                        });
                    }

                    angular.forEach(titleWatches, function (watchValue) {
                        scope.$watch(watchValue, function (value) {
                            $(function () {
                                element.puisplitbutton('setTitle', scope.$eval(parsedExpression));
                            });
                        });
                    });

                };
            }

        };
    }]

);

}());
