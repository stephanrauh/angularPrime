/**
 * Angular module with controller
 */
var controllers = angular.module('input.controllers', []);

controllers.controller('input.controller', ['$scope', function ($scope) {
    $scope.value1 = null;
    $scope.value2 = null;
    $scope.value3 = null;
    $scope.value4 = null;
    $scope.value5 = null;
    $scope.value6 = null;

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
            value: "2", description: "with min/max for number"
        },
        {
            value: "3", description: "type color"
        },
        {
            value: "4", description: "type range"
        },
        {
            value: "5", description: "with ng-show"
        },
        {
            value: "6", description: "without ng-model"
        },
        {
            value: "7", description: "default type when element"
        }
    ];

}]);