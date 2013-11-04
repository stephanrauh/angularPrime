/*globals angular $ */
(function () {
    "use strict";

    angular.module('angular.prime').provider('themeService', function () {
        var themeService = {},
            themeElement = null,
            themes = new Array('afterdark', 'afternoon', 'afterwork', 'aristo', 'black-tie', 'blitzer', 'bluesky', 'bootstrap', 'casablanca', 'cruze',
            'cupertino', 'dark-hive', 'dot-luv', 'eggplant', 'excite-bike', 'flick', 'glass-x', 'home', 'hot-sneaks', 'humanity', 'le-frog', 'midnight',
            'mint-choc', 'overcast', 'pepper-grinder', 'redmond', 'rocket', 'sam', 'smoothness', 'south-street', 'start', 'sunny', 'swanky-purse', 'trontastic',
            'ui-darkness', 'ui-lightness', 'vader'),
            callback = null;

        themeService.createThemeSwitcher = function(element) {
            themeElement = element;
            $(element).puidropdown({
                data: themes,
                change: function(e) {
                    var themeLink = $('link[href$="theme.css"]'),
                        newThemeURL =  'themes/' + $(this).val() + '/theme.css';

                    themeLink.attr('href', newThemeURL);
                    if (callback) {
                        callback.call(this, $(this).val());
                    }
                }

            });

        };

        themeService.setSelectedTheme = function(selected) {
            $(function () {
                $(themeElement).puidropdown("selectValue", selected);
            });
            if (callback) {
                callback.call(this, selected);
            }
        };

        return {
            setSelectedThemeCallback: function (themeCallback) {
                callback = themeCallback;
            },

            $get: function() {
                return themeService;
            }
        };
    });

    angular.module('angular.prime').directive('puiTheme', ['themeService',
        function (themeService) {
            return {
                restrict: 'E',
                compile: function (element, attrs) {
                    var name = attrs.name || "aristo",
                        dropdown = attrs.dropdown;

                    $(function () {

                        $("head").append("<link rel=\"stylesheet\" href=\"themes/" + name + "/theme.css\">");
                        if (dropdown) {
                            themeService.createThemeSwitcher(element.prepend("<input />").children().first());
                        }
                        themeService.setSelectedTheme(name);
                    });
                }
            };

        }]);
}());


