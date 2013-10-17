/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiButton', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    var titleWatches = [],
                        parsedExpression = $interpolate(element.text()),
                        withinSplitButton,
                        options = scope.$eval(attrs.puiButton) || {};

                    withinSplitButton = element.parent().attr('pui-splitbutton') !== undefined;

                    element.text(scope.$eval(parsedExpression));
                    angular.forEach(parsedExpression.parts, function (part) {
                        if (angular.isFunction(part)) {
                            titleWatches.push(part.exp);
                        }
                    }, titleWatches);

                    if (withinSplitButton) {
                        var buttons = element.parent().data('puiButtons'),
                            buttonInfo;

                        if (buttons === undefined) {
                            buttons = [];
                        }

                        buttonInfo = {
                            text : titleWatches.length === 0 ? scope.$eval(parsedExpression) : titleWatches,
                            click: function () {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ngClick);
                                });
                            },
                            icon: options.icon,
                            iconPos: options.iconPosition || 'left'
                        };

                        buttons.push(buttonInfo);
                        element.parent().data('puiButtons', buttons);

                        element.html(''); // remove element

                    } else {

                        $(function () {

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
                        angular.forEach(titleWatches, function (watchValue) {
                            scope.$watch(watchValue, function (value) {
                                $(function () {
                                    element.puibutton('setTitle', scope.$eval(parsedExpression));
                                });
                            });
                        });
                    }
                };
            }

        };
    }]

);

}());
