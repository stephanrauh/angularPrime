/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiNotify', function () {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    // TODO check if no inline object created.
                    var options = scope.$eval(attrs.puiNotify) || {},
                        userTrigger = true; // because we support user closable and programmatic.

                    if (!(typeof options.visible == 'boolean')) {
                        throw new Error('The options object ' + attrs.puiNotify + ' needs a boolean property visible');
                    }
                    options.position = options.position || 'top';
                    options.animate = (options.animate !== undefined) ? options.animate : true;
                    options.effectSpeed = options.effectSpeed || 'normal';
                    options.easing = options.easing || 'swing';
                    $(function () {
                        element.puinotify({
                            position : options.position,
                            animate: options.animate,
                            effectSpeed: options.effectSpeed,
                            easing: options.easing
                        });
                    });

                    scope.$watch(attrs.puiNotify + '.visible', function (value) {
                        if (value === true) {
                            $(function () {
                                element.puinotify('show');
                            });

                        } else {
                            $(function () {
                                userTrigger = false;
                                element.puinotify('hide');
                            });

                        }
                    });
                    // required  when you close the notify with the close icon.
                    element.bind("puinotifyafterhide", function () {
                        scope.safeApply(function () {
                            scope[attrs.puiNotify].visible = false;
                            if (options.callback && userTrigger) {
                                options.callback();
                            }
                            userTrigger = true;
                        });
                    });
                };
            }
        };

    }

);

}());
