/*globals angular $ */
(function () {
    "use strict";

angular.module('angular.prime').directive('puiTabview', ['$http', '$templateCache', '$compile', '$log',
                                                    function ($http, $templateCache, $compile, $log) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs) {
                var options = scope.$eval(attrs.puiTabview) || {};
                var dynamicPanels = angular.isArray(options) || angular.isArray(options.urls);
                var content = [];
                var urls = [];
                var remaining;
                var initialCall = true;

                function supportForCloseableTabs() {
                    if (options.closeable === true) {
                        element.find('a').after('<span class="ui-icon ui-icon-close"></span>');
                    }
                }

                function generateHtml(contentArray, tagName) {
                    var filtered = $.grep(contentArray, function(n, i){
                        return tagName === n.nodeName;
                    });
                    var result = '';
                    angular.forEach(filtered, function (part) {
                        result = result+ part.outerHTML;
                    });
                    return result;
                }

                function renderTabPanels(panels) {
                    var htmlContent = '';
                    angular.forEach(panels, function(panelContent) {
                        htmlContent = htmlContent + panelContent;
                    });

                    var tmp = $.parseHTML(htmlContent);

                    var titleHtml = generateHtml(tmp, 'LI');
                    var panelHtml = generateHtml(tmp, 'DIV');

                    element.html('<ul>'+titleHtml+'</ul><div>'+panelHtml+'</div>');
                    supportForCloseableTabs();
                    $compile(element.contents())(scope);
                    $(function () {
                        if (!initialCall) {
                            element.puitabview('destroy', {});
                        }
                        element.puitabview({
                            orientation: options.orientation || 'top'
                        });
                        initialCall = false;

                    });
                }

                function loadHtmlContents(idx, url) {
                    $http.get(url, {cache: $templateCache}).success(function (response) {
                        content[idx] = response;
                        remaining--;
                        if (remaining === 0) {
                            renderTabPanels(content);
                        }
                    }).error(function () {
                            $log.error('Error loading included file ' + url + 'for panel of accordion');
                        });

                }

                function loadAndRenderTabPanels() {
                    remaining = urls.length;
                    for (var i = 0; i < urls.length; i++) {
                        loadHtmlContents(i, urls[i]);
                    }
                }

                if (dynamicPanels) {
                    if (angular.isArray(options)) {
                        scope.$watch(attrs.puiTabview, function(x) {
                            urls = x;
                            loadAndRenderTabPanels();
                        }, true);

                    } else {
                        scope.$watch(attrs.puiTabview+'.urls', function(x) {
                            urls = x;
                            loadAndRenderTabPanels();
                        }, true);
                    }

                    loadAndRenderTabPanels();

                } else {
                    $(function () {
                        if (element.children('ul').length === 0) {
                            element.children('li').wrapAll("<ul />");
                            element.children('div').wrapAll("<div />");
                        }

                        supportForCloseableTabs();
                        element.puitabview({
                            orientation: options.orientation || 'top'
                        });

                    });
                }

                if (options.callback) {
                    element.bind('puitabviewchange', function (eventData, index) {
                        options.callback(index);
                    });
                }

                if (options.activeElement !== undefined && attrs.puiTabview.trim().charAt(0) !== '{' ) {
                    scope.$watch(attrs.puiTabview+'.activeElement', function (value) {
                        $(function () {
                            if (angular.isNumber(value)) {
                                element.puitabview('select', value);
                            }
                        });
                    });
                }

            };
        }
    };
}]);

}());
