/**
 */
'use strict';

/**
 * The main angularPrime demo app module.
 *
 * @type {angular.Module}
 */

var demo = angular.module('demo', ['angular.prime', 'demo.services']);

demo.config(['$routeProvider', 'ConfigurationProvider', function($routeProvider, ConfigurationProvider) {
    ConfigurationProvider.loadData();

    angular.forEach(ConfigurationProvider.getRouteProviderData(), function(routeData){

        $routeProvider.when('/' + routeData.path, {
            templateUrl: 'partials/' + routeData.path + '.html',
            controller: routeData.controller
        });

    });

    $routeProvider.when('/main', {
        templateUrl: 'partials/main.html',
        controller: Ctrl
    });
    $routeProvider.when('/license', {
        templateUrl: 'partials/license.html',
        controller: Ctrl
    });

    $routeProvider.when('/planned', {
        templateUrl: 'partials/planned.html',
        controller: Ctrl
    });

    $routeProvider.when('/history', {
        templateUrl: 'partials/history.html',
        controller: Ctrl
    });

    $routeProvider.otherwise({ redirectTo: '/main' });

}]);

/*
demo.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);
    */


demo.directive('prettyPrint', function () {
    return {
        restrict: 'A',
        priority: 900,
        terminal: true,
        compile: function (element, attrs) {
            var content = element.html();
            var encoded = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            element.html(prettyPrintOne(encoded, attrs.prettyPrint));
        }
    }
});

demo.directive('version', function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            element.html('<img src="demo/'+attrs.version+'.png" style="margin-left:10px"/>');
        }
    }
});