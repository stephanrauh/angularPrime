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
;/*globals $ PUI document*/

/**
 * PrimeUI Datatable Widget
 */
$(function() {
    "use strict"; // added for AngularPrime

    $.widget("primeui.puidatatable", {
       
        options: {
            columns: null,
            datasource: null,
            paginator: null,
            selectionMode: null,
            rowSelect: null,
            rowUnselect: null,
            caption: null,
            sortField: null,
            sortOrder: null
        },
        
        _create: function() {
            this.id = this.element.attr('id');
            if(!this.id) {
                this.id = this.element.uniqueId().attr('id');
            }
            
            this.element.addClass('pui-datatable ui-widget');
            this.tableWrapper = $('<div class="pui-datatable-tablewrapper" />').appendTo(this.element);
            this.table = $('<table><thead></thead><tbody></tbody></table>').appendTo(this.tableWrapper);
            this.thead = this.table.children('thead');
            this.tbody = this.table.children('tbody').addClass('pui-datatable-data');
            
            if(this.options.datasource) {
                if($.isArray(this.options.datasource)) {
                    this.data = this.options.datasource;
                    this._initialize();
                }
                else if($.type(this.options.datasource) === 'function') {
                    if(this.options.lazy)
                        this.options.datasource.call(this, this._onDataInit, {first:0, sortField:this.options.sortField, sortorder:this.options.sortOrder});
                    else
                        this.options.datasource.call(this, this._onDataInit);
                }
            }
        },
                
        _initialize: function() {
            var $this = this;
            
            if(this.options.columns) {
                $.each(this.options.columns, function(i, col) {
                    var header = $('<th class="ui-state-default"></th>').data('field', col.field).appendTo($this.thead);
                                        
                    if(col.headerText) {
                        header.text(col.headerText);
                    }
                    
                    if(col.sortable) {
                        header.addClass('pui-sortable-column')
                                .data('order', 0)
                                .append('<span class="pui-sortable-column-icon ui-icon ui-icon-carat-2-n-s"></span>');
                    }
                });
            }
            
            if(this.options.caption) {
                this.table.prepend('<caption class="pui-datatable-caption ui-widget-header">' + this.options.caption + '</caption>');
            }

            if(this.options.paginator) {
                this.options.paginator.paginate = function(event, state) {
                    $this.paginate();
                };
                
                this.options.paginator.totalRecords = this.options.paginator.totalRecords||this.data.length;
                this.paginator = $('<div></div>').insertAfter(this.tableWrapper).puipaginator(this.options.paginator);
            }

            if(this._isSortingEnabled()) {
                this._initSorting();
            }
            
            if(this.options.selectionMode) {
                this._initSelection();
            }

            // Changed for AngularPrime (till the end of the method)
            if (this.options.sortField && this.options.sortOrder) {
                this._indicateInitialSortColumn();
                this.sort(this.options.sortField, this.options.sortOrder);
            } else {
                this._renderData();
            }
        },

        // added for AngularPrime
        _indicateInitialSortColumn: function() {
            var sortableColumns = this.thead.children('th.pui-sortable-column'),
                $this = this;
            $.each(sortableColumns, function(i, column) {
                var $column = $(column),
                    data = $column.data();
                if ($this.options.sortField === data.field) {
                    var sortIcon = $column.children('.pui-sortable-column-icon');
                    $column.data('order', $this.options.sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                    if($this.options.sortOrder === -1)
                        sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                    else if($this.options.sortOrder === 1)
                        sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
                }
            });

        },

        _onDataInit: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }

            // Added for AngularPrime
            if (this.options.columns.length === 0) {
                for (var property in data[0]) {
                    this.options.columns.push({field: property, headerText: property});
                }
            }
            // End added section

            this._initialize();
        },
                
        _onDataUpdate: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
                
            this._renderData();
        },
        
        _onLazyLoad: function(data) {
            this.data = data;
            if(!this.data) {
                this.data = [];
            }
            
            this._renderData();
        },
                
        _initSorting: function() {
            var $this = this,
            sortableColumns = this.thead.children('th.pui-sortable-column');
            
            sortableColumns.on('mouseover.puidatatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.addClass('ui-state-hover');
            })
            .on('mouseout.puidatatable', function() {
                var column = $(this);

                if(!column.hasClass('ui-state-active'))
                    column.removeClass('ui-state-hover');
            })
            .on('click.puidatatable', function() {
                var column = $(this),
                sortField = column.data('field'),
                order = column.data('order'),
                sortOrder = (order === 0) ? 1 : (order * -1),
                sortIcon = column.children('.pui-sortable-column-icon');
                
                //clean previous sort state
                column.siblings().filter('.ui-state-active').data('order', 0).removeClass('ui-state-active').children('span.pui-sortable-column-icon')
                                                            .removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
                                                    
                //update state
                $this.options.sortField = sortField;
                $this.options.sortOrder = sortOrder;
    
                $this.sort(sortField, sortOrder);
                                
                column.data('order', sortOrder).removeClass('ui-state-hover').addClass('ui-state-active');
                if(sortOrder === -1)
                    sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                else if(sortOrder === 1)
                    sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
            });
        },
                
        paginate: function() {
            if(this.options.lazy) {
                if(this.options.selectionMode) {
                    this.selection = [];
                }
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
               this._renderData();
            }
        },
                
        sort: function(field, order) {
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            if(this.options.lazy) {
                this.options.datasource.call(this, this._onLazyLoad, this._createStateMeta());
            }
            else {
                this.data.sort(function(data1, data2) {
                    var value1 = data1[field],
                    value2 = data2[field],
                    result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                    return (order * result);
                });

                if(this.options.selectionMode) {
                    this.selection = [];
                }

                if(this.paginator) {
                    this.paginator.puipaginator('option', 'page', 0);
                }

                this._renderData();
            }
        },
                
        sortByField: function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase(); 
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        },
                
        _renderData: function() {
            if(this.data) {
                this.tbody.html('');
                
                var first = this.options.lazy ? 0 : this._getFirst(),
                rows = this._getRows();

                for(var i = first; i < (first + rows); i++) {
                    var rowData = this.data[i];
                    
                    if(rowData) {
                        var row = $('<tr class="ui-widget-content" />').appendTo(this.tbody),
                        zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd';

                        row.addClass(zebraStyle);
                        
                        if(this.options.selectionMode && PUI.inArray(this.selection, i)) {
                            row.addClass("ui-state-highlight");
                        }

                        for(var j = 0; j < this.options.columns.length; j++) {
                            var column = $('<td />').appendTo(row);
                            
                            if(this.options.columns[j].content) {
                                var content = this.options.columns[j].content.call(this, rowData);
                                if($.type(content) === 'string')
                                    column.html(content);
                                else
                                    column.append(content);
                            }
                            else {
                                column.text(rowData[this.options.columns[j].field]);
                            }                            
                        }
                    }
                }
            }
        },
                                
        _getFirst: function() {
            if(this.paginator) {
                var page = this.paginator.puipaginator('option', 'page'),
                rows = this.paginator.puipaginator('option', 'rows');
                
                return (page * rows);
            }
            else {
                return 0;
            }
        },
        
        _getRows: function() {
            return this.paginator ? this.paginator.puipaginator('option', 'rows') : this.data.length;
        },
                
        _isSortingEnabled: function() {
            var cols = this.options.columns;
            if(cols) {
                for(var i = 0; i < cols.length; i++) {
                    if(cols[i].sortable) {
                        return true;
                    }
                }
            }
            
            return false;
        },
                
        _initSelection: function() {
            var $this = this;
            this.selection = [];
            this.rowSelector = '#' + this.id + ' tbody.pui-datatable-data > tr.ui-widget-content:not(.ui-datatable-empty-message)';
            
            //shift key based range selection
            if(this._isMultipleSelection()) {
                this.originRowIndex = 0;
                this.cursorIndex = null;
            }
            
            $(document).off('mouseover.puidatatable mouseout.puidatatable click.puidatatable', this.rowSelector)
                    .on('mouseover.datatable', this.rowSelector, null, function() {
                        var element = $(this);

                        if(!element.hasClass('ui-state-highlight')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.datatable', this.rowSelector, null, function() {
                        var element = $(this);

                        if(!element.hasClass('ui-state-highlight')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.datatable', this.rowSelector, null, function(e) {
                        $this._onRowClick(e, this);
                    });
        },
                
        _onRowClick: function(event, rowElement) {
            if(!$(event.target).is(':input,:button,a')) {
                var row = $(rowElement),
                selected = row.hasClass('ui-state-highlight'),
                metaKey = event.metaKey||event.ctrlKey,
                shiftKey = event.shiftKey;

                //unselect a selected row if metakey is on
                if(selected && metaKey) {
                    this.unselectRow(row);
                }
                else {
                    //unselect previous selection if this is single selection or multiple one with no keys
                    if(this._isSingleSelection() || (this._isMultipleSelection() && !metaKey && !shiftKey)) {
                        this.unselectAllRows();
                    }
                    
                    this.selectRow(row, false);  // Changed for AngularPrime
                } 

                PUI.clearSelection();
            }
        },
                
        _isSingleSelection: function() {
            return this.options.selectionMode === 'single';
        },

        _isMultipleSelection: function() {
            return this.options.selectionMode === 'multiple';
        },
                
        unselectAllRows: function(silent) {// Changed for AngularPrime
            this.tbody.children('tr.ui-state-highlight').removeClass('ui-state-highlight').attr('aria-selected', false);
            this.selection = [];

            // added for AngularPrime
            if(!silent) {
                this._trigger('unselectAllRows');
            }
        },
        
        unselectRow: function(row, silent) {
            var rowIndex = this._getRowIndex(row);
            row.removeClass('ui-state-highlight').attr('aria-selected', false);

            this._removeSelection(rowIndex);

            if(!silent) {
                this._trigger('rowUnselect', null, this.data[rowIndex]);
            }
        },
                
        selectRow: function(row, silent, event) {
            var rowIndex = this._getRowIndex(row);
            row.removeClass('ui-state-hover').addClass('ui-state-highlight').attr('aria-selected', true);

            this._addSelection(rowIndex);

            if(!silent) {
                this._trigger('rowSelect', event, this.data[rowIndex]);
            }
        },
                
        getSelection: function() {
            var selections = [];
            for(var i = 0; i < this.selection.length; i++) {
                selections.push(this.data[this.selection[i]]);
            }
            
            return selections;
        },
                
        _removeSelection: function(rowIndex) {        
            this.selection = $.grep(this.selection, function(value) {
                return value !== rowIndex;
            });
        },

        _addSelection: function(rowIndex) {
            if(!this._isSelected(rowIndex)) {
                this.selection.push(rowIndex);
            }
        },
                
        _isSelected: function(rowIndex) {
            return PUI.inArray(this.selection, rowIndex);
        },
                
        _getRowIndex: function(row) {
            var index = row.index();
            
            return this.options.paginator ? this._getFirst() + index : index;
        },
                
        _createStateMeta: function() {
            var state = {
                first: this._getFirst(),
                rows: this._getRows(),
                sortField: this.options.sortField,
                sortOrder: this.options.sortOrder
            };
            
            return state;
        },
                
        _updateDatasource: function(datasource) {
            this.options.datasource = datasource;
            
            this.reset();
            
            if($.isArray(this.options.datasource)) {
                this.data = this.options.datasource;
                this._renderData();
            }
            else if($.type(this.options.datasource) === 'function') {
                if(this.options.lazy)
                    this.options.datasource.call(this, this._onDataUpdate, {first:0, sortField:this.options.sortField, sortorder:this.options.sortOrder});
                else
                    this.options.datasource.call(this, this._onDataUpdate);
            }
        },
                
        _setOption: function(key, value) {
            if(key === 'datasource') {
                this._updateDatasource(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
                
        reset: function() {
            if(this.options.selectionMode) {
                this.selection = [];
            }
            
            if(this.paginator) {
                this.paginator.puipaginator('setPage', 0, true);
            }
            
            this.thead.children('th.pui-sortable-column').data('order', 0).filter('.ui-state-active').removeClass('ui-state-active')
                                .children('span.pui-sortable-column-icon').removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
        },

        // Added for AngularPrime
        selectRowByIndex: function(rowIndex) {
            this.selectRow($( this.tbody[0].children[rowIndex] ), true);
        },

        getData: function() {
            return this.data;
        },

        getPaginator: function() {
            return this.paginator;
        }
    });
});;/*globals $ */

/**
 * PrimeUI Paginator Widget
 */
$(function() {
    "use strict"; // added for AngularPrime

    var ElementHandlers = { // Changed for AngularPrime
        
        '{FirstPageLink}': {
            markup: '<span class="pui-paginator-first pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-first">p</span></span>',
            
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', 0);
                    }
                });
                                
                return element;
            },
            
            update: function(element, state) {
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PreviousPageLink}': {
            markup: '<span class="pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-prev">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === 0) {
                    element.addClass('ui-state-disabled');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page - 1);
                    }
                });
                
                return element;
            },
                    
            update: function(element, state) {
                if(state.page === 0)
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{NextPageLink}': {
            markup: '<span class="pui-paginator-next pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-next">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);
                
                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.options.page + 1);
                    }
                });
                
                return element;
            },
                    
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{LastPageLink}': {
            markup: '<span class="pui-paginator-last pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-end">p</span></span>',
                    
            create: function(paginator) {
                var element = $(this.markup);

                if(paginator.options.page === (paginator.getPageCount() - 1)) {
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                }
                
                element.on('click.puipaginator', function() {
                    if(!$(this).hasClass("ui-state-disabled")) {
                        paginator.option('page', paginator.getPageCount() - 1);
                    }
                });
                
                return element;
            },
            
            update: function(element, state) {
                if(state.page === (state.pageCount - 1))
                    element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                else
                    element.removeClass('ui-state-disabled');
            }
        },
                
        '{PageLinks}': {
            markup: '<span class="pui-paginator-pages"></span>',
                    
            create: function(paginator) {
                var element = $(this.markup),
                boundaries = this.calculateBoundaries({
                    page: paginator.options.page,
                    pageLinks: paginator.options.pageLinks,
                    pageCount: paginator.getPageCount(),
                }),
                start = boundaries[0],
                end = boundaries[1];
                
                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLinkElement = $('<span class="pui-paginator-page pui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</span>");
                    
                    if(i === paginator.options.page) {
                        pageLinkElement.addClass('ui-state-active');
                    }
                    
                    pageLinkElement.on('click.puipaginator', function(e){
                        var link = $(this);

                        if(!link.hasClass('ui-state-disabled')&&!link.hasClass('ui-state-active')) {
                            paginator.option('page', parseInt(link.text(), 10) - 1); // Changed for AngularPrime
                        }
                    });
                    
                    element.append(pageLinkElement);
                }

                return element;
            },
                    
            update: function(element, state) {
                var pageLinks = element.children(),
                boundaries = this.calculateBoundaries({
                    page: state.page,
                    pageLinks: state.pageLinks,
                    pageCount: state.pageCount // Changed for AngularPrime
                }),
                start = boundaries[0],
                end = boundaries[1],
                p = 0;
        
                pageLinks.filter('.ui-state-active').removeClass('ui-state-active');
                
                for(var i = start; i <= end; i++) {
                    var pageLinkNumber = (i + 1),
                    pageLink = pageLinks.eq(p);
            
                    if(i === state.page) {
                        pageLink.addClass('ui-state-active');
                    }
                    
                    pageLink.text(pageLinkNumber);
            
                    p++;
                }
            },
                    
            calculateBoundaries: function(config) {
                var page = config.page,
                pageLinks = config.pageLinks,
                pageCount = config.pageCount,
                visiblePages = Math.min(pageLinks, pageCount);
                
                //calculate range, keep current in middle if necessary
                var start = Math.max(0, parseInt(Math.ceil(page - ((visiblePages) / 2)), 10)), // Changed for AngularPrime
                end = Math.min(pageCount - 1, start + visiblePages - 1);

                //check when approaching to last page
                var delta = pageLinks - (end - start + 1);
                start = Math.max(0, start - delta);
                
                return [start, end];
            }
        }
        
    };

    $.widget("primeui.puipaginator", {
       
        options: {
            pageLinks: 5,
            totalRecords: 0,
            page: 0,
            rows: 0,
            template: '{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}'
        },
        
        _create: function() {
            this.element.addClass('pui-paginator ui-widget-header');
            this.paginatorElements = [];
            
            var elementKeys = this.options.template.split(/[ ]+/);
            for(var i = 0; i < elementKeys.length;i++) {
                var elementKey = elementKeys[i],
                handler = ElementHandlers[elementKey];
        
                if(handler) {
                    var paginatorElement = handler.create(this);
                    this.paginatorElements[elementKey] = paginatorElement;
                    this.element.append(paginatorElement);
                }
            }
            
            this._bindEvents();
        },
                
        _bindEvents: function() {
            this.element.find('span.pui-paginator-element')
                    .on('mouseover.puipaginator', function() {
                        var el = $(this);
                        if(!el.hasClass('ui-state-active')&&!el.hasClass('ui-state-disabled')) {
                            el.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.puipaginator', function() {
                        var el = $(this);
                        if(el.hasClass('ui-state-hover')) {
                            el.removeClass('ui-state-hover');
                        }
                    });
        },
        
        _setOption: function(key, value) {
            if(key === 'page') {
                this.setPage(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
                
        setPage: function(p, silent) {
            var pc = this.getPageCount();
            
            if(p >= 0 && p < pc && this.options.page !== p) {        
                var newState = {
                    first: this.options.rows * p,
                    rows: this.options.rows,
                    page: p,
                    pageCount: pc,
                    pageLinks: this.options.pageLinks
                };
                
                this.options.page = p;

                if(!silent) {
                    this._trigger('paginate', null, newState);
                }
                
                this.updateUI(newState);
            }
        },
                
        updateUI: function(state) {
            for(var paginatorElementKey in this.paginatorElements) {
                ElementHandlers[paginatorElementKey].update(this.paginatorElements[paginatorElementKey], state);
            }
        },
                
        getPageCount: function() {
            return Math.ceil(this.options.totalRecords / this.options.rows)||1;
        }
    });
});