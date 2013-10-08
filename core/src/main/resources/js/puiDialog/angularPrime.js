/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiDialog', function () {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                return function postLink (scope, element, attrs) {
                    // TODO check if no inline object created.
                    var options = scope.$eval(attrs.puiDialog) || {};
                    if (!(typeof options.dlgVisible == 'boolean')) {
                        throw new Error('The options object ' + attrs.puiDialog + ' needs a boolean property dlgVisible');
                    }
                    options.draggable = (options.draggable !== undefined) ? options.draggable : true;
                    options.modal = (options.modal !== undefined) ? options.modal : true;
                    options.closable = (options.closable !== undefined) ? options.closable : true;
                    options.location = options.location || 'center';
                    options.height = options.height || 'auto';
                    options.width = options.width || '300px';
                    options.minWidth = options.minWidth || 150;
                    options.minHeight = options.minHeight || 25;
                    options.resizable = (options.resizable !== undefined) ? options.resizable : false;
                    options.showEffect = options.showEffect || 'fade';
                    options.hideEffect = options.hideEffect || 'fade';
                    options.effectSpeed = options.effectSpeed || 'normal';
                    options.closeOnEscape = (options.closeOnEscape !== undefined) ? options.closeOnEscape : true;
                    options.minimizable = (options.minimizable !== undefined) ? options.minimizable : false;
                    options.maximizable = (options.maximizable !== undefined) ? options.maximizable : false;

                    $(function () {
                        element.puidialog({
                            draggable: options.draggable,
                            resizable: options.resizable,
                            location: options.location,
                            minWidth: options.minWidth,
                            minHeight: options.minHeight,
                            height: options.height,
                            width: options.width,
                            modal: options.modal,
                            showEffect: options.showEffect,
                            hideEffect: options.hideEffect,
                            effectSpeed: options.effectSpeed,
                            closeOnEscape: options.closeOnEscape,
                            closable: options.closable,
                            minimizable: options.minimizable,
                            maximizable: options.maximizable
                        });
                    });
                    scope.$watch(attrs.puiDialog + '.dlgVisible', function (value) {
                        if (value === false) {
                            $(function () {
                                element.puidialog('hide');
                            });
                        } else {
                            $(function () {
                                element.puidialog('show');
                            });

                        }
                    });
                    // required  when you close the dialog with the close icon.
                    element.bind("puidialogafterhide", function () {
                        scope.$apply(function () {
                            scope[attrs.puiDialog].dlgVisible = false;
                        });
                    });
                };
            }
        };

    }

);

}());
