/*globals angular $ */
(function () {
    "use strict";

    angular.module('angular.prime').directive('puiTerminal',
        function () {
            return {
                restrict: 'A',
                compile: function (element, attrs) {
                    return function postLink (scope, element, attrs) {
                        var options = scope.$eval(attrs.puiTerminal) || {},
                            handler;

                        if (angular.isFunction(options)) {
                            handler = options;
                            options = {};
                        } else {
                            if (!options.terminalHandler) {
                                throw ("terminalHandler property required for functionality");
                            }
                            handler = options.terminalHandler;
                        }
                        scope.clearTerminal = function() {
                            $(function () {
                                element.puiterminal('clear', {});
                            });
                        };

                        $(function () {
                            element.puiterminal({
                                welcomeMessage: options.welcomeMessage,
                                prompt: options.prompt,
                                handler : function(command, response) {

                                    response.call(this, handler.call(this, command));
                                }
                            });

                        });
                    };
                }
            };


});

}());
