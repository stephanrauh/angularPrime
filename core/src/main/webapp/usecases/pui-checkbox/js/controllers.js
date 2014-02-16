/**
 * Angular module with controller
 */
var controllers = angular.module('checkbox.controllers', []);

controllers.controller('checkbox.controller', ['$scope', function ($scope) {
    $scope.value1 = null;
    $scope.value2 = null;
    $scope.value3 = null;
    $scope.value4 = "Label";
    $scope.value5 = null;

    $scope.visible = true;

    $scope.codeVisibleOf = {
        selectedOptionValue : null
    };

    $scope.usecases = [
        {
            value: "1", description: "ng-true-value / ng-false-value"
        },
        {
            value: "2", description: "Custom attribute"
        },
        {
            value: "3", description: "Dynamic label"
        },
        {
            value: "4", description: "ng-xx-value with pui-checkbox"
        }

    ];

}]);