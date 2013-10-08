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
;/*globals $ */

/**
 * PrimeUI progressbar widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puiprogressbar", {

        options: {
            value: 0,
            labelTemplate: '{value}%',
            complete: null,
            easing: 'easeInOutCirc',
            effectSpeed: 'normal',
            showLabel: true
        },

        _create: function() {
            this.element.addClass('pui-progressbar ui-widget ui-widget-content ui-corner-all')
                .append('<div class="pui-progressbar-value ui-widget-header ui-corner-all"></div>')
                .append('<div class="pui-progressbar-label"></div>');

            this.jqValue = this.element.children('.pui-progressbar-value');
            this.jqLabel = this.element.children('.pui-progressbar-label');

            if(this.options.value !==0) {
                this._setValue(this.options.value, false);
            }

            this.enableARIA();
        },

        setValue: function(value, animate) { // changed visibility for AngularPrime
            var anim = (animate === undefined || animate) ? true : false;

            if(value >= 0 && value <= 100) {
                if(value === 0) {
                    this.jqValue.hide().css('width', '0%').removeClass('ui-corner-right');

                    this.jqLabel.hide();
                }
                else {
                    if(anim) {
                        this.jqValue.show().animate({
                            'width': value + '%'
                        }, this.options.effectSpeed, this.options.easing);
                    }
                    else {
                        this.jqValue.show().css('width', value + '%');
                    }

                    if(this.options.labelTemplate && this.options.showLabel) {
                        var formattedLabel = this.options.labelTemplate.replace(/{value}/gi, value);

                        this.jqLabel.html(formattedLabel).show();
                    }

                    if(value === 100) {
                        this._trigger('complete');
                    }
                }

                this.options.value = value;
                this.element.attr('aria-valuenow', value);
            }
        },

        _getValue: function() {
            return this.options.value;
        },

        enableARIA: function() {
            this.element.attr('role', 'progressbar')
                .attr('aria-valuemin', 0)
                .attr('aria-valuenow', this.options.value)
                .attr('aria-valuemax', 100);
        },

        _setOption: function(key, value) {
            if(key === 'value') {
                this._setValue(value);
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        _destroy: function() {

        }

    });

});