/**
 * Angular module with services
 */
var directives = angular.module('usecase.directives', []);

directives.directive('prettyPrint', function () {
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