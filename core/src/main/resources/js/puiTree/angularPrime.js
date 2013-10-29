/*globals angular $ */

(function () {
    "use strict";

    angular.module('angular.prime').directive('puiTree', function () {
        return {
            restrict: 'A',
            priority: 5,
            compile: function (element, attrs) {
                return function postLink(scope, element, attrs) {
                    var options = scope.$eval(attrs.puiTree) || {},
                        nodes = element.data('puiTreeNodes') || [],
                        selectionMode = null;

                    if (angular.isObject(nodes)) {
                        element.html('');  // remove DIV elements with definition of nodes
                    }
                    if (angular.isFunction(options)) {
                        selectionMode = options.selectionMode || 'single';
                        options = {nodeSelect : options };
                    }

                    if (angular.isObject(options)) {
                        selectionMode = options.selectionMode;
                        if (options.nodeSelect) {
                            selectionMode = options.selectionMode || 'single';
                        }
                    }
                    $(function () {

                        element.puitree({
                            nodes: nodes.children || options.nodes,
                            selectionMode: selectionMode,
                            nodeSelect: options.nodeSelect,
                            nodeUnselect: options.nodeUnselect,
                            lazy: options.lazy,
                            icons: options.icons,
                            animate: options.animate
                        });

                    });
                };
            }
        };
    });

    angular.module('angular.prime').directive('puiTreenode', function () {
        return {
            restrict: 'A',
            priority: 5,
            compile: function (element, attrs) {
                return function postLink(scope, element, attrs) {
                    var nodes = element.parent().data('puiTreeNodes'),
                        children = element.data('puiTreeNodes') || [],
                        options = scope.$eval(attrs.puiTreenode) || attrs.puiTreenode,
                        nodeInfo = {};

                    if (children.length === 0) {
                        // Leaf

                        if (nodes === undefined) {
                            // First leaf so create object
                            nodes = {children: []};
                        }

                        if (angular.isObject(options)) {
                            nodeInfo = options;
                        } else {
                            nodeInfo = {label: options};
                        }

                        nodeInfo.data = options.data || attrs.id || nodeInfo.label;
                        // Keep info on parent
                        nodes.children.push(nodeInfo);
                    } else {
                        // Node, leaf already discovered
                        if (nodes === undefined) {
                            // First node so create object representing this node
                            nodes = {children: children.children };

                            if (angular.isObject(options)) {
                                nodes.label = options.label;

                            } else {
                                nodes.label = options;
                            }
                            nodes.data = options.data || attrs.id || nodes.label;
                            // Set this node as the children property of the parent
                            nodes = {children: [nodes]};
                        } else {
                            if (angular.isObject(options)) {
                                nodeInfo = options;
                            } else {
                                nodeInfo = {label: options};
                            }
                            nodeInfo.children = children.children;
                            nodeInfo.data = options.data || attrs.id || nodeInfo.label;

                            nodes.children.push(nodeInfo);
                        }
                    }

                    element.parent().data('puiTreeNodes', nodes);
                };
            }
        };
    });

}());
