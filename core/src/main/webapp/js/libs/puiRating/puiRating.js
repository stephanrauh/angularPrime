/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiRating', function () {
    return {
        restrict: 'A',
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model
            $(function () {

                var options = scope.$eval(attrs.puiRating) || {};

                options.cancel = (options.cancel !== undefined) ? options.cancel : true;
                options.stars = options.stars || 5;

                element.puirating({
                    cancel: options.cancel,
                    stars: options.stars
                });

                element.hide();


                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.puirating('setValue', ngModel.$viewValue);
                };


                // Listen for change events to enable binding
                element.bind('puiratingrate puiratingcancel', function () {
                    scope.safeApply(read());
                    if (options.callback) {
                        options.callback(ngModel.$viewValue);
                    }

                });

                // Write data to the model
                function read() {
                    if (ngModel.$viewValue !== parseInt(element.val(), 10))   {
                        // Only set Angular model value when effective changed. Otherwise ng-change can be triggered to many times.
                        ngModel.$setViewValue(element.val());
                    }
                }


                if (attrs.ngDisabled) {
                    scope.$watch(attrs.ngDisabled, function (value) {

                        if (value === false) {
                            $(function () {
                                element.puirating('enable');
                            });
                        } else {
                            $(function () {
                                element.puirating('disable');

                            });

                        }
                    });
                }

            });
        }
    };

});

}());
;/*globals $ */

/**
 * PrimeUI rating widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puirating", {

        options: {
            stars: 5,
            cancel: true
        },

        _create: function() {
            var input = this.element;

            input.wrap('<div />');
            this.container = input.parent();
            this.container.addClass('pui-rating');

            var inputVal = input.val(),
                value = inputVal === '' ? null : parseInt(inputVal, 10);

            if(this.options.cancel) {
                this.container.append('<div class="pui-rating-cancel"><a></a></div>');
            }

            for(var i = 0; i < this.options.stars; i++) {
                var styleClass = (value > i) ? "pui-rating-star pui-rating-star-on" : "pui-rating-star";

                this.container.append('<div class="' + styleClass + '"><a></a></div>');
            }

            this.stars = this.container.children('.pui-rating-star');

            if(input.prop('disabled')) {
                this.container.addClass('ui-state-disabled');
            }
            else if(!input.prop('readonly')){
                this._bindEvents();
            }
        },

        _bindEvents: function() {
            var $this = this;

            this.stars.on('click',function() {  // Changed for AngularPrime (from .click to .on('click',
                var value = $this.stars.index(this) + 1;   //index starts from zero

                $this.setValue(value);
            });

            this.container.children('.pui-rating-cancel').hover(function() {
                $(this).toggleClass('pui-rating-cancel-hover');
            })
                .click(function() {
                    $this.cancel();
                });
        },

        cancel: function() {
            this.element.val('');

            this.stars.filter('.pui-rating-star-on').removeClass('pui-rating-star-on');

            this._trigger('cancel', null);
        },

        getValue: function() {
            var inputVal = this.element.val();

            return inputVal === '' ? null : parseInt(inputVal, 10);
        },

        setValue: function(value) {
            this.element.val(value);

            //update visuals
            this.stars.removeClass('pui-rating-star-on');
            for(var i = 0; i < value; i++) {
                this.stars.eq(i).addClass('pui-rating-star-on');
            }

            this._trigger('rate', null, value);
        },

        // Added for AngularPrime
        enable: function() {
            this.container.removeClass('ui-state-disabled');
            this._bindEvents();
        },

        disable: function() {
            this.container.addClass('ui-state-disabled');
            this._unbindEvents();
        },

        _unbindEvents: function() {
            this.stars.off('click');

            this.container.children('.pui-rating-cancel').hover(function() {
            })
            .click(function() {
            });
        }
    });

});