/*globals angular $ */

(function () {
    "use strict";

angular.module('angular.prime').directive('puiDatatable', [ '$log', function ($log) {
    return {
        restrict: 'A',
        priority: 5,
        compile: function (element, attrs) {
            return function postLink(scope, element, attrs) {
                var options = scope.$eval(attrs.puiDatatable) || {},
                    data = [],
                    functionBasedData = false,
                    columns = element.data('puiColumns') || [],
                    selectionMode = null,
                    paginator = null,
                    sortOrder = null;

                if (angular.isArray(options)) {
                    data = options;
                }

                if (angular.isFunction(options)) {
                    data = options;
                    functionBasedData = true;
                }

                if (angular.isArray(data) && data.length === 0) {
                    if (angular.isFunction(options.tableData)) {
                        functionBasedData = true;
                    }
                    data = options.tableData;

                }

                if (columns.length === 0) {
                    if (options.columns) {
                        columns = options.columns;
                    }
                    if (!functionBasedData && columns.length === 0) {
                        for (var property in data[0]) {
                            columns.push({field: property, headerText: property});
                        }
                    }
                }

                if (options.selectionMode) {
                    selectionMode = options.selectionMode;
                }

                if (options.rowSelect && selectionMode === null) {
                    selectionMode = 'single';
                }

                if (options.selectedData) {

                    if (selectionMode === null) {
                        selectionMode = 'multiple';
                    }

                    element.bind('puidatatablerowselect', function (eventData, idx) {
                        $(function () {
                            var data = element.puidatatable('getData');
                            scope.safeApply(function () {
                                var rowIndex = data.indexOf(idx),
                                    index = options.selectedData.indexOf(rowIndex);
                                if (index === -1) {
                                    options.selectedData.push(rowIndex);
                                }


                            });


                        });
                    });

                    element.bind('puidatatablerowunselect', function (eventData, idx) {
                        $(function () {
                            var data = element.puidatatable('getData');
                            scope.safeApply(function () {
                                var rowIndex = data.indexOf(idx),
                                    index = options.selectedData.indexOf(rowIndex);
                                if (index !== -1) {
                                    options.selectedData.splice(index, 1);
                                }

                            });

                        });
                    });

                    element.bind('puidatatableunselectallrows', function (eventData, idx) {
                        $(function () {
                            scope.safeApply(function () {
                                options.selectedData = [];
                            });
                        });
                    });

                }

                if (options.paginatorRows) {
                    paginator = {
                        rows: options.paginatorRows,
                        totalRecords: options.totalRecords
                    };
                }

                if (options.selectedData) {
                    scope.$watch(attrs.puiDatatable + '.selectedData', function (x) {
                        $(function () {
                            element.puidatatable('unselectAllRows', true);
                            if (selectionMode === 'single' && x.length === 2) {
                                x = x.splice(1,1);  // assume the last added one (now 2 elements) is the one we need
                                options.selectedData = x;
                            }
                            angular.forEach(x, function (row) {
                                element.puidatatable('selectRowByIndex', row);
                            });
                        });
                    }, true);
                }

                if (options.sortOrder) {
                    if ('down' === options.sortOrder.toLowerCase()) {
                        sortOrder = -1;
                    } else {
                        sortOrder = 1;
                    }
                }
                $(function () {

                    element.puidatatable({
                        caption: options.caption,
                        lazy: options.lazy || false,
                        datasource : data,
                        columns: columns,
                        selectionMode: selectionMode,
                        rowSelect: options.rowSelect,
                        rowUnselect: options.rowUnselect,
                        paginator: paginator,
                        sortField: options.sortField,
                        sortOrder: sortOrder
                    });

                });

                if (options.selectedPage !== undefined) {
                    if (options.paginatorRows !== undefined) {
                        $(function () {
                            var paginator = element.puidatatable('getPaginator');

                            paginator.bind('puipaginatorpaginate', function (eventData, pageState) {
                                scope.safeApply(function () {
                                    options.selectedPage = pageState.page;
                                });

                            });

                            scope.$watch(attrs.puiDatatable + '.selectedPage', function (selectedPage) {
                                $(function () {
                                    paginator.puipaginator('setPage', parseInt(selectedPage, 10));
                                });
                            });
                        });
                    } else {
                        $log.warn('selectedPage option specified but no value for paginatorRows option defined');
                    }
                }

            };
        }
    };
}]);

angular.module('angular.prime').directive('puiColumn', function () {
    return {
        restrict: 'A',
        priority: 5,
        compile: function (element, attrs) {
            return function postLink(scope, element, attrs) {
                  var columns = element.parent().data('puiColumns') ,
                      options = scope.$eval(attrs.puiColumn) || {} ,
                      columnInfo = {};

                if (columns === undefined) {
                    columns = [];
                }

                if (options.hasOwnProperty('field')) {
                    columnInfo.field = options.field;
                    columnInfo.headerText = options.headerText;
                    if (columnInfo.headerText === undefined) {
                        columnInfo.headerText = columnInfo.field;
                    }
                    columnInfo.sortable = options.sortable;

                } else {
                    columnInfo.field = attrs.puiColumn;
                    columnInfo.headerText = attrs.puiColumn;
                }
                columns.push(columnInfo);
                element.parent().data('puiColumns', columns);
            };
        }
    };
});

}());
