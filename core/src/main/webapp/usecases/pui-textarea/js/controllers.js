/**
 * Angular module with controller
 */
var controllers = angular.module('textarea.controllers', []);

controllers.controller('textarea.controller', ['$scope', function ($scope) {
    $scope.value1 = null;
    $scope.value2 = null;
    $scope.value3 = null;

    $scope.visible = true;

    $scope.showField = function() {
        $scope.visible = true;
    };

    $scope.hideField = function() {
        $scope.visible = false;
    };

    $scope.codeVisibleOf = {
        selectedOptionValue : null
    };

    $scope.usecases = [
        {
            value: "1", description: "with ng-required"
        },
        {
            value: "2", description: "with ng-show"
        },
        {
            value: "3", description: "type color"
        }

    ];

}]);