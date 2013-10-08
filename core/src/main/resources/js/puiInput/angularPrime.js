/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').factory('puiInput.helper', function () {

    var puiInputHelper = {};

    puiInputHelper.handleAttrubutes = function (element, attrs, handledAttributes, attrsToRemove) {
        var contents = '';
        for (var property in attrs) {
            if (attrs.hasOwnProperty(property) && property.substring(0, 1) !== '$') {
                if (handledAttributes.indexOf(property) === -1) {
                    // attrs.$attr[property] is the original name of the attribute on the element
                    contents += attrs.$attr[property] + '="' + attrs[property] + '" ';
                }
                if (attrsToRemove.indexOf(property) !== -1) {
                    element.removeAttr(attrs.$attr[property]);
                }
            }

        }
        return contents;
    };

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


angular.module('angular.prime').directive('puiInput', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model

            if (attrs.type === 'range') {
                return;
                // When input type range, theming has not much sense.
            }
            var htmlElementName = element[0].nodeName;
            $(function () {
                var checkbox = false;
                var radiobutton = false;
                var password = false;
                var options = scope.$eval(attrs.puiInput) || {};
                var helper = {};

                if ('INPUT' === htmlElementName) {
                    if (attrs.type === 'password') {
                        options.inline = (options.inline !== undefined) ? options.inline : false;
                        element.puipassword({
                            inline: options.inline,
                            promptLabel: options.promptLabel || 'Please enter a password',
                            weakLabel: options.weakLabel || 'Weak',
                            goodLabel: options.goodLabel || 'Medium',
                            strongLabel: options.strongLabel || 'Strong'
                        });
                        password = true;
                    }
                    if (attrs.type === 'checkbox') {
                        element.puicheckbox();
                        if (attrs.checked) {
                            scope.safeApply(function () {
                                ngModel.$setViewValue(true);
                            });
                        }
                        checkbox = true;
                    }
                    if (attrs.type === 'radio') {
                        element.puiradiobutton();

                        radiobutton = true;
                    }
                    if (!checkbox && !radiobutton && !password) {
                        element.puiinputtext();
                    }

                }
                if ('TEXTAREA' === htmlElementName) {
                    var autoComplete = attrs.puiAutocomplete;
                    var completeSourceMethod = scope.$eval(attrs.puiAutocomplete);

                    options.autoResize = (options.autoResize !== undefined) ? options.autoResize : false;
                    element.puiinputtextarea({
                        autoResize: options.autoResize,
                        autoComplete: autoComplete,
                        scrollHeight: options.scrollHeight || 150,
                        completeSource: completeSourceMethod,
                        minQueryLength: options.minQueryLength || 3,
                        queryDelay: options.queryDelay || 700,
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
                if (checkbox) {
                    // Write data to the model
                    helper = {
                        read: function () {
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
                    };

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
                        helper.read();
                    });

                }

                if (radiobutton) {
                    // Write data to the model
                    helper = {
                        read: function () {
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
                    };

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
                        helper.read();
                    });

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
    };
});

angular.module('angular.prime').directive('puiCheckbox', ['$compile', '$parse', 'puiInput.helper', 'angular.prime.config',
                                                function ($compile, $parse,  puiInputHelper, angularPrimeConfig) {

    return {
        restrict: 'EA',
        priority: 1005,
        compile: function (element, attrs) {

            return function postLink(scope, element, attrs) {
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

                contents += puiInputHelper.handleAttrubutes(element, attrs, handledAttributes, attrsToRemove, contents);

                contents += ' />';

                contents += puiInputHelper.defineLabel(id, label, angularPrimeConfig.labelPrefix);

                element.html(contents);


                $compile(element.contents())(scope);

            };
        }
    };
}]);

angular.module('angular.prime').directive('puiRadiobutton', ['$compile', '$parse', 'puiInput.helper', 'angular.prime.config',
                                                    function ($compile, $parse, puiInputHelper, angularPrimeConfig) {

    return {
        restrict: 'EA',
        priority: 1005,
        compile: function (element, attrs) {

            return function postLink(scope, element, attrs) {
                var id = attrs.id,
                    label = '',
                    contents = '<input type="radio" pui-input ',
                    handledAttributes = 'id ngModel puiInput ngShow ngHide puiRadiobutton name value'.split(' '),
                    attrsToRemove = 'id ngModel puiInput'.split(' ');

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

                contents += puiInputHelper.handleAttrubutes(element, attrs, handledAttributes, attrsToRemove, contents);

                contents += ' />';

                contents += puiInputHelper.defineLabel(id, label, angularPrimeConfig.labelPrefix);

                element.html(contents);

                $compile(element.contents())(scope);

            };
        }
    };
}]);

}());

