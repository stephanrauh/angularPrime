/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').factory('puiInput.helper', function () {

    var puiInputHelper = {};

    puiInputHelper.defineLabel = function(id, label, prefix) {
        var contents = '';

        contents += '<label id="'+ prefix + id + '"';
        contents += 'for="' + id + '"';
        contents += '>'+label;
        contents += '</label>';

        return contents;
    };

    return puiInputHelper;
});


angular.module('angular.prime').directive('puiInput', [ '$compile', 'puiComponent.componentHelper',
                                        function ($compile, componentHelper) {

    function modelRequired(inputType) {
        return inputType === 'checkbox' || inputType === 'radio';
    }

    function createHtmlTag(element, attrs, type) {
        var contents = '<input pui-input',
            handledAttributes = 'puiInput puiBinding name value id'.split(' '),
            attrsToRemove = 'puiInput name value id'.split(' ');

        if (attrs.puiBinding) {
            contents += '="' + attrs.puiBinding + '"';
        } else {
            contents += ' ';
        }
        contents += ' type="' + type + '" ';
        if (type === 'radio') {
            contents += 'name="' + attrs.name + '" ';
            contents += 'value="' + attrs.value + '" ';
        }

        contents += ' id="' + attrs.id + '" ';

        contents += componentHelper.handleAttributes(element, attrs, handledAttributes, attrsToRemove, contents);

        contents += ' />';

        element.empty().html(contents);

    }

    function handlePassword(element, options) {
        $(function () {
            if (options.noPasswordStrength) {
                element.puiinputtext();
            } else {
                options.inline = (options.inline !== undefined) ? options.inline : false;
                element.puipassword({
                    inline: options.inline,
                    promptLabel: options.promptLabel,
                    weakLabel: options.weakLabel,
                    goodLabel: options.goodLabel,
                    strongLabel: options.strongLabel
                });
            }
        });
    }

    function handleCheckbox(element, attrs, scope, ngModel) {
        $(function () {
            element.puicheckbox();

            if (attrs.checked) {
                scope.safeApply(function () {
                    ngModel.$setViewValue(true);
                });
            }

        });

        // Write data to the model
        function storeViewValue() {

            $(function () {
                var checked = element.puicheckbox('isChecked');
                var viewValue = element.val();
                if (!checked) {
                    viewValue = null;
                }
                scope.safeApply(function () {
                    ngModel.$setViewValue(viewValue);
                });
            });

        }

        // Specify how UI should be updated
        ngModel.$render = function () {
            $(function () {
                if (ngModel.$viewValue) {
                    element.puicheckbox('check', true, true);
                } else {
                    element.puicheckbox('uncheck', true, true);
                }

            });

        };


        // Listen for change events to enable binding
        element.bind('puicheckboxchange', function () {
            storeViewValue();
        });
    }

    function handleRadiobutton(element, attrs, scope, ngModel) {
        $(function () {
            element.puiradiobutton();
        });

        // Write data to the model
        function storeViewValue() {
                $(function () {
                    var checked = element.puiradiobutton('isChecked');
                    var viewValue = element.val();
                    if (checked) {
                        scope.safeApply(function () {
                            ngModel.$setViewValue(viewValue);
                        });
                    }
                });

        }

        // Specify how UI should be updated

        ngModel.$render = function () {
            $(function () {
                if (ngModel.$viewValue == element.val() && !element.puiradiobutton('isChecked')) {
                    element.trigger('click');
                }
            });
        };

        // Listen for change events to enable binding
        element.bind('puiradiobuttonchange', function () {
            storeViewValue();
        });
    }

    function linkFn(scope, element, attrs, ngModel) {
        if (!ngModel && modelRequired(attrs.type)) {
            return;
        } // do nothing if no ng-model

        if (attrs.type === 'range') {
            return;
            // When input type range, themeing has not much sense.
        }
        var htmlElementName = element[0].nodeName,
            inputType = attrs.type  || 'text',
            options = scope.$eval(attrs.puiInput) || {},
            checkbox = false,
            radiobutton = false,
            password = false;

        if ('PUI-INPUT' === htmlElementName) {
            createHtmlTag(element, attrs, inputType);
            $compile(element.contents())(scope);
            return;
        }

        if ('INPUT' === htmlElementName) {
            if (attrs.type === 'password') {
                handlePassword(element, options);
                password = true;
            }

            if (attrs.type === 'checkbox') {
                handleCheckbox(element, attrs, scope, ngModel);
                checkbox = true;
            }

            if (attrs.type === 'radio') {
                handleRadiobutton(element, attrs, scope, ngModel);
                radiobutton = true;
            }

            $(function () {
                if (!checkbox && !radiobutton && !password) {
                    element.puiinputtext();
                }
            });
        }

            $(function () {

                var options = scope.$eval(attrs.puiInput) || {};

                if ('TEXTAREA' === htmlElementName) {
                    var autoComplete = attrs.puiAutocomplete;
                    var completeSourceMethod = scope.$eval(attrs.puiAutocomplete);

                    options.autoResize = (options.autoResize !== undefined) ? options.autoResize : false;
                    element.puiinputtextarea({
                        autoResize: options.autoResize,
                        autoComplete: autoComplete,
                        scrollHeight: options.scrollHeight,
                        completeSource: completeSourceMethod,
                        minQueryLength: options.minQueryLength,
                        queryDelay: options.queryDelay,
                        counter: $(options.display),
                        counterTemplate: options.template,
                        maxlength: options.maxLength
                    });

                    if (options.display) {
                        // At this moment, we don't have the scope value yet on the element
                        scope.$watch(ngModel.$viewValue, function (value) {
                            element.puiinputtextarea('updateCounter');
                        });
                    }

                }

                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, function (value) {

                        if (value === false) {
                            $(function () {
                                if (checkbox) {
                                    element.puicheckbox('enable');
                                } else {
                                    if (radiobutton) {
                                        element.puiradiobutton('enable');
                                    } else {
                                        element.puiinputtext('enable');
                                    }
                                }
                            });
                        } else {
                            $(function () {
                                if (checkbox) {
                                    element.puicheckbox('disable');
                                } else {
                                    if (radiobutton) {
                                        element.puiradiobutton('disable');
                                    } else {
                                        element.puiinputtext('disable');
                                    }
                                }

                            });

                        }
                    });
                }
            });
    }

    return {
        restrict: 'EA',
        priority: angular.version.minor > 1 ? 1500 : 0,
        require: '?ngModel', // get a hold of NgModelController
        link: linkFn
    };
}]);

