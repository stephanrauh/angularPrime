/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiMenu', ['$log', function ($log) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs) {

                var options = scope.$eval(attrs.puiMenu) || {};
                options.popup = false;
                if (options.trigger) {
                    var triggerElement = $(options.trigger);
                    if (triggerElement !== undefined) {
                        options.popup = true;
                        options.trigger = triggerElement;
                    } else {
                        options.trigger = null;
                    }

                }
                if ( options.isContextMenu && options.isSlideMenu) {
                    throw new Error("ContextMenu can't be combined with the SlideMenu");
                }
                $(function() {
                    var hasSubMenu = element.find("ul").length > 0,
                        hasH3Element = element.find("h3").length > 0;

                    if (hasSubMenu || ! hasH3Element) {
                        if (hasH3Element) {
                            $log.warn("Menu with submenu and h3 elements found");
                        }
                        if (options.isContextMenu) {
                            element.puicontextmenu({
                                popup: options.popup,
                                trigger: options.trigger
                            });

                        } else {
                            if (options.isSlideMenu) {
                                element.puislidemenu({
                                    popup: options.popup,
                                    trigger: options.trigger
                                });

                            } else {
                                element.puitieredmenu({
                                    popup: options.popup,
                                    trigger: options.trigger,
                                    autoDisplay: options.autoDisplay
                                });

                            }
                        }
                    } else {
                        element.puimenu({
                            popup: options.popup,
                            trigger: options.trigger
                        });

                    }
                });
            };
        }
    };
}]);

}());
