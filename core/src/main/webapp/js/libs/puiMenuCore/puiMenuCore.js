"use strict";

/*globals $ */

/**
 * PrimeUI BaseMenu widget
 */
$(function() {

    $.widget("primeui.puibasemenu", {

        options: {
            popup: false,
            trigger: null,
            my: 'left top',
            at: 'left bottom',
            triggerEvent: 'click'
        },

        _create: function() {
            if(this.options.popup) {
                this._initPopup();
            }
        },

        _initPopup: function() {
            var $this = this;

            this.element.closest('.pui-menu').addClass('pui-menu-dynamic pui-shadow').appendTo(document.body);

            this.positionConfig = {
                my: this.options.my
                ,at: this.options.at
                ,of: this.options.trigger
            }

            this.options.trigger.on(this.options.triggerEvent + '.pui-menu', function(e) {
                var trigger = $(this);

                if($this.element.is(':visible')) {
                    $this.hide();
                }
                else {
                    $this.show();
                }

                e.preventDefault();
            });

            //hide overlay on document click
            $(document.body).on('click.pui-menu', function (e) {
                var popup = $this.element.closest('.pui-menu');
                if(popup.is(":hidden")) {
                    return;
                }

                //do nothing if mousedown is on trigger
                var target = $(e.target);
                if(target.is($this.options.trigger.get(0))||$this.options.trigger.has(target).length > 0) {
                    return;
                }

                //hide if mouse is outside of overlay except trigger
                var offset = popup.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + popup.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + popup.height()) {

                    $this.hide(e);
                }
            });

            //Hide overlay on resize
            $(window).on('resize.pui-menu', function() {
                if($this.element.closest('.pui-menu').is(':visible')) {
                    $this.align();
                }
            });
        },

        show: function() {
            this.align();
            this.element.closest('.pui-menu').css('z-index', ++PUI.zindex).show();
        },

        hide: function() {
            this.element.closest('.pui-menu').fadeOut('fast');
        },

        align: function() {
            this.element.closest('.pui-menu').css({left:'', top:''}).position(this.positionConfig);
        }
    });
});
