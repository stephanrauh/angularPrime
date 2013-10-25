/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiPicklist', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs, ngModel) {
                var options = scope.$eval(attrs.puiPicklist) || {},
                    container = element.wrap("<div/>").parent(),
                    withinEvent = false,
                    eventType = null,
                    data = null;

                if (angular.isArray(options)) {
                    data = options;
                    options = {};
                } else {
                    data = options.data;
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
                        sourceData: data
                    });
                });

                function addItem(value) {
                    var data = ngModel.$viewValue;
                    if (data.indexOf(value) === -1) {
                        data.push(value);
                        ngModel.$setViewValue(data);
                    }
                    eventType = "ADD";
                }

                function removeItem(value) {
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
                                processTransfer(itemValue)
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
                        values.push($(item).data()['item-value'])
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
                }, true)

            };

        }
    };
});

}());
