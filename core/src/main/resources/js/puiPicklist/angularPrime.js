/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiPicklist', ['$compile', 'puiComponent.componentHelper',
                    function ($compile, componentHelper) {

    var eventType = null

    function createHtmlTag(element, attrs) {
        var contents = '<select pui-picklist ',
            handledAttributes = 'puiPicklist'.split(' '),
            attrsToRemove = 'id ngModel puiPicklist ngOptions'.split(' ');

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

    function addItem(ngModel, value) {
        var data = ngModel.$viewValue;
        if (data.indexOf(value) === -1) {
            data.push(value);
            ngModel.$setViewValue(data);
        }
        eventType = "ADD";
    }

    function removeItem(ngModel, value) {
        var data = ngModel.$viewValue,
            rowIndex = data.indexOf(value);

        if (rowIndex !== -1) {
            data.splice(rowIndex, 1);
        }

        ngModel.$setViewValue(data);
        eventType = "REMOVE";
    }

    function isSource(list) {
        return list.parent().hasClass('pui-picklist-source');
    }

    function linkFn(scope, element, attrs, ngModel) {
        if ('SELECT' !== element[0].nodeName) {
            componentHelper.handleCustomContent(scope, element);
            createHtmlTag(element, attrs);
            $compile(element.contents())(scope);
            return;
        }

        var options = scope.$eval(attrs.puiPicklist) || {},
            content = element.parent().data('content'),
            container = element.wrap("<div/>").parent(),
            withinEvent = false,
            data = null,
            contentFn;

        if (angular.isArray(options)) {
            data = options;
            options = {};
        } else {
            data = options.data;
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

        $(function () {
            container.puipicklist({
                filter: options.filter,
                filterMatchMode: options.filterMatchMode,
                filterFunction: options.filterFunction,
                sourceCaption: options.sourceCaption,
                targetCaption: options.targetCaption,
                showSourceControls: options.showSourceControls,
                showTargetControls: options.showTargetControls,
                sourceData: data,
                content: contentFn
            });
        });

        // Listen for selection events
        container.bind('puipicklisttransfer', function (event, data) {
            var isFromSource = isSource(data.from),
                isToSource = isSource(data.to),
                processTransfer = null;


            if (isFromSource && !isToSource) {
                processTransfer = addItem;
            }

            if (!isFromSource && isToSource) {
                processTransfer = removeItem;
            }
            if (processTransfer) {
                withinEvent = true;
                data.items.each(function (index, item) {
                    var itemValue = $(item).data()['item-value'];
                    scope.safeApply(function () {
                        processTransfer(ngModel, itemValue);
                    });
                    if (options.callback) {
                        options.callback(eventType, itemValue);
                    }
                });
                withinEvent = false;
            }
        });

        container.bind('puipicklistreorder', function (event, data) {
            var values = [];

            data.items.each(function (index, item) {
                values.push($(item).data()['item-value']);
            });
            scope.safeApply(
                ngModel.$setViewValue(values)
            );
        });

        // Specify how UI should be updated
        ngModel.$render = function () {
            if (ngModel.$viewValue) {
                $(function () {
                    container.puipicklist('deselectAll');
                    angular.forEach(ngModel.$viewValue, function (item) {
                        container.puipicklist('selectValue', item);
                    });
                });
            }

        };

        if (attrs.ngDisabled) {
            scope.$watch(attrs.ngDisabled, function (value) {

                if (value === false) {
                    $(function () {
                        container.puipicklist('enable');
                    });
                } else {
                    $(function () {
                        container.puipicklist('disable');

                    });

                }
            });
        }

        scope.$watch(attrs.ngModel, function () {
            if (!withinEvent) {

                if (container.puipicklist('selectedValues').length !== ngModel.$viewValue.length) {

                    ngModel.$render();
                }
            }
        }, true);

    }

    return {
        restrict: 'EA',
        require: '?ngModel', // get a hold of NgModelController
        link: linkFn
    };
}]);

}());
