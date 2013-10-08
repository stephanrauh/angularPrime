/*globals $ */

/**
 * PrimeUI inputtext widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puiinputtext", {

        _create: function() {
            var input = this.element,
                disabled = input.prop('disabled');

            //visuals
            input.addClass('pui-inputtext ui-widget ui-state-default ui-corner-all');

            if(disabled) {
                input.addClass('ui-state-disabled');
            }
            else {
                this._enableMouseEffects(input); // Added For AngularPrime
                /*
                 wrapped in method For AngularPrime
                input.hover(function() {
                    input.toggleClass('ui-state-hover');
                }).focus(function() {
                        input.addClass('ui-state-focus');
                    }).blur(function() {
                        input.removeClass('ui-state-focus');
                    });
                */
            }

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', disabled)
                .attr('aria-readonly', input.prop('readonly'))
                .attr('aria-multiline', input.is('textarea'));
        },

        _destroy: function() {

        },

        // Added for AngularPrime
        _enableMouseEffects: function () {
            var input = this.element;
            input.hover(function () {
                input.toggleClass('ui-state-hover');
            }).focus(function () {
                    input.addClass('ui-state-focus');
                }).blur(function () {
                    input.removeClass('ui-state-focus');
                });
        },

        _disableMouseEffects: function () {
            var input = this.element;
            input.hover(function () {

            }).focus(function () {

                }).blur(function () {

                });
        },

        disable: function() {
            var input = this.element;

            input.attr('aria-disabled', input.prop('disabled'));
            input.addClass('ui-state-disabled');
            input.removeClass('ui-state-focus');
            input.removeClass('ui-state-hover');
            this._disableMouseEffects();
        },

        enable: function() {
            this.element.attr('aria-disabled', this.element.prop('disabled'));
            this.element.removeClass('ui-state-disabled');
            this._enableMouseEffects();
        }

    });

});