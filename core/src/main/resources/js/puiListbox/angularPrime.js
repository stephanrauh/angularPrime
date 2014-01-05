/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').directive('puiListbox', ['$compile', 'puiComponent.componentHelper',
                            function ($compile, componentHelper) {

        function createHtmlTag(element, attrs) {
            var contents = '<select pui-listbox ',
                handledAttributes = 'puiListbox'.split(' '),
                attrsToRemove = 'id ngModel puiListbox ngOptions'.split(' ');

            contents += componentHelper.handleAttributes(element, attrs, handledAttributes, attrsToRemove, contents);

            contents += ' />';

            element.empty().html(contents);

        }

        // Identical function then the one in puidropdown
        function executeNgOptions(element, attrs, ngModel) {
            if (attrs.ngOptions) {
                // This builds the Option tags
                ngModel.$render();
                // Remove the null option added by angular
                var firstChild = element.children()[0];
                if (firstChild.text === '' && firstChild.value === '?') {
                    element[0].removeChild(firstChild);
                }
            }
        }

        function readValue(element, ngModel, multiple) {
            var selectedValues = element.puilistbox('getSelectedValue');
            if (!multiple) {
                ngModel.$setViewValue(selectedValues[0]);
            } else {
                ngModel.$setViewValue(selectedValues);
            }
        }

        function linkFn(scope, element, attrs, ngModel) {
            var options = scope.$eval(attrs.puiListbox) || {},
                multiple = element.prop("multiple"),
                content = element.parent().data('content'),
                contentFn;

            if ('SELECT' !== element[0].nodeName) {
                componentHelper.handleCustomContent(scope, element);
                createHtmlTag(element, attrs);
                $compile(element.contents())(scope);
                return;
            }

            executeNgOptions(element, attrs, ngModel);

            // Identical part in puidropDown
            if (content) {
                contentFn = function (option) {
                    var holderValues = {"%LABEL%": option.text, "%VALUE%": option.value};
                    return content.replace(/%\w+%/g, function (all) {
                        return holderValues[all] || all;
                    });
                };
            }

            element.puilistbox({
                scrollHeight: options.scrollHeight,
                content: contentFn
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
                            angular.forEach(ngModel.$viewValue, function (item) {
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

            element.bind('puilistboxchange', function () {
                scope.safeApply(
                    readValue(element, ngModel, multiple)
                );
            });

        }

        return {
            restrict: 'EA',
            require: '?ngModel', // get a hold of NgModelController
            link: linkFn
        };

    }]

);

}());
