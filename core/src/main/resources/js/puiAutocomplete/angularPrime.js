/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiAutocomplete', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model

            var htmlElementName = element[0].nodeName;
            if ('TEXTAREA' === htmlElementName) {
                // This is handles by the pui-input on a text area element.
                return;
            }
            var options = scope.$eval(attrs.puiAutocomplete) || {},
                optionIsFunction = angular.isFunction(options),
                optionIsArray = angular.isArray(options),
                completeSource = null;

            if (optionIsFunction || optionIsArray) {
                completeSource = options;
                options = {};
            } else {
                options.dropdown = (options.dropdown !== undefined) ? options.dropdown : false;
                options.multiple = (options.multiple !== undefined) ? options.multiple : false;
                options.forceSelection = (options.forceSelection !== undefined) ? options.forceSelection : false;

                options.delay = options.delay || 300;
                options.minQueryLength = options.minQueryLength || 1;
                options.scrollHeight = options.scrollHeight || 200;
                options.effectSpeed = options.effectSpeed || 'normal';
                options.caseSensitive = (options.caseSensitive !== undefined) ? options.caseSensitive : false;
                if (!options.completeSource) {
                    throw ("completeSource property required for auto complete functionality");
                }
                completeSource = options.completeSource;
            }

            $(function () {

                element.puiautocomplete({
                    dropdown : options.dropdown ,
                    multiple : options.multiple ,
                    completeSource: completeSource ,
                    forceSelection: options.forceSelection ,

                    delay: options.delay ,
                    minQueryLength: options.minQueryLength ,
                    scrollHeight: options.scrollHeight ,
                    effectSpeed: options.effectSpeed ,
                    caseSensitive: options.caseSensitive ,
                    effect: options.effect ,
                    effectOptions: options.effectOptions
                });

                var helper = {
                    read: function (label, addForMultiple) {
                        $(function () {
                            if (options.multiple) {

                                if (addForMultiple) {
                                    scope.safeApply(function () {
                                        options.multipleValues.push(label);
                                        ngModel.$setViewValue("");
                                    });
                                } else {
                                    var index = options.multipleValues.indexOf(label);
                                    scope.safeApply(function () {
                                        options.multipleValues.splice(index, 1);
                                    });
                                }
                            } else {
                                scope.safeApply(function () {
                                    ngModel.$setViewValue(element.val());
                                });
                            }

                        });

                    }
                };

                // Listen for select events to enable binding
                element.bind('puiautocompleteselect', function (event, token) {
                    var label = (options.multiple) ? token : null;
                    helper.read(label, true);
                    if (options.callback) {
                        options.callback(token);
                    }
                });

                element.bind('puiautocompleteunselect', function (event, token) {
                    var label = (options.multiple) ? token : null;
                    helper.read(label, false);
                });

                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, function (value) {
                        if (value === false) {
                            $(function () {
                                element.puiautocomplete('enable');
                            });
                        } else {
                            $(function () {
                                element.puiautocomplete('disable');

                            });

                        }
                    });
                }


            });


        }

    };

});

}());
