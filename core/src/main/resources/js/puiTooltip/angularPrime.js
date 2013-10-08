/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiTooltip', ['$interpolate', function ($interpolate) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {

            return function postLink (scope, element, attrs) {

                var titleAttr = attrs.title;

                var options = scope.$eval(attrs.puiTooltip) || {};
                options.my = options.my || 'left top';
                options.at = options.at || 'right bottom';
                options.content = options.content || titleAttr;
                options.showEvent = options.showEvent || 'mouseover';
                options.hideEvent = options.hideEvent || 'mouseout';
                options.showEffect = options.showEffect || 'fade';
                options.showEffectSpeed = options.showEffectSpeed || 'normal';
                options.hideEffectSpeed = options.hideEffectSpeed || 'normal';
                options.showDelay = options.showDelay || 150;

                var tooltipWatches = [];

                if (options.content && options.content !== '') {
                    var parsedExpression = $interpolate(options.content);
                    options.content = scope.$eval(parsedExpression);
                    angular.forEach(parsedExpression.parts, function(part) {
                        if (angular.isFunction(part)) {
                            tooltipWatches.push(part.exp);
                        }
                    }, tooltipWatches);

                    $(function () {
                        element.puitooltip({
                            content: options.content,
                            showEvent: options.showEvent,
                            hideEvent: options.hideEvent,
                            showEffect: options.showEffect,
                            hideEffect: options.hideEffect,
                            showEffectSpeed: options.showEffectSpeed,
                            hideEffectSpeed: options.hideEffectSpeed,
                            my: options.my,
                            at: options.at,
                            showDelay: options.showDelay
                        });
                    });

                    angular.forEach(tooltipWatches, function(watchValue) {
                        scope.$watch(watchValue, function (value) {
                            $(function () {
                                element.puitooltip('setTooltipContent', scope.$eval(parsedExpression));
                            });
                        });
                    });

                }
            };

        }
    };
}]);

}());
