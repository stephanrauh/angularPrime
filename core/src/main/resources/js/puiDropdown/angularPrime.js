/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiDropdown', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: '?ngModel', // get a hold of NgModelController
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs, ngModel) {

                    if (attrs.ngOptions) {
                        // This builds the Option tags
                        ngModel.$render();
                        // Remove the null option added by angular
                        var firstChild = element.children()[0];
                        if (firstChild.text === '' && firstChild.value === '?') {
                            element[0].removeChild(firstChild);
                        }

                    }

                    var options = scope.$eval(attrs.puiDropdown) || {};

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
                            editable: options.editable ,
                            filter : options.filter ,
                            effect: options.effect ,
                            effectSpeed: options.effectSpeed ,
                            filterMatchMode: options.filterMatchMode ,
                            caseSensitiveFilter: options.caseSensitiveFilter ,
                            filterFunction: options.filterFunction ,
                            scrollHeight: options.scrollHeight
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
                    function read () {
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


                };
            }
        };

    }]

);

}());
