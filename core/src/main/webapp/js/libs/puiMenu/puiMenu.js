/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiMenu', ['$log', function ($log) {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            return function postLink (scope, element, attrs) {

                var options = scope.$eval(attrs.puiMenu) || {};
                options.popup = false;
                if (options.trigger) {
                    var triggerElement = $(options.trigger);
                    if (triggerElement !== undefined) {
                        options.popup = true;
                        options.trigger = triggerElement;
                    } else {
                        options.trigger = null;
                    }

                }
                if ( options.isContextMenu && options.isSlideMenu) {
                    throw new Error("ContextMenu can't be combined with the SlideMenu");
                }
                $(function() {
                    var hasSubMenu = element.find("ul").length > 0,
                        hasH3Element = element.find("h3").length > 0;

                    if (hasSubMenu || ! hasH3Element) {
                        if (hasH3Element) {
                            $log.warn("Menu with submenu and h3 elements found");
                        }
                        if (options.isContextMenu) {
                            element.puicontextmenu({
                                popup: options.popup,
                                trigger: options.trigger
                            });

                        } else {
                            if (options.isSlideMenu) {
                                element.puislidemenu({
                                    popup: options.popup,
                                    trigger: options.trigger
                                });

                            } else {
                                element.puitieredmenu({
                                    popup: options.popup,
                                    trigger: options.trigger,
                                    autoDisplay: options.autoDisplay
                                });

                            }
                        }
                    } else {
                        element.puimenu({
                            popup: options.popup,
                            trigger: options.trigger
                        });

                    }
                });
            };
        }
    };
}]);

}());
;/*jshint laxcomma:true*/
/*globals $ PUI */
/**
 * PrimeUI Menu widget
 */