angular.module('angular.prime').directive('puiCheckbox', ['$compile', '$parse', 'puiComponent.componentHelper', 'puiInput.helper', 'angular.prime.config',
                                                function ($compile, $parse,  componentHelper, puiInputHelper, angularPrimeConfig) {

    function linkFn(scope, element, attrs) {
        var id = attrs.id,
            label = '',
            contents = '<input type="checkbox" pui-input ',
            handledAttributes = 'id ngModel puiInput ngShow ngHide puiCheckbox'.split(' '),
            attrsToRemove = 'id ngModel puiInput'.split(' ');

        try {
            $parse(attrs.puiCheckbox); // see if it is a valid AngularExpression
            label = scope.$eval(attrs.puiCheckbox) || attrs.puiCheckbox;
        } catch (e) {
            label = attrs.puiCheckbox;
        }

        contents += 'id="' + id + '"';
        contents += 'ng-model="' + attrs.ngModel + '" ';

        contents += componentHelper.handleAttributes(element, attrs, handledAttributes, attrsToRemove, contents);

        contents += ' />';

        contents += puiInputHelper.defineLabel(id, label, angularPrimeConfig.labelPrefix);

        element.html(contents);


        $compile(element.contents())(scope);

    }

    return {
        restrict: 'EA',
        priority: 1005,
        link: linkFn
    };

}]);

angular.module('angular.prime').directive('puiRadiobutton', ['$compile', '$parse', 'puiComponent.componentHelper', 'puiInput.helper', 'angular.prime.config',
                                                    function ($compile, $parse, componentHelper, puiInputHelper, angularPrimeConfig) {

    function linkFn(scope, element, attrs) {
        var id = attrs.id,
            label = '',
            contents = '<input type="radio" pui-input ',
            handledAttributes = 'id ngModel puiInput ngShow ngHide puiRadiobutton name value'.split(' '),
            attrsToRemove = 'id ngModel puiInput name value'.split(' ');

        try {
            $parse(attrs.puiRadiobutton); // see if it is a valid AngularExpression
            label = scope.$eval(attrs.puiRadiobutton) || attrs.puiRadiobutton;
        } catch (e) {
            label = attrs.puiRadiobutton;
        }

        contents += 'id="' + id + '"';
        contents += 'ng-model="' + attrs.ngModel + '" ';
        contents += 'name="' + attrs.name + '" ';
        contents += 'value="' + attrs.value + '" ';

        contents += componentHelper.handleAttributes(element, attrs, handledAttributes, attrsToRemove, contents);

        contents += ' />';

        contents += puiInputHelper.defineLabel(id, label, angularPrimeConfig.labelPrefix);

        element.html(contents);

        $compile(element.contents())(scope);

    }
    return {
        restrict: 'EA',
        priority: 1005,
        link: linkFn
    };
}]);

}());

