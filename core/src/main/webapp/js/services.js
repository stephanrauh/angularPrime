angular.module('demo.services', [])
    .factory('Widgets', [ '$location', 'Configuration', function ($location, Configuration) {
        var widgets = {
            allWidgets: []
            , widgetSubPages : []
            , selectWidget : function(widgetName) {
                    this.widgetSubPages = this.subPages[widgetName];
                    $location.path(this.defaultPage[widgetName]);
                }
            , selectSubPage : function (path) {
                $location.path(path);
            }
            , subPages : {}
            , defaultPage : {}
        };

        angular.forEach(Configuration, function (info, key) {
            widgets.allWidgets.push({label: info.widget});
            widgets.defaultPage[info.widget] = info.defaultPath;

            var widgetSubPages = [];
            angular.forEach(info.subPages, function (subpage, key) {
                this.push(subpage);
            }, widgetSubPages);

            widgets.subPages[info.widget] = widgetSubPages;
        });


        return widgets;
    } ])
    .provider("Configuration", function ConfigurationProvider () {
        var data = [];
        return {

            loadData: function () {
                $.ajax({
                    type: "GET",
                    url: "json/widgets.json",
                    async: false,
                    dataType: "json"
                }).success(function (d) {
                        data = d;
                    });
            },

            getRouteProviderData : function () {
                var result = [];
                angular.forEach(data, function(info) {
                    angular.forEach(info.subPages, function (subpage) {
                        this.push({label : subpage.label, path : subpage.path, controller : info.controller} );
                    }, this);
                }, result);
                return result;
            },
            $get: function () {
                return data;
            }
        }
    });