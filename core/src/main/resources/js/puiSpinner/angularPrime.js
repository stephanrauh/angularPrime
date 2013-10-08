/*globals angular $ */
(function () {
    "use strict";

angular.module('angular.prime').directive('puiSpinner', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model
            $(function () {

                var options = scope.$eval(attrs.puiSpinner) || {},
                    helper = {
                        read: function () {
                            $(function () {
                                scope.safeApply(function () {
                                    ngModel.$setViewValue(element.val());
                                });

                            });
                        }};
                element.puispinner({
                    step: options.step,
                    prefix: options.prefix,
                    suffix: options.suffix,
                    min: options.min,
                    max: options.max
                });

                // Listen for select events to enable binding
                element.bind('puispinnerchange', function () {
                    helper.read();
                });

                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, function (value) {

                        if (value === false) {
                            element.puispinner('enable');
                        } else {
                            element.puispinner('disable');

                        }
                    });
                }

            });
        }
    };

});

}());
