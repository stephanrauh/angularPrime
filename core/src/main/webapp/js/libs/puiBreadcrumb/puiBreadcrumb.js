/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiBreadcrumb', ['$compile',
                                                    function ($compile) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink(scope, element, attrs) {

                var options = scope.$eval(attrs.puiBreadcrumb) || {} ,
                    dynamicBreadcrumb = angular.isArray(options) || angular.isArray(options.items) ,
                    breadcrumbItems = [] ,
                    initialCall = true;

                function renderBreadcrumb() {
                    var htmlContents = '' ,
                        globalActionText = null;
                    angular.forEach(breadcrumbItems, function (breadcrumbItem) {
                        var actionText = breadcrumbItem.onclick ,
                            hasPlaceholder = actionText !== undefined && actionText.indexOf('{id}') > -1;

                        if (actionText === undefined && globalActionText !== null) {
                            actionText = globalActionText;
                        }
                        if (breadcrumbItem.globalAction)  {
                            globalActionText = actionText;
                        }

                        if (hasPlaceholder) {
                            actionText = actionText.replace('{id}', breadcrumbItem.id);
                        }

                        htmlContents = htmlContents + '<li id="' + breadcrumbItem.id + '"><a ';
                        if (actionText !== undefined) {
                            htmlContents = htmlContents + 'ng-click="' + actionText +'"';
                        }
                        htmlContents = htmlContents + '>' + breadcrumbItem.label + '</a></li>';
                    });
                    element.html(htmlContents);
                    $compile(element.contents())(scope);
                    $(function () {
                        if (!initialCall) {
                            element.puibreadcrumb('destroy', {});
                            element.unwrap();
                        }
                        element.puibreadcrumb({

                        });
                        initialCall = false;

                    });
                }

                if (dynamicBreadcrumb) {

                    if (angular.isArray(options)) {
                        scope.$watch(attrs.puiBreadcrumb, function(x) {
                            breadcrumbItems = x;
                            renderBreadcrumb();
                        }, true);

                    } else {
                        scope.$watch(attrs.puiBreadcrumb+'.items', function(x) {
                            breadcrumbItems = x;
                            renderBreadcrumb();
                        }, true);
                    }

                } else {
                    element.puibreadcrumb({
                        homeIcon: options.homeIcon
                    });

                }

            };
        }
    };
}]);

}());
;/*globals $ */

/**
 * PrimeUI BreadCrumb Widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puibreadcrumb", {

        // Added for AngularPrime
        options: {
            homeIcon: 'ui-icon-home'
        },

        _create: function() {
            this.element.wrap('<div class="pui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" role="menu">');

            var customIcon = this.options.homeIcon;  // Added for AngularPrime
            this.element.children('li').each(function(index) {
                var listItem = $(this);

                listItem.attr('role', 'menuitem');
                var menuitemLink = listItem.children('a');
                menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');

                if(index > 0 || customIcon === null)  // Changed for AngularPrime
                    listItem.before('<li class="pui-breadcrumb-chevron ui-icon ui-icon-triangle-1-e"></li>');
                else
                    menuitemLink.addClass('ui-icon ' + customIcon); // Changed for AngularPrime
            });
        }
    });
});
