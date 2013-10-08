/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').factory('puiGrowl', function () {

        var growl = {};
        var options = {
            sticky: false,
            life: 3000
        };

        var growlElement;

        var initializeGrowl = function () {
            if (growlElement === undefined) {
                $(function () {
                    growlElement = $('#growl');
                    if (growlElement.length === 1 ) {
                        growlElement.puigrowl();
                    } else {
                        if (growlElement.length === 0) {
                            $('body').append('<div id="growl"></div>');
                            growlElement = $('#growl');
                            growlElement.puigrowl();
                        } else {
                            throw "Growl needs a exactly 1 div with id 'growl'";
                        }
                    }
                });
            }
        };

        growl.showInfoMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'info', summary: title, detail: msg}
            ]);
        };

        growl.showWarnMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'warn', summary: title, detail: msg}
            ]);
        };

        growl.showErrorMessage = function (title, msg) {
            initializeGrowl();
            growlElement.puigrowl('show', [
                {severity: 'error', summary: title, detail: msg}
            ]);
        };

        growl.setSticky = function(sticky) {
            if ( typeof sticky !== 'boolean') {
                throw new Error('Only boolean allowed as parameter of setSticky function');
            }
            options.sticky = sticky;
            initializeGrowl();
            growlElement.puigrowl('setOptions', options);
        };

        growl.setStickyRememberOption = function() {
            options.previousStickyValue = options.sticky;
            this.setSticky(true);
        };

        growl.resetStickyOption = function() {
            this.setSticky(options.previousStickyValue);
        };

        growl.setLife = function(time) {
            if ( typeof time !== 'int') {
                throw new Error('Only int allowed as parameter of setSticky function');
            }
            options.life = time;
            initializeGrowl();
            growlElement.puigrowl('setOptions', options);
        };

        growl.clear = function() {
            initializeGrowl();
            growlElement.puigrowl('clear');

        };

        return growl;

    });

}());

;/*globals $ window document*/

/**
 * PrimeFaces Growl Widget
 */
$(function() {
    "use strict"; // Added for AngularPrime
    $.widget("primeui.puigrowl", {

        options: {
            sticky: false,
            life: 3000
        },

        _create: function() {
            var container = this.element;

            container.addClass("pui-growl ui-widget").appendTo(document.body);
        },

        show: function(msgs) {
            var $this = this;

            //this.jq.css('z-index', ++PrimeFaces.zindex);

            //this.clear();  Changed for AngularPrime

            $.each(msgs, function(i, msg) {
                $this._renderMessage(msg);
            });
        },

        clear: function() {
            this.element.children('div.pui-growl-item-container').remove();
        },

        _renderMessage: function(msg) {
            var markup = '<div class="pui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden" aria-live="polite">';
            markup += '<div class="pui-growl-item pui-shadow">';
            markup += '<div class="pui-growl-icon-close ui-icon ui-icon-closethick" style="display:none"></div>';
            markup += '<span class="pui-growl-image pui-growl-image-' + msg.severity + '" />';
            markup += '<div class="pui-growl-message">';
            markup += '<span class="pui-growl-title">' + msg.summary + '</span>';
            markup += '<p>' + msg.detail + '</p>';
            markup += '</div><div style="clear: both;"></div></div></div>';

            var message = $(markup);

            this._bindMessageEvents(message);
            message.appendTo(this.element).fadeIn();
        },

        _removeMessage: function(message) {
            message.fadeTo('normal', 0, function() {
                message.slideUp('normal', 'easeInOutCirc', function() {
                    message.remove();
                });
            });
        },

        _bindMessageEvents: function(message) {
            var $this = this,
                sticky = this.options.sticky;

            message.on('mouseover.puigrowl', function() {
                var msg = $(this);

                if(!msg.is(':animated')) {
                    msg.find('div.pui-growl-icon-close:first').show();
                }
            })
                .on('mouseout.puigrowl', function() {
                    $(this).find('div.pui-growl-icon-close:first').hide();
                });

            //remove message on click of close icon
            message.find('div.pui-growl-icon-close').on('click.puigrowl',function() {
                $this._removeMessage(message);

                if(!sticky) {
                    window.clearTimeout(message.data('timeout'));
                }
            });

            if(!sticky) {
                this._setRemovalTimeout(message);
            }
        },

        _setRemovalTimeout: function(message) {
            var $this = this;

            var timeout = window.setTimeout(function() {
                $this._removeMessage(message);
            }, this.options.life);

            message.data('timeout', timeout);
        },

        // Added for AngularPrime
        setOptions: function(newOptions) {
          this.options = newOptions;
        }
    });
});