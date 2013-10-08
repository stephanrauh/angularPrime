/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiProgressbar', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(function () {

                var options = scope.$eval(attrs.puiProgressbar);
                var onlyValueSpecified = false;

                if (angular.isNumber(options)) {
                    onlyValueSpecified = true;
                    element.puiprogressbar({
                    });

                } else {
                    element.puiprogressbar({
                        value: options.value,
                        labelTemplate: options.labelTemplate,
                        showLabel: options.showLabel,
                        easing: options.easing,
                        effectSpeed: options.effectSpeed
                    });

                }

                function setNewValue(value) {
                    if (value !== null) {
                        element.puiprogressbar('setValue', value);
                    }
                }

                if (onlyValueSpecified) {
                    scope.$watch(attrs.puiProgressbar, function(value) {
                        setNewValue(value);
                    });
                } else {
                    scope.$watch(attrs.puiProgressbar+'.value', function(value) {
                        setNewValue(value);
                    });

                }


            });
        }
    };

});

}());
