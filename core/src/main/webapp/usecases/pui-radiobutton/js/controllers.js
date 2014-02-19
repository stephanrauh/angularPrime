/**
 * Angular module with controller
 */
var controllers = angular.module('radiobutton.controllers', []);

controllers.controller('radiobutton.controller', ['$scope', function ($scope) {
    $scope.value1 = null;

    $scope.codeVisibleOf = {
        selectedOptionValue : null
    };

    $scope.usecases = [
        {
            value: "1", description: "checked attribute"
        }

    ];

}]);