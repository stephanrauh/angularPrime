/**
 * Angular module with controller
 */
var controllers = angular.module('password.controllers', []);

controllers.controller('password.controller', ['$scope', function ($scope) {
    $scope.value1 = null;
    $scope.value2 = null;
    $scope.value3 = null;
    $scope.value4 = null;
    $scope.value5 = null;

    $scope.inlineOptions = {
        inline: true
    };

    $scope.customMessages = {
        promptLabel: 'label',
        weakLabel: 'Level 1',
        goodLabel: 'Level 2',
        strongLabel: 'Level 3'
    };

    $scope.fieldDisabled = false;

    $scope.enableField = function() {
        $scope.fieldDisabled = false;
    };

    $scope.disableField = function() {
        $scope.fieldDisabled = true;
    };

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
            value: "1", description: "Inline feedback panel"
        },
        {
            value: "2", description: "Custom Messages"
        },
        {
            value: "3", description: "with ng-required"
        },
        {
            value: "4", description: "with ng-disabled"
        },
        {
            value: "5", description: "with ng-show/ng-hide"
        }


    ];

}]);