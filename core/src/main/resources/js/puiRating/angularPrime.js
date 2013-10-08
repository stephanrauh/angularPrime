/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiRating', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model
            $(function () {

                var options = scope.$eval(attrs.puiRating) || {};

                options.cancel = (options.cancel !== undefined) ? options.cancel : true;
                options.stars = options.stars || 5;

                element.puirating({
                    cancel: options.cancel,
                    stars: options.stars
                });

                element.hide();


                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.puirating('setValue', ngModel.$viewValue);
                };


                // Listen for change events to enable binding
                element.bind('puiratingrate puiratingcancel', function () {
                    scope.safeApply(read());
                    if (options.callback) {
                        options.callback(ngModel.$viewValue);
                    }

                });

                // Write data to the model
                function read() {
                    if (ngModel.$viewValue !== parseInt(element.val(), 10))   {
                        // Only set Angular model value when effective changed. Otherwise ng-change can be triggered to many times.
                        ngModel.$setViewValue(element.val());
                    }
                }


                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, function (value) {

                        if (value === false) {
                            $(function () {
                                element.puirating('enable');
                            });
                        } else {
                            $(function () {
                                element.puirating('disable');

                            });

                        }
                    });
                }

            });
        }
    };

});

}());
