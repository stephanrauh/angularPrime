/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').directive('puiListbox', function () {
        return {
            restrict: 'A',
            require: '?ngModel', // get a hold of NgModelController
            compile: function (element, attrs) {

                return function postLink(scope, element, attrs, ngModel) {
                    var options = scope.$eval(attrs.puiListbox) || {},
                        multiple  = element.prop("multiple");
                    if (attrs.ngOptions) {
                        // This builds the Option tags
                        ngModel.$render();
                        // Remove the null option added by angular
                        var firstChild = element.children()[0];
                        if (firstChild.text === '' && firstChild.value === '?') {
                            element[0].removeChild(firstChild);
                        }

                    }

                    element.puilistbox({
                        scrollHeight: options.scrollHeight
                    });

                    if (attrs.ngDisabled) {
                        scope.$watch(attrs.ngDisabled, function (value) {

                            if (value === false) {
                                $(function () {
                                    element.puilistbox('enable');
                                });
                            } else {
                                $(function () {
                                    element.puilistbox('disable');

                                });

                            }
                        });
                    }

                    // Specify how UI should be updated
                    ngModel.$render = function () {
                        // TODO Check if only single selection mode.
                        // TODO support multiple selection mode.
                        if (ngModel.$viewValue) {
                            element.puilistbox('unselectAll');
                            if (multiple) {
                                if (angular.isArray(ngModel.$viewValue)) {
                                    angular.forEach(ngModel.$viewValue, function(item) {
                                        element.puilistbox('selectItem', parseInt(item, 10));
                                    });
                                }
                            } else {
                                element.puilistbox('selectItem', parseInt(ngModel.$viewValue, 10));
                            }
                        }

                    };

                    // Listen for selection events
                    element.bind('puilistboxitemselect', function (event, option) {
                        if (options.callback) {
                            options.callback(option.value);
                        }
                    });

                }
            }
        };
    });

}());
