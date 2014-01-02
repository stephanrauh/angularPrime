/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiDropdown', ['$compile', '$parse', 'puiComponent.componentHelper',
                                function ($compile, $parse, componentHelper) {

        function createHtmlTag(element, attrs) {
            var contents = '<select pui-dropdown ',
                handledAttributes = 'puiDropdown'.split(' '),
                attrsToRemove = 'id ngModel puiDropdown ngOptions'.split(' ');

            contents += ' data-angularPrime-forceWidth="true" ';

            contents += componentHelper.handleAttributes(element, attrs, handledAttributes, attrsToRemove, contents);

            contents += ' />';

            element.empty().html(contents);

        }

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

        function linkFn(scope, element, attrs, ngModel) {

            if ('SELECT' !== element[0].nodeName) {
                componentHelper.handleCustomContent(scope, element);
                createHtmlTag(element, attrs);
                $compile(element.contents())(scope);
                return;
            }

            executeNgOptions(element, attrs, ngModel);

            var options = scope.$eval(attrs.puiDropdown) || {},
                content = element.parent().data('content'),
                contentFn;

            if (content) {
                contentFn = function (option) {
                    var holderValues = {"%LABEL%": option.text, "%VALUE%": option.value};
                    return content.replace(/%\w+%/g, function (all) {
                        return holderValues[all] || all;
                    });
                };
            }

            options.editable = (options.editable !== undefined) ? options.editable : false;
            if (options.editable) {
                // TODO Give warning when explicit useLabel set to False as not compatible with editable
                options.useLabel = true;
            }
            options.useLabel = (options.useLabel !== undefined) ? options.useLabel : false;
            options.filter = (options.filter !== undefined) ? options.filter : false;
            options.effect = options.effect || 'fade';
            options.effectSpeed = options.effectSpeed || 'normal';
            options.filterMatchMode = options.filterMatchMode || 'startsWith';
            options.caseSensitiveFilter = (options.caseSensitiveFilter !== undefined) ? options.caseSensitiveFilter : false;
            options.scrollHeight = options.scrollHeight || 200;


            $(function () {
                element.puidropdown({
                    editable: options.editable,
                    filter: options.filter,
                    effect: options.effect,
                    effectSpeed: options.effectSpeed,
                    filterMatchMode: options.filterMatchMode,
                    caseSensitiveFilter: options.caseSensitiveFilter,
                    filterFunction: options.filterFunction,
                    scrollHeight: options.scrollHeight,
                    content: contentFn
                });
            });

            // Specify how UI should be updated
            ngModel.$render = function () {
                if (options.useLabel) {
                    element.puidropdown('selectValue', ngModel.$viewValue);
                } else {
                    element.puidropdown('selectIndex', ngModel.$viewValue);
                }
            };

            // Listen for change events to enable binding
            element.bind('puidropdownchange', function () {
                scope.safeApply(read());
                if (options.callback) {
                    var idx = element.puidropdown('getSelectedValue'),
                        label = element.puidropdown('getCustomInputVal'); // This also works when not editable
                    options.callback(idx, label);
                }
            });

            read(); // initialize

            // Write data to the model
            function read() {
                var sel;
                if (options.editable) {
                    sel = element.puidropdown('getCustomInputVal');
                } else {
                    if (options.useLabel) {
                        sel = element.puidropdown('getSelectedLabel');

                    } else {
                        sel = element.puidropdown('getSelectedValue');
                    }
                }
                ngModel.$setViewValue(sel);
            }

            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, function (value) {

                    if (value === false) {
                        $(function () {
                            element.puidropdown('enable');
                        });
                    } else {
                        $(function () {
                            element.puidropdown('disable');

                        });

                    }
                });
            }


        }

        return {
            restrict: 'EA',
            require: '?ngModel', // get a hold of NgModelController
            link: linkFn
        };

    }]

);

}());
