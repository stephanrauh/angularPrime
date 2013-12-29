/*globals angular PUI */

(function () {
    "use strict";

    angular.module('angular.prime.config', []).value('angular.prime.config', {
            labelPrefix: 'lbl'
        });

    angular.module('angular.prime', ['angular.prime.config']).run(['$rootScope', function ($rootScope) {

        $rootScope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

    }]);

    angular.module('angular.prime').factory('puiComponent.componentHelper', ['$compile', function ($compile) {

        var puiComponentHelper = {};

        puiComponentHelper.handleAttributes = function (element, attrs, handledAttributes, attrsToRemove) {
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

        puiComponentHelper.handleCustomContent = function(scope, element) {
            $compile(element.children('[pui-content]'))(scope);
            $compile(element.children('pui-content'))(scope);
        };

        return puiComponentHelper;
    }]);

    angular.module('angular.prime').directive('puiContent', ['$log', function ($log) {
        var supportedPlaceHolderNames = ['%LABEL%','%VALUE%'];

        function linkFn (scope, element, attrs) {
            var content = element.html(),
                placeHolders = content.match(/%\w+%/g);

            for(var i = 0; i < placeHolders.length; i++) {
                if (!PUI.inArray(supportedPlaceHolderNames, placeHolders[i])) {
                    $log.error(placeHolders[i] + ' is not a supported placeHolder, only %LABEL% and %VALUE% is.');
                }
            }
            element.parent().data('content', content.replace('pui-src','src'));
            element.empty().html('');  // remove the html code from this element as we don't want it here anymore.
        }

        return {
            restrict: 'EA',
            link: linkFn
        };
    }]);

    angular.module('angular.prime').value('version', "v0.6");

}());
