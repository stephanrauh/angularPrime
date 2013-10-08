/*globals $ */

/**
 * PrimeUI BreadCrumb Widget
 */
$(function() {
    "use strict"; // Added for AngularPrime

    $.widget("primeui.puibreadcrumb", {

        // Added for AngularPrime
        options: {
            homeIcon: 'ui-icon-home'
        },

        _create: function() {
            this.element.wrap('<div class="pui-breadcrumb ui-module ui-widget ui-widget-header ui-helper-clearfix ui-corner-all" role="menu">');

            var customIcon = this.options.homeIcon;  // Added for AngularPrime
            this.element.children('li').each(function(index) {
                var listItem = $(this);

                listItem.attr('role', 'menuitem');
                var menuitemLink = listItem.children('a');
                menuitemLink.addClass('pui-menuitem-link ui-corner-all').contents().wrap('<span class="ui-menuitem-text" />');

                if(index > 0 || customIcon === null)  // Changed for AngularPrime
                    listItem.before('<li class="pui-breadcrumb-chevron ui-icon ui-icon-triangle-1-e"></li>');
                else
                    menuitemLink.addClass('ui-icon ' + customIcon); // Changed for AngularPrime
            });
        }
    });
});
