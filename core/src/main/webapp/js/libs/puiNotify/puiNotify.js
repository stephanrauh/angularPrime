/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiNotify', function () {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    // TODO check if no inline object created.
                    var options = scope.$eval(attrs.puiNotify) || {},
                        userTrigger = true; // because we support user closable and programmatic.

                    if (!(typeof options.visible == 'boolean')) {
                        throw new Error('The options object ' + attrs.puiNotify + ' needs a boolean property visible');
                    }
                    options.position = options.position || 'top';
                    options.animate = (options.animate !== undefined) ? options.animate : true;
                    options.effectSpeed = options.effectSpeed || 'normal';
                    options.easing = options.easing || 'swing';
                    $(function () {
                        element.puinotify({
                            position : options.position,
                            animate: options.animate,
                            effectSpeed: options.effectSpeed,
                            easing: options.easing
                        });
                    });

                    scope.$watch(attrs.puiNotify + '.visible', function (value) {
                        if (value === true) {
                            $(function () {
                                element.puinotify('show');
                            });

                        } else {
                            $(function () {
                                userTrigger = false;
                                element.puinotify('hide');
                            });

                        }
                    });
                    // required  when you close the notify with the close icon.
                    element.bind("puinotifyafterhide", function () {
                        scope.safeApply(function () {
                            scope[attrs.puiNotify].visible = false;
                            if (options.callback && userTrigger) {
                                options.callback();
                            }
                            userTrigger = true;
                        });
                    });
                };
            }
        };

    }

);

}());
;/*globals $ document PUI*/

/**
 * PrimeFaces Notify Widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puinotify", {

        options: {
            position: 'top',
            visible: false,
            animate: true,
            effectSpeed: 'normal',
            easing: 'swing'
        },

        _create: function() {
            this.element.addClass('pui-notify pui-notify-' + this.options.position + ' ui-widget ui-widget-content pui-shadow')
                .wrapInner('<div class="pui-notify-content" />').appendTo(document.body);
            this.content = this.element.children('.pui-notify-content');
            this.closeIcon = $('<span class="ui-icon ui-icon-closethick pui-notify-close"></span>').appendTo(this.element);

            this._bindEvents();

            if(this.options.visible) {
                this.show();
            }
        },

        _bindEvents: function() {
            var $this = this;

            this.closeIcon.on('click.puinotify', function() {
                $this.hide();
            });
        },

        show: function(content) {
            var $this = this;

            if(content) {
                this.update(content);
            }

            this.element.css('z-index',++PUI.zindex);

            this._trigger('beforeShow');

            if(this.options.animate) {
                this.element.slideDown(this.options.effectSpeed, this.options.easing, function() {
                    $this._trigger('afterShow');
                });
            }
            else {
                this.element.show();
                $this._trigger('afterShow');
            }
        },

        hide: function() {
            var $this = this;

            this._trigger('beforeHide');

            if(this.options.animate) {
                this.element.slideUp(this.options.effectSpeed, this.options.easing, function() {
                    $this._trigger('afterHide');
                });
            }
            else {
                this.element.hide();
                $this._trigger('afterHide');
            }
        },

        update: function(content) {
            this.content.html(content);
        }
    });
});