$(function() {
    "use strict"; // Added for AngularPrime
    $.widget("primeui.puimenu", $.primeui.puibasemenu, {

        options: {

        },

        _create: function() {
            this.element.addClass('pui-menu-list ui-helper-reset').
                wrap('<div class="pui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');

            this.element.children('li').each(function() {
                var listItem = $(this);

                if(listItem.children('h3').length > 0) {
                    listItem.addClass('ui-widget-header ui-corner-all');
                }
                else {
                    listItem.addClass('pui-menuitem ui-widget ui-corner-all');
                    var menuitemLink = listItem.children('a'),
                        icon = menuitemLink.data('icon');

                    menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');

                    if(icon) {
                        menuitemLink.prepend('<span class="pui-menuitem-icon ui-icon ' + icon + '"></span>');
                    }
                }
            });

            this.menuitemLinks = this.element.find('.pui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();

            this._super();
        },

        _bindEvents: function() {
            var $this = this;

            this.menuitemLinks.on('mouseenter.pui-menu', function(e) {
                $(this).addClass('ui-state-hover');
            })
                .on('mouseleave.pui-menu', function(e) {
                    $(this).removeClass('ui-state-hover');
                });

            if(this.options.popup) {
                this.menuitemLinks.on('click.pui-menu', function() {
                    $this.hide();
                });
            }
        }
    });
});

/*
 * PrimeUI TieredMenu Widget
 */
$(function() {

    $.widget("primeui.puitieredmenu", $.primeui.puibasemenu, {

        options: {
            autoDisplay: true
        },

        _create: function() {
            this._render();

            this.links = this.element.find('.pui-menuitem-link:not(.ui-state-disabled)');

            this._bindEvents();

            this._super();
        },

        _render: function() {
            this.element.addClass('pui-menu-list ui-helper-reset').
                wrap('<div class="pui-tieredmenu pui-menu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix" />');

            this.element.parent().uniqueId();
            this.options.id = this.element.parent().attr('id');

            this.element.find('li').each(function() {
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');

                if(icon) {
                    menuitemLink.prepend('<span class="pui-menuitem-icon ui-icon ' + icon + '"></span>');
                }

                listItem.addClass('pui-menuitem ui-widget ui-corner-all');
                if(listItem.children('ul').length > 0) {
                    listItem.addClass('pui-menu-parent');
                    listItem.children('ul').addClass('ui-widget-content pui-menu-list ui-corner-all ui-helper-clearfix pui-menu-child pui-shadow');
                    menuitemLink.prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>');
                }


            });
        },

        _bindEvents: function() {
            this._bindItemEvents();

            this._bindDocumentHandler();
        },

        _bindItemEvents: function() {
            var $this = this;

            this.links.on('mouseenter.pui-menu',function() {
                var link = $(this),
                    menuitem = link.parent(),
                    autoDisplay = $this.options.autoDisplay;

                var activeSibling = menuitem.siblings('.pui-menuitem-active');
                if(activeSibling.length === 1) {
                    $this._deactivate(activeSibling);
                }

                if(autoDisplay||$this.active) {
                    if(menuitem.hasClass('pui-menuitem-active')) {
                        $this._reactivate(menuitem);
                    }
                    else {
                        $this._activate(menuitem);
                    }
                }
                else {
                    $this._highlight(menuitem);
                }
            });

            if(this.options.autoDisplay === false) {
                this.rootLinks = this.element.find('> .pui-menuitem > .pui-menuitem-link');
                this.rootLinks.data('primeui-tieredmenu-rootlink', this.options.id).find('*').data('primeui-tieredmenu-rootlink', this.options.id);

                this.rootLinks.on('click.pui-menu', function(e) {
                    var link = $(this),
                        menuitem = link.parent(),
                        submenu = menuitem.children('ul.pui-menu-child');

                    if(submenu.length === 1) {
                        if(submenu.is(':visible')) {
                            $this.active = false;
                            $this._deactivate(menuitem);
                        }
                        else {
                            $this.active = true;
                            $this._highlight(menuitem);
                            $this._showSubmenu(menuitem, submenu);
                        }
                    }
                });
            }

            this.element.parent().find('ul.pui-menu-list').on('mouseleave.pui-menu', function(e) {
                if($this.activeitem) {
                    $this._deactivate($this.activeitem);
                }

                e.stopPropagation();
            });
        },

        _bindDocumentHandler: function() {
            var $this = this;

            $(document.body).on('click.pui-menu', function(e) {
                var target = $(e.target);
                if(target.data('primeui-tieredmenu-rootlink') === $this.options.id) {
                    return;
                }

                $this.active = false;

                $this.element.find('li.pui-menuitem-active').each(function() {
                    $this._deactivate($(this), true);
                });
            });
        },

        _deactivate: function(menuitem, animate) {
            this.activeitem = null;
            menuitem.children('a.pui-menuitem-link').removeClass('ui-state-hover');
            menuitem.removeClass('pui-menuitem-active');

            if(animate)
                menuitem.children('ul.pui-menu-child:visible').fadeOut('fast');
            else
                menuitem.children('ul.pui-menu-child:visible').hide();
        },

        _activate: function(menuitem) {
            this._highlight(menuitem);

            var submenu = menuitem.children('ul.pui-menu-child');
            if(submenu.length === 1) {
                this._showSubmenu(menuitem, submenu);
            }
        },

        _reactivate: function(menuitem) {
            this.activeitem = menuitem;
            var submenu = menuitem.children('ul.pui-menu-child'),
                activeChilditem = submenu.children('li.pui-menuitem-active:first'),
                _self = this;

            if(activeChilditem.length === 1) {
                _self._deactivate(activeChilditem);
            }
        },

        _highlight: function(menuitem) {
            this.activeitem = menuitem;
            menuitem.children('a.pui-menuitem-link').addClass('ui-state-hover');
            menuitem.addClass('pui-menuitem-active');
        },

        _showSubmenu: function(menuitem, submenu) {
            submenu.css({
                'left': menuitem.outerWidth()
                ,'top': 0
                ,'z-index': ++PUI.zindex
            });

            submenu.show();
        }

    });

});

/**
 * PrimeUI Context Menu Widget
 */

$(function() {

    $.widget("primeui.puicontextmenu", $.primeui.puitieredmenu, {

        options: {
            autoDisplay: true,
            target: null,
            event: 'contextmenu'
        },

        _create: function() {
            this._super();
            this.element.parent().removeClass('pui-tieredmenu').
                addClass('pui-contextmenu pui-menu-dynamic pui-shadow');

            var $this = this;

            this.options.target = this.options.target||$(document);

            if(!this.element.parent().parent().is(document.body)) {
                this.element.parent().appendTo('body');
            }

            this.options.target.on(this.options.event + '.pui-contextmenu' , function(e){
                $this.show(e);
            });
        },

        _bindItemEvents: function() {
            this._super();

            var $this = this;

            //hide menu on item click
            this.links.bind('click', function() {
                $this.hide(); // Changed for AngularPrime
            });
        },

        _bindDocumentHandler: function() {
            var $this = this;

            //hide overlay when document is clicked
            $(document.body).bind('click.pui-contextmenu', function (e) {
                if($this.element.parent().is(":hidden")) {
                    return;
                }

                $this.hide(); // Changed for AngularPrime
            });
        },

        show: function(e) {
            //hide other contextmenus if any
            $(document.body).children('.pui-contextmenu:visible').hide();

            var win = $(window),
                left = e.pageX,
                top = e.pageY,
                width = this.element.parent().outerWidth(),
                height = this.element.parent().outerHeight();

            //collision detection for window boundaries
            if((left + width) > (win.width())+ win.scrollLeft()) {
                left = left - width;
            }
            if((top + height ) > (win.height() + win.scrollTop())) {
                top = top - height;
            }

            if(this.options.beforeShow) {
                this.options.beforeShow.call(this);
            }

            this.element.parent().css({
                'left': left,
                'top': top,
                'z-index': ++PUI.zindex
            }).show();

            e.preventDefault();
            e.stopPropagation();
        },

        hide: function() { // Changed for AngularPrime
            var $this = this;

            //hide submenus
            this.element.parent().find('li.pui-menuitem-active').each(function() {
                $this._deactivate($(this), true);
            });

            this.element.parent().fadeOut('fast');
        },

        isVisible: function() {
            return this.element.parent().is(':visible');
        },

        getTarget: function() {
            return this.jqTarget;
        }

    });

});

/*
 * PrimeUI SlideMenu Widget
 */

$(function() {

    $.widget("primeui.puislidemenu", $.primeui.puibasemenu, {

        _create: function() {

            this._render();

            //elements
            this.rootList = this.element;
            this.content = this.element.parent();
            this.wrapper = this.content.parent();
            this.container = this.wrapper.parent();
            this.submenus = this.container.find('ul.pui-menu-list');

            this.links = this.element.find('a.pui-menuitem-link:not(.ui-state-disabled)');
            this.backward = this.wrapper.children('div.pui-slidemenu-backward');

            //config
            this.stack = [];
            this.jqWidth = this.container.width();

            var $this = this;

            if(!this.element.hasClass('pui-menu-dynamic')) {
                this._applyDimensions();
            }
            this._super();

            this._bindEvents();
        },

        _render: function() {
            this.element.addClass('pui-menu-list ui-helper-reset').
                wrap('<div class="pui-menu pui-slidemenu ui-widget ui-widget-content ui-corner-all ui-helper-clearfix"/>').
                wrap('<div class="pui-slidemenu-wrapper" />').
                after('<div class="pui-slidemenu-backward ui-widget-header ui-corner-all ui-helper-clearfix">' + // Changed for AngularPrime
                    '<span class="ui-icon ui-icon-triangle-1-w"></span>Back</div>').
                wrap('<div class="pui-slidemenu-content" />');

            this.element.parent().uniqueId();
            this.options.id = this.element.parent().attr('id');

            this.element.find('li').each(function() {
                var listItem = $(this),
                    menuitemLink = listItem.children('a'),
                    icon = menuitemLink.data('icon');

                menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');

                if(icon) {
                    menuitemLink.prepend('<span class="pui-menuitem-icon ui-icon ' + icon + '"></span>');
                }

                listItem.addClass('pui-menuitem ui-widget ui-corner-all');
                if(listItem.children('ul').length > 0) {
                    listItem.addClass('pui-menu-parent');
                    listItem.children('ul').addClass('ui-widget-content pui-menu-list ui-corner-all ui-helper-clearfix pui-menu-child ui-shadow');
                    menuitemLink.prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>');
                }


            });
        },

        _bindEvents: function() {
            var $this = this;

            this.links.on('mouseenter.pui-menu',function() {
                $(this).addClass('ui-state-hover');
            })
                .on('mouseleave.pui-menu',function() {
                    $(this).removeClass('ui-state-hover');
                })
                .on('click.pui-menu',function() {
                    var link = $(this),
                        submenu = link.next();

                    if(submenu.length == 1) {
                        $this._forward(submenu);
                    }
                });

            this.backward.on('click.pui-menu',function() {
                $this._back();
            });
        },

        _forward: function(submenu) {
            var $this = this;

            this._push(submenu);

            var rootLeft = -1 * (this._depth() * this.jqWidth);

            submenu.show().css({
                left: this.jqWidth
            });

            this.rootList.animate({
                left: rootLeft
            }, 500, 'easeInOutCirc', function() {
                if($this.backward.is(':hidden')) {
                    $this.backward.fadeIn('fast');
                }
            });
        },

        _back: function() {
            var $this = this,
                last = this._pop(),
                depth = this._depth();

            var rootLeft = -1 * (depth * this.jqWidth);

            this.rootList.animate({
                left: rootLeft
            }, 500, 'easeInOutCirc', function() {
                last.hide();

                if(depth === 0) {
                    $this.backward.fadeOut('fast');
                }
            });
        },

        _push: function(submenu) {
            this.stack.push(submenu);
        },

        _pop: function() {
            return this.stack.pop();
        },

        _last: function() {
            return this.stack[this.stack.length - 1];
        },

        _depth: function() {
            return this.stack.length;
        },

        _applyDimensions: function() {
            this.submenus.width(this.container.width());
            this.wrapper.height(this.rootList.outerHeight(true) + this.backward.outerHeight(true));
            this.content.height(this.rootList.outerHeight(true));
            this.rendered = true;
        },

        show: function() {
            this.align();
            this.container.css('z-index', ++PUI.zindex).show();

            if(!this.rendered) {
                this._applyDimensions();
            }
        }
    });

});
