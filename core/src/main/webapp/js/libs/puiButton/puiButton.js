/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiButton', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    var titleWatches = [],
                        parsedExpression = $interpolate(element.text()),
                        withinSplitButton,
                        options = scope.$eval(attrs.puiButton) || {};

                    withinSplitButton = element.parent().attr('pui-splitbutton') !== undefined;

                    element.text(scope.$eval(parsedExpression));
                    angular.forEach(parsedExpression.parts, function (part) {
                        if (angular.isFunction(part)) {
                            titleWatches.push(part.exp);
                        }
                    }, titleWatches);

                    if (withinSplitButton) {
                        var buttons = element.parent().data('puiButtons'),
                            buttonInfo;

                        if (buttons === undefined) {
                            buttons = [];
                        }

                        buttonInfo = {
                            text : titleWatches.length === 0 ? scope.$eval(parsedExpression) : titleWatches,
                            click: function () {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ngClick);
                                });
                            },
                            icon: options.icon,
                            iconPos: options.iconPosition || 'left'
                        };

                        buttons.push(buttonInfo);
                        element.parent().data('puiButtons', buttons);

                        element.html(''); // remove element

                    } else {

                        $(function () {

                            element.puibutton({
                                icon: options.icon,
                                iconPos: options.iconPosition || 'left'
                            });
                        });

                        if (attrs.ngDisabled) {
                            scope.$watch(attrs.ngDisabled, function (value) {
                                if (value === false) {
                                    $(function () {
                                        element.puibutton('enable');
                                    });
                                } else {
                                    $(function () {
                                        element.puibutton('disable');
                                    });

                                }
                            });
                        }
                        angular.forEach(titleWatches, function (watchValue) {
                            scope.$watch(watchValue, function (value) {
                                $(function () {
                                    element.puibutton('setTitle', scope.$eval(parsedExpression));
                                });
                            });
                        });
                    }
                };
            }

        };
    }]

);

}());
;/*jshint laxcomma:true*/
/*globals $ */

/**
 * PrimeFaces Button Widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puibutton", {

        options: {
            icon: null
            ,iconPos : 'left'
        },

        _create: function() {
            var element = this.element,
                text = element.text()||'pui-button',
                disabled = element.prop('disabled'),
                styleClass = null;

            if(this.options.icon) {
                styleClass = (text === 'pui-button') ? 'pui-button-icon-only' : 'pui-button-text-icon-' + this.options.iconPos;
            }
            else {
                styleClass = 'pui-button-text-only';
            }

            if(disabled) {
                styleClass += ' ui-state-disabled';
            }

            this.element.addClass('pui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');

            if(this.options.icon) {
                this.element.append('<span class="pui-button-icon-' + this.options.iconPos + ' ui-icon ' + this.options.icon + '" />');
            }

            this.element.append('<span class="pui-button-text">' + text + '</span>');

            //aria
            element.attr('role', 'button').attr('aria-disabled', disabled);

            if(!disabled) {
                this._bindEvents();
            }
        },

        _bindEvents: function() {
            var element = this.element,
                $this = this;

            element.on('mouseover.puibutton', function(){
                if(!element.prop('disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.puibutton', function() {
                    $(this).removeClass('ui-state-active ui-state-hover');
                }).on('mousedown.puibutton', function() {
                    if(!element.hasClass('ui-state-disabled')) {
                        element.addClass('ui-state-active').removeClass('ui-state-hover');
                    }
                }).on('mouseup.puibutton', function(e) {
                    element.removeClass('ui-state-active').addClass('ui-state-hover');

                    $this._trigger('click', e);
                }).on('focus.puibutton', function() {
                    element.addClass('ui-state-focus');
                }).on('blur.puibutton', function() {
                    element.removeClass('ui-state-focus');
                }).on('keydown.puibutton',function(e) {
                    if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                        element.addClass('ui-state-active');
                    }
                }).on('keyup.puibutton', function() {
                    element.removeClass('ui-state-active');
                });

            return this;
        },

        _unbindEvents: function() {
            this.element.off('mouseover.puibutton mouseout.puibutton mousedown.puibutton mouseup.puibutton focus.puibutton blur.puibutton keydown.puibutton keyup.puibutton');
        },

        disable: function() {
            this._unbindEvents();

            this.element.attr({
                'disabled':'disabled',
                'aria-disabled': true
            }).addClass('ui-state-disabled');
        },

        enable: function() {
            this._bindEvents();

            this.element.removeAttr('disabled').attr('aria-disabled', false).removeClass('ui-state-disabled');
        },

        // Added for AngularPrime
        setTitle: function(title) {
            this.element.find('.pui-button-text').html(title);
        }
    });
});