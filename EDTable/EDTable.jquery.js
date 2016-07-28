/*! DTable - v0.5.1 - 2014-03-19
* https://github.com/kubanka-peter/dtable
* Copyright (c) 2014 Kubi; Licensed MIT */
var dCach = {};
var DTableInterfaces = (function ($) {

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * http://ejohn.org/blog/simple-javascript-inheritance/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    var Class = (function () {
        var initializing = false, fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        var Class = function () {
        };

        // Create a new Class that inherits from this class
        Class.extend = function (prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init) {
                    this.init.apply(this, arguments);
                }
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };

        return Class;
    })();

    var interfaces = {};

    var IFace = Class.extend({
        getIFaceNames: function()
        {
            var result = [];

            for (var name in interfaces)
            {
                result.push(name);
            }

            return result;
        },
        isExist: function(name)
        {
            if (interfaces[name] == undefined)
            {
                return false;
            }
            else
            {
                return true;
            }
        },
        add: function (name, iface)
        {
            if (this.isExist(name))
            {
                throw "Interface " + name + " is exists";
            }

            interfaces[name] = this.extend(iface);
        },
        get: function (name)
        {
            if (!this.isExist(name))
            {
                throw "Interface " + name + " is not exists";
            }

            return interfaces[name];
        },
        extend: function(props)
        {
            return Class.extend(props);
        }
    });

    return new IFace();

}(jQuery));
var DTableModule = (function (IFace, $) {

    var _modules = false;

    var DTableModule = IFace.extend({
        init: function () {
            this.MODULE_TEMPLATE = 'template';
            this.MODULE_DEFINITION = 'definition';
            this.MODULE_LOGGER = 'logger';
            this.MODULE_SOURCE = 'source';
            this.MODULE_SEARCH = 'search';
            this.MODULE_PAGINATION = 'pagination';
            this.MODULE_LOADING = 'loading';
            this.MODULE_ORDER = 'order';
            this.MODULE_FORMATTER = 'formatter';
            this.MODULE_CORE = 'core';
            this.MODULE_FORMATTER_WIDGET = 'formatter_widget';
            this.MODULE_EDITING = 'editing';
            this.MODULE_SAVING = 'saving';
            this.MODULE_EDITING_FILTER = 'editing_filter';
            this.MODULE_EDITING_FILTER_WIDGET = 'editing_filter_widget';
            this.MODULE_AGGREGATORS = 'aggregators';
        },
        initModules: function(){
            if (_modules == false)
            {
                _modules = {};

                $.each(IFace.getIFaceNames(), function(key, name){
                    _modules[name] = {};
                });
            }
        },
        check: function(type)
        {
            if (!IFace.isExist(type)) {
                throw "Invalid DTableModule type " + type;
            }
        },
        isExist: function(type, name)
        {
            this.initModules();

            if (_modules[type] == undefined || _modules[type][name] == undefined)
            {
                return false;
            }
            else
            {
                return true;
            }
        },
        getModule: function (type, name, options, dtable) {

            this.initModules();

            this.check(type);

            if (!this.isExist(type, name))
            {
                throw "DTableModule '" + name + "' doesn't exist.";
            }

            return new _modules[type][name](options, dtable);
        },
        newModule: function (type, name, props) {

            this.initModules();

            this.check(type);

            if (this.isExist(type, name))
            {
                throw "DTableModule " + name + " already exist.";
            }

            _modules[type][name] = IFace.get(type).extend(props);
        },
        extendModule: function (type, extend, newName, props) {

            this.initModules();

            this.check(type);

            if (!this.isExist(type, extend))
            {
                throw "DTableModule '" + extend + "' doesn't exist.";
            }

            if (this.isExist(type, newName)) {
                throw "DTableModule " + newName + " already exist.";
            }

            _modules[type][newName] = _modules[type][extend].extend(props);
        }
    });

    return new DTableModule();

}(DTableInterfaces, jQuery));
(function(IFace){

    IFace.add('core', {
        init: function(options, dtable) {
            this.table = dtable;
            var defaults = {
                definition: {
                    name: "json_url",
                    options: {}
                },
                template: {
                    name: "nunjucks",
                    options: {}
                },
                logger: {
                    name: "default",
                    options: {}
                },
                source: {
                    name: "json_url",
                    options: {}
                },
                search: {
                    name: "default",
                    options: {}
                },
                pagination: {
                    name: "default",
                    options: {}
                },
                loading: {
                    name: "default",
                    options: {}
                },
                order: {
                    name: "default",
                    options: {}
                },
                formatter: {
                    name: "advanced",
                    options: {
                        widget: "string"
                    }
                },
                editing: {
                    name: "browser_editing",
                    options: {}
                },
                saving: {
                    name: "default",
                    options: {}
                },
                editing_filter: {
                    name: "advanced",
                    options: {}
                },
                aggregators: {
                    name: "standart",
                    options: {}
                }
            };

            this.options = $.extend(true, {}, defaults, options);

            this.configure();
        },
        /**
         * Update table imediately, use search module update to queue
         */
        update: function () {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('definition', {
        isLoaded: false,
        loading: function (callback) {
        },
        /**
         * get the table title
         *
         * @returns {string}
         */
        getTitle: function () {
        },
        /**
         * get the columns definition,
         * must return the following format
         *
         * {
         *   <column_id> : {
         *     title: <title||flase>,                                       # column title, if false no column title will shown and order and html attr will not work
         *     filter: <false||{placeholder: <placeholder_text>}>,          # enable filter for column, placeholder shown in the input field
         *     order:  <false||true||"desc"||"asc">,                        # enable order for column, if "desc" or "asc" the column will be ordered
         *     html_tag_attr: <false || {                                             # html attributes, can be false
         *       <attr_name_1>: <attr_value_1},                             # style: "color: #f00" => <td style="color: #f00">{{ column_title }}</td>
         *       <attr_name_2>: <attr_value_3},
         *       ...
         *     }>
         *   }
         * }
         *
         *
         *
         * @returns {{}}
         */
        getColumns: function () {
        },
        /**
         *  get the pagination definition
         *  must return the following format or false:
         *
         *  {
         *      show_first_last: <true|false>,      # show first and last page
         *      pages: <int>,                       # how many page shown in the pager, odd number
         *      rows_per_page: <int>                # number of rows in a page
         *  }
         *
         *  if false returned, no pagination used
         *
         * @returns {{}}||false
         */
        getPagination: function () {
        },
        /**
         * get the global search definition
         * must return the following format or false:
         *
         * {
         *      placeholder: <string>               # search input field placeholder text
         *      submit: <string>                    # submit button text
         * }
         *
         * @returns {{}}
         */
        getSearch: function () {
        },
        /**
         * return true if one of the column deff has filter enabled
         */
        hasColumnFilter: function () {
        },
        /**
         * return true if one of the column has title
         */
        hasColumnTitle: function () {
        }

    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('formatter', {
        format: function (columnId, value, values, columns) {
            return value;
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('editing_filter', {
        beforeEdit: function($td){
            return true;
        },
        afterEdit: function($td) {
            return true;
        }
    });


}(DTableInterfaces));
(function(IFace, $) {

    IFace.add('formatter_widget', {
        init: function (options, dtable) {
            this.dtable = dtable;
            this.options = $.extend(true, {}, this.getDefaults(), options);
        },
        getDefaults: function () {
            return {};
        },
        format: function (columnId, value, values, columns) {
            return value;
        }
    });


}(DTableInterfaces, jQuery));
(function(IFace, $) {

    IFace.add('editing_filter_widget', {
        init: function (options, dtable) {
            this.dtable = dtable;
            this.options = $.extend(true, {}, this.getDefaults(), options);
        },
        getDefaults: function () {
            return {};
        },
        beforeEdit: function($td){
            return true;
        },
        afterEdit: function($td) {
            return true;
        }
    });


}(DTableInterfaces, jQuery));
(function(IFace){

    IFace.add('loading', {
        startLoading: function () {
        },
        stopLoading: function () {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('logger', {
        /**
         * Log error also throw exception and stop loading
         *
         * @param msg
         */
        error: function (msg) {
        },
        /**
         * Log info
         * @param msg
         */
        info: function (msg) {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('order', {
        getOrderBy: function () {
        }
    });

}(DTableInterfaces));
(function(IFace){

    IFace.add('pagination', {
        /**
         * current page
         * @return int
         */
        getPage: function () {
        },
        /**
         * set current page
         * @param page
         */
        setPage: function (page) {
        },
        /**
         * have to show first and last page?
         */
        getShowFirstLast: function () {
        },
        /**
         * number of pages to show in pagination, odd number!
         */
        getPageNum: function () {
        },
        /**
         * get rows per page
         */
        getRowsPerPage: function () {
        },
        /**
         * set rows per page
         * @param page
         */
        setRowsPerPage: function (page) {
        },
        /**
         * max page num
         */
        getMaxPage: function () {
        },
        /**
         * array contains pages to show in pagination
         */
        getPagesArr: function () {
        },
        /**
         * offset to post in query
         */
        getOffset: function () {
        },
        /**
         * rows per page select, return array with options
         */
        getRowsPerPageSelect: function () {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('search', {
        /**
         * call it when a search parameter changed, it will call dtable.update
         */
        update: function () {
        },
        /**
         * get the query params to post
         */
        getParams: function () {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('source', {
        isLoaded: false,
        loading: function (callback) {
        },
        /**
         * must return the following format:
         *
         * [{
         *   <column_id> : <data>,
         *   ...
         * }, ... ]
         */
        getRows: function () {
        },
        getCount: function () {
        }
    });


}(DTableInterfaces));
(function(IFace) {

    IFace.add('template', {
        isLoaded: false,
        /**
         * Add a template
         *
         * @param templateName
         * @param templateFile
         */
        addTemplate: function (templateName, templateFile) {
        },
        /**
         * return false if the template is not loaded
         *
         * @param templateName
         */
        getTemplate: function (templateName) {
        },
        /**
         * Load unloaded templates
         * @param callback
         */
        loading: function (callback) {
        },
        /**
         * Return the rendered table html
         * @param params
         */
        getTableHtml: function (params) {
        },
        /**
         * Retrun the rendered rows html
         * @param params
         */
        getRowsHtml: function (params) {
        },
        /**
         * Return the rendered pagination html
         * @param params
         */
        getPaginationHtml: function (params) {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('editing', {
        init: function (options, dtable) {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('saving', {
        init: function (options, dtable) {
        }
    });


}(DTableInterfaces));
(function(IFace){

    IFace.add('aggregators', {
        init: function (options, dtable) {
        }
    });


}(DTableInterfaces));
(function (DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_CORE, "firefly", {
        configure: function () {

            var obj = this;

            //add operations over dtable
            this.operation = helper;

            // init modules
            this.definition = DTableModule.getModule(DTableModule.MODULE_DEFINITION, this.options.definition.name, this.options.definition.options, this);
            this.pagination = DTableModule.getModule(DTableModule.MODULE_PAGINATION, this.options.pagination.name, this.options.pagination.options, this);
            this.template = DTableModule.getModule(DTableModule.MODULE_TEMPLATE, this.options.template.name, this.options.template.options, this);
            this.logger = DTableModule.getModule(DTableModule.MODULE_LOGGER, this.options.logger.name, this.options.logger.options, this);
            this.source = DTableModule.getModule(DTableModule.MODULE_SOURCE, this.options.source.name, this.options.source.options, this);
            this.search = DTableModule.getModule(DTableModule.MODULE_SEARCH, this.options.search.name, this.options.search.name, this);
            this.loading = DTableModule.getModule(DTableModule.MODULE_LOADING, this.options.loading.name, this.options.loading.options, this);
            this.order = DTableModule.getModule(DTableModule.MODULE_ORDER, this.options.order.name, this.options.order.options, this);
            this.editing = DTableModule.getModule(DTableModule.MODULE_EDITING, this.options.editing.name, this.options.editing.options, this);
            this.saving = DTableModule.getModule(DTableModule.MODULE_SAVING, this.options.saving.name, this.options.saving.options, this);
            this.aggregators = DTableModule.getModule(DTableModule.MODULE_AGGREGATORS, this.options.aggregators.name, this.options.aggregators.options, this);
            this.formatter = false;
            this.editing_filter = false;

            this.loading.startLoading();

            this.definition.loading(function(){

                // formatters need access to definition module
                // and we need to load it before templates
                obj.formatter = DTableModule.getModule(DTableModule.MODULE_FORMATTER, obj.options.formatter.name, obj.options.formatter.options, obj);
                obj.editing_filter = DTableModule.getModule(DTableModule.MODULE_EDITING_FILTER, obj.options.editing_filter.name, obj.options.editing_filter.options, obj);

                obj.template.loading(obj.loaded);
            });
        },
        /**
         * Everything is loaded? Then start rendering.
         */
        loaded: function () {
            if (this.definition.isLoaded && this.template.isLoaded) {
                this.renderTable();
                this.order.updateOrder();

                this.update();
            }
        },
        /**
         * Update table rows
         */
        update: function () {
            this.loading.startLoading();
            this.source.loading(this.sourceUpdated);
        },
        sourceUpdated: function () {
            this.loading.stopLoading();
            this.renderRows();
            this.renderPagination();

            this.table.trigger("dtable.updated");
        },
        /**
         * Render table
         */
        renderTable: function () {
            var html = this.template.getTableHtml({
                "title": this.definition.getTitle(),
                "pagination": this.definition.getPagination(),
                "aggregators": this.definition.getAggregators(),
                "search": this.definition.getSearch(),
                "columns": this.definition.getColumsFlipList(),
                "count_cols": Object.keys(this.definition.getColumns()).length,
                "has_column_filter": this.definition.hasColumnFilter(),
                "has_column_title": this.definition.hasColumnTitle(),
                dtable: this
            });

            this.renderTableHtml(html);
        },
        /**
         * Render table html
         *
         * @param html
         */
        renderTableHtml: function (html) {
            this.table.html(html);
        },
        /**
         * Render rows
         */
        renderRows: function () {

            var rows = this.source.getRows();
            var page = this.pagination.getPage();
            var rows_per_page = this.pagination.getRowsPerPage();
            rows = this.getFormat(rows);
            var html = this.template.getRowsHtml({
                rows: rows,
                columns: this.definition.getColumns(),
                saving: this.saving.options,
                count_cols: Object.keys(this.definition.getColumns()).length,
                ranking: {start: ((page - 1)*rows_per_page)},
                dtable: this
            });

            this.renderRowsHtml(html);
        },
        /**
         * Render rows html
         */
        renderRowsHtml: function (html) {
            var table = this.table.find('[data-dtable="table"]');

            if (table.length) {
                table.html(html);
            }
            else {
                this.logger.error('Can\'t find rows root element [data-dtable="table"]');
            }
        },
        /**
         * Render pagination
         */
        renderPagination: function () {
            var html = "";

            var pages = this.pagination.getPagesArr();

            if (pages) {
                html = this.template.getPaginationHtml({
                    first: 1,
                    last: this.pagination.getMaxPage(),
                    pages: pages,
                    active: this.pagination.getPage(),
                    first_last: this.definition.getPagination().show_first_last,
                    rows_per_page: this.pagination.getRowsPerPage(),
                    rows_per_page_select: this.pagination.getRowsPerPageSelect(),
                    dtable: this
                });
            }

            this.renderPaginationHtml(html);

        },

        getFormat: function(data){
            var columns = this.definition.getColumns();
            var formatter = this.formatter;

            for (var rowIndex in data)
                for (var colId in columns){
                    var res = formatter.format(colId, data[rowIndex][colId], data[rowIndex], columns);
                    data[rowIndex][colId] = ("undefined" == typeof res) ? "undefined" : res;
                }

            return data;
        },
        /**
         * Render pagination html
         */
        renderPaginationHtml: function (html) {
            var pagination = this.table.find('[data-dtable="pagination"]');

            if (pagination.length) {
                pagination.html(html);
            }
        },

        renderEmptyRowMess: function(){
            var page = this.pagination.getPage();
            var rows_per_page = this.pagination.getRowsPerPage();
            return this.template.getRowsHtml({
                "rows": [],
                "columns": this.definition.getColumns(),
                "saving": this.saving.options,
                "count_cols": Object.keys(this.definition.getColumns()).length,
                ranking: {start: ((page - 1)*rows_per_page)},
                dtable: this
            });
        },

        renderEmptyRow: function(){
            var page = this.pagination.getPage();
            var rows_per_page = this.pagination.getRowsPerPage();
            return this.template.getRowsHtml({
                "rows": this.definition.createEmptyRow(),
                "columns": this.definition.getColumns(),
                "saving": this.saving.options,
                "count_cols": Object.keys(this.definition.getColumns()).length,
                ranking: {start: ((page - 1)*rows_per_page)},
                dtable: this
            });
        },

        renderCustomRows: function(data){
            data = this.getFormat(data);
            var page = this.pagination.getPage();
            var rows_per_page = this.pagination.getRowsPerPage();

            return this.template.getRowsHtml({
                "rows": data,
                "columns": this.definition.getColumns(),
                "saving": this.saving.options,
                "count_cols": Object.keys(this.definition.getColumns()).length,
                ranking: {start: ((page - 1)*rows_per_page)},
                dtable: this
            });
        },

        renderCustomNewRows: function(data){
            data = this.getFormat(data);
            var page = this.pagination.getPage();
            var rows_per_page = this.pagination.getRowsPerPage();

            return this.template.getRowsHtml({
                "rows": data,
                "columns": this.definition.getColumns(),
                "saving": this.saving.options,
                "count_cols": Object.keys(this.definition.getColumns()).length,
                ranking: {start: ((page - 1)*rows_per_page)},
                dtable: this
            });
        },

        setNewRow: function($tr){
            var obj = this;
            var res = $($tr).each(function(i, e){
                $(e).attr('data-row', obj.saving.options.newRowIdPrefix + obj.saving.randomId());
            });
            return res;
//            return $($tr).attr('data-row', this.saving.options.newRowIdPrefix + this.saving.randomId());
        },

        addRow: function($tr){
            if(this.saving.options.save) $tr = this.setNewRow($tr);
            this.table.find(".row_empty").remove();
            this.table.find("table tbody").append($tr);
        },

        addRowPrepend: function($tr){
            $tr = this.setNewRow($tr);
            this.table.find(".row_empty").remove();
            this.table.find("table tbody").prepend($tr);
        },

        addClearRow: function($tr){
            this.table.find(".row_empty").remove();
            this.table.find("table tbody").append($tr);
        },

        addAfterRow: function($tr, parent){
            $tr = $($tr);
            $tr.insertAfter( parent );
            this.table.find('.row_empty').remove();
        },

        addNewAfterRow: function($tr, parent){
            $tr = this.setNewRow($tr);
            $tr.insertAfter( parent );
            this.table.find('.row_empty').remove();
        },

        addNewBeforeRow: function($tr, parent){
            $tr = $(this.setNewRow($tr));
            $tr.insertBefore( parent );
            this.table.find('.row_empty').remove();
        },

        addEmptyRowMess: function(){
            var emptyRow = this.renderEmptyRowMess();
            this.addClearRow(emptyRow);
        },

        getRowData: function($row){
            var rowData = [];
            this.saving.extractRowsData( $row, rowData );
            var res = rowData[0].tdArray;
            res.row_id = rowData[0].id;
            return res;
        },

        extractRow: function($row){
            var row_data = [];
            this.saving.extractRowsData($row, row_data);
            return row_data;
        },

        clear: function(){
            this.table.find('tbody tr').remove();
            this.addEmptyRowMess();
        },

        countRows: function(){
            return this.table.find('tbody tr[data-row]').length;
        },

        isEmptyTable: function(){
            return (0 < this.countRows() ? false : true);
        },

        countup: function(st){
            var start = st || 0;
            return start + 1;
        },

        typeof: function(v){
            return typeof v;
        },

        parseArrey: function(st){
            if('string' == typeof st && st.length > 0){
                var array = st.split(',');
                var r = this.operation.array_combine(array, array);
                return r;
            }
            else return {};
        },

        parseObject: function(st){
            if('string' == typeof st && st.length > 0){
                var res = "{"+st+"}";
                var r = JSON.parse(res);
                return r;
            }
            else return {};
        },

        setChanged: function(tr){
            $(tr).attr( this.saving.options.rowIsChangedAttr, 'true' );
        },

        removeSpeshSimb: function(val){
            return val.replace(':','').replace(';','').substring(val.search('\\.')+1,val.length);
        },

        log: function(v){
            console.log(v);
        },

        moveRowTo: function(row, to_obj, colbackDataWorker){
            var row_data = colbackDataWorker(this.extractRow(row));

            var newRow = to_obj.renderCustomRows([row_data]);
            to_obj.addRow(newRow);
                                            // Удаляем строку
            this.addDelItem2Save(row);
            row.remove();

            if(this.isEmptyTable()){  //добавляем строку с сообщением что нет данных если это была последняя
                var newRowEmpty = this.renderEmptyRowMess();
                this.addRow(newRowEmpty);
            }

            if(this.saving.options.save) this.saving.enqueueSaving();
            if(to_obj.saving.options.save) to_obj.saving.enqueueSaving();

            return newRow;
        },

        addDelItem2Save: function($tr){
            var saveObj = this.saving;
            if(saveObj.options.save){
                var type = this.operation.getRowType($tr);
                if('item' == type){
                    saveObj.options.deletedRows[this.operation.getRowId($tr)] = this.operation.getRowId($tr);
                }
                if('share' == type){
                    saveObj.options.deletedRows['p' + this.operation.getColVal($tr, 'p_id')] = 'p' + this.operation.getColVal($tr, 'p_id');
                }
            }
        },
    });

}(DTableModule, jQuery));
(function (DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_DEFINITION, "json_url", {
        init:            function (options, dtable) {
            this.definition = {};
            this.isLoaded = false;

            var defaults = {
                method:    "get",
                url:       "",
                data:      {},
                timestamp: false,
                search: true
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);
        },
        getTitle:        function () {
            return this.definition.title;
        },
        getColumns:      function () {
            return this.definition.columns;
        },
        getColumsFlipList: function(){
            var cols = this.definition.columns;
            for (var colId in cols){
                if('undefined' != typeof cols[colId].formatter && 'list' == cols[colId].formatter.widget){
                    cols[colId].formatter.widget_options.list = this.dtable.operation.ksort(this.dtable.operation.array_flip(cols[colId].formatter.widget_options.list));
                }
            }
            return cols;
        },
        createEmptyRow: function(){
            var r = [];
            var columns = this.getColumns();

            r[0] = {};
            for(var t in columns){
              r[0][t] = ""; //&nbsp;
            }

            var rows = r;
            var formatter = this.dtable.formatter;

            for (var rowIndex in rows)
                for (var colId in columns)
                    rows[rowIndex][colId] = formatter.format(colId, rows[rowIndex][colId], rows[rowIndex], columns);

            return r;
        },
        getPagination:   function () {
            return {
                show_first_last: this.dtable.pagination.getShowFirstLast(),
                pages:           this.dtable.pagination.getPageNum(),
                rows_per_page:   this.dtable.pagination.getRowsPerPage()
            };
        },
        getSearch: function () {
            if(this.options.search){
                return {
                    placeholder: this.dtable.search.options.placeholder
                };
            }
        },
        getAggregators: function () {
            if(this.dtable.aggregators.options.enable){
                return this.dtable.aggregators.getAgg();
            }
        },
        hasColumnFilter: function () {
            return this.definition.has_column_filter;
        },
        hasColumnTitle: function() {
            return this.definition.has_column_title;
        },
        loading:         function (callback) {
            var url = this.options.url;
            var obj = this;

            function success(data) {
                obj.definition = data;
                obj.isLoaded = true;
                obj.dtable.logger.info("json_url.definition: resource is loaded");

                obj.definition.has_column_filter = false;
                obj.definition.has_column_title = false;

                $.each(obj.getColumns(), function (key, value) {
                    if (value.filter) {
                        obj.definition.has_column_filter = true;
                    }

                    if (value.title)
                    {
                        obj.definition.has_column_title = true;
                    }
                });

                callback.call(obj.dtable);

                if (obj.options.onLoad) obj.options.onLoad();
            }

            var type = "POST";
            if (this.options.method == "get") {
                type = "GET";
            }

            $.ajax(url, {
                url:      url,
                type:     type,
                async:    true,
                cache:    this.options.timestamp,
                data:     this.options.data,
                dataType: "json",
                error:    function () {
                    obj.dtable.logger.error("Can't load definition resource from " + url);
                },
                success:  success
            });
        }
    });

}(DTableModule, jQuery));
(function($, DTableModule) {
    var dtable = {};
    var methods = {
        init : function (options, core) {
            if (!this.data("dtable")) {
                core = core || "firefly";
                dtable[$(this).selector] = DTableModule.getModule(DTableModule.MODULE_CORE, core, options, this);
            } else
                dtable[$(this).selector] = this.data("dtable");

            return dtable[$(this).selector];
        },
        get : function( content ) {
          return dtable[$(this).selector];
        }
    };

    $.fn.dtable = function( method ) {
        // логика вызова метода
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object') {
            return methods.init.apply( this, arguments );
        } else if ( ! method ) {
            return methods.get.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.dtable' );
        }
    };

}(jQuery, DTableModule));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER, "advanced", {
        init: function (options, dtable) {

            var defaults = {
                widget: "string",
                widget_options: {
                    escape: true
                }
            };

            this.dtable = dtable;
            this.options = $.extend(true, {}, defaults, options);

            this.widgets = false;

            this.buildWidgetSchema();
        },
        buildWidgetSchema: function () {

            if (this.widgets === false) {

                this.widgets = {};

                var obj = this;
                var columns = this.dtable.definition.getColumns();

                $.each(columns, function (columnId, options) {

                    var formatterOpt = obj.options;

                    if (options.hasOwnProperty("formatter") && options.formatter) {
                        formatterOpt = $.extend(true, {widget_options: {column_id: columnId}}, obj.options, options.formatter);
                    }

                    obj.setWidget(columnId, formatterOpt);
                });
            }
        },
        setWidget: function (columnId, options) {
            this.widgets[columnId] = DTableModule.getModule(DTableModule.MODULE_FORMATTER_WIDGET, options.widget, options.widget_options, this.dtable);
        },
        getWidget: function (columnId) {
            if (this.widgets[columnId] === undefined) {
                throw "widget does not exist for " + columnId;
            }

            return this.widgets[columnId];
        },
        format: function (columnId, value, values, columns) {

            var widget = this.getWidget(columnId);

            return widget.format(columnId, value, values, columns);
        }

    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER, "simple", {
        init: function(options, dtable){

            var defaults = {
                widget: 'string',
                widget_options: {
                    escape: true
                }
            };

            this.options = $.extend(true, {}, defaults, options);
            this.dtable = dtable;

            this.widget = false;
        },
        initWidget: function(){
            if (this.widget === false)
            {
                this.widget = DTableModule.getModule(DTableModule.MODULE_FORMATTER_WIDGET, this.options.widget, this.options.widget_options, this.dtable);
            }
        },
        format: function (columnId, value, values, columns) {

            this.initWidget();

            return this.widget
                .format(columnId, value, values, columns);
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "row_highlight", {
        getDefaults: function(){
            return {
                class: "row_highlight",
                col_name: '',
                col_val: ''
            };
        },
        format: function (columnId, value, values, columns) {

            if(this.options.col_val === values[this.options.col_name])
                value = "<span class='"+this.options.class+"'>"+value+"</span>";

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "number", {
        getDefaults: function(){
            return {
                number_format: '0,0.0',
                language: 'en',
                force_number: false
            };
        },
        format: function (columnId, value, values, columns) {
            if ('undefined' === typeof value) return 'undefined';

            if (!isNaN(parseInt(value)) || this.options.force_number)
            {
                numeral.language(this.options.language);
                value = numeral(value).format(this.options.number_format);
            }

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "currency", {
        getDefaults: function(){
            return {
                cur_format: ' 0,0[.]00',
                cur_symbol: '$',
                language: 'en',
                force_number: false
            };
        },
        format: function (columnId, value, values, columns) {
            if ('undefined' === typeof value) return 'undefined';

            if (!isNaN(parseInt(value)) || this.options.force_number)
            {
                numeral.language(this.options.language);
                value = numeral(value).format(this.options.cur_symbol+this.options.cur_format);
            }

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "date", {
        getDefaults: function(){
            return {
                formatte: 'D/M/Y'
            };
        },
        format: function (columnId, value, values, columns) {

            if('0000-00-00 00:00:00' === value || '0000-00-00' === value || '' === value)
                return '';

            var date = new Date(Date.parse(value.replace(' ','T')));
            var Y = date.getFullYear();
            var M = date.getMonth()+1;
            var D = date.getDate();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();

            value = this.options.formatte.replace('Y', Y).replace('M', M).replace('D', D).replace('h', h).replace('m', m).replace('s', s);

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "date_unix_time", {
        getDefaults: function(){
            return {
                formatte: 'D/M/Y'
            };
        },
        format: function (columnId, value, values, columns) {

            var date = new Date(Date(value));
            var Y = date.getFullYear();
            var M = date.getMonth()+1;
            var D = date.getDate();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();

            value = this.options.formatte.replace('Y', Y).replace('M', M).replace('D', D).replace('h', h).replace('m', m).replace('s', s);

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "list", {
        getDefaults: function(){
            return {
                list: {},
                def: " "
            };
        },
        format: function (columnId, value, values, columns) {

            if ('undefined' === typeof value) return 'undefined';
            var list = this.options.list;
            var found = false;

            for (var itemId in list){
                if (itemId == value && !found){
                    value = list[itemId];
                    found = true;
                }
            }

            if (!found) value = this.options.def;

            return value;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "partial", {
        init: function (options, dtable) {
            this._super(options, dtable);

            if (this.options.template === undefined || this.options.template === false)
            {
                throw "partial widget requires template option";
            }

            this.templateName = "partial_" + this.options.column_id;
            this.dtable.template.addTemplate(this.templateName, this.options.template);

            this.template = false;
        },
        getDefaults: function () {
            return {
                template: false
            };
        },
        format: function (columnId, value, values, columns) {

            if (this.template === false)
            {
                this.template = this.dtable.template.getTemplate(this.templateName);
            }

            return this.template.render({
                value: value,
                column_id: columnId,
                values: values,
                columns: columns,
                xy: function(){ return "a";}
            });
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "ajaxsubrow", {
        init: function (options, dtable) {
            this._super(options, dtable);

            this.dtable = dtable;
            if (this.options.url === undefined || this.options.url === false || this.options.col === undefined || this.options.col === false)
                throw "ajaxsubrow widget requires url option and col option";

            this.createEvents();
        },
        createEvents: function(){
            var obj = this;
            this.dtable.table.on("click", "[data-column='"+this.options.column_id+"']", function(){
                                            // Если нажали "+"
                var data = obj.dtable.getRowData($(this).parent());
                if(obj.options.close === $(this).html()){
                    if(0 === $(this).parent().parent().find("[data-row-parent-id="+data.row_id+"]").length){
                        obj.dtable.loading.startLoading();
                                                // Подгружаем shares этого item'а
                        var parentTR = $(this).parent();
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: obj.options.url+'/'+obj.dtable.operation.getColVal(parentTR,obj.options.col),
                            data: data,
                            success: function(answer){
                                var newRows = obj.dtable.renderCustomRows(answer.rows);
                                obj.dtable.addAfterRow(newRows,parentTR);

                                if (obj.options.onLoad) {
                                    eval(obj.options.onLoad);
                                }
                                obj.dtable.loading.stopLoading();
                            }
                        });
                    } else {
                                                // Если загружены - показываем их
                        $(this).parent().parent().find("[data-row-parent-id="+data.row_id+"]").show();
                    }
                    $(this).html(obj.options.open);
                }
                else if(obj.options.open === $(this).html()){
                                                // Если нажали "-" - скрываем
                    obj.hideTree($(this).parent().parent(),data.row_id);
                    $(this).html(obj.options.close);
                }
                return false;
            });
        },

        hideTree: function($body, id){
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="code"]').hide();
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="subelement"] [data-column="element"]:parent').html(this.options.close);
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="subelement"]').hide();
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="element"] [data-column="area"]:parent').html(this.options.close);
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="element"]').hide();

            // для окна заявок
            $body.find('[data-row-parent-id^="'+id+'"][data-row-type="share"]').hide();

//            var items = $body.find("[data-row-parent-id="+id+"]");
//            for (var i=0, len=items.length; i < len; i++ ){
//                var subitem_id = $(items[i]).hide().data('row');
//                if($body.find("[data-row-parent-id="+subitem_id+"]").length){
//                    this.hideTree($body,subitem_id);
//                }
//
//                //найти все значки что дерево раскрыто
//                var children = $(items[i]).children();
//                for (var k=0, len_k=children.length; k < len_k; k++ ){
//                    if(this.options.open === $(children[k]).html()){
//                        $(children[k]).html(this.options.close);
//                    }
//                }
//            }
        },

        getDefaults: function () {
            return {
                url: false,
                close: '+',
                open: '-'
            };
        },
        format: function (columnId, value, values, columns) {
            if("undefined" !== value){
                if('+' === value)
                    return this.options.close;
                if('-' === value)
                    return this.options.open;
                else
                    return value;
            }
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_FORMATTER_WIDGET, "string", {
        entityMap: {
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        },
        escapeHTML: function(string)
        {
            var obj = this;

            return String(string).replace(/[<>"'\/]/g, function (s) { //return String(string).replace(/[&<>"'\/]/g, function (s) {
                return obj.entityMap[s];
            });
        },
        entityAdvansedMap: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        },
        escapeAdvansedHTML: function(string)
        {
            var obj = this;

            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return obj.entityAdvansedMap[s];
            });
        },
        getDefaults: function(){
            return {
                escape: true,
                advansed: false
            };
        },
        format: function (columnId, value, values, columns) {

            if (this.options.advansed)
                return this.escapeAdvansedHTML(value);
            if (this.options.escape)
                return this.escapeHTML(value);
            else return value;

        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_LOADING, "default", {
        init: function(options, dtable){
            var defaults = {
                enabled: true,
                delay: 100
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);

            this.is_loading = false;

        },
        startLoading: function(){

            var obj = this;
            this.dtable.table.trigger("dtable.start_loading");

            if (!this.is_loading && this.options.enabled)
            {
                this.is_loading = true;

                setTimeout(function(){

                    if (obj.is_loading){
                        obj.dtable.table.find('[data-dtable="loading-container"]').html(obj.div).show();
                    }

                }, this.options.delay);
            }
        },
        stopLoading: function(){

            this.dtable.table.trigger("dtable.stop_loading");

            if (this.options.enabled){
                this.is_loading = false;
                this.dtable.table.find('[data-dtable="loading-container"]').hide();
            }
        }
    });

}(DTableModule, jQuery));
(function(DTableModule) {

    DTableModule.newModule(DTableModule.MODULE_LOGGER, "default", {
        init:  function (options, dtable) {
            var defaults = {
                debug: false
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);
        },
        error: function (msg) {
            this.dtable.loading.stopLoading();

            this.dtable.table.html("Error.");

            throw msg;
        },
        info:  function (msg) {
            if (this.options.debug) {
                console.log(msg);
            }
        }
    });

}(DTableModule));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_ORDER, 'default', {
        init: function(options, dtable) {

            var defaults = {};

            this.options = $.extend({}, defaults, options);
            this.dtable = dtable;

            //added default ordering
            this.columns = this.options;

            var obj = this;

            this.dtable.table.on("dblclick taphold", '[data-dtable="order"]', function(event){
                event.preventDefault();
                obj.dtable.editing.clearSelection();
                var order = 'asc';
                if($(this).find('[data-dtable="order.asc"]').is(':visible')) order = 'desc';
                obj.setOrder($(this), order);

                return false;
            });
        },

        updateOrder: function(){
            var id;
            var option = this.columns;
            for (id in option);
            this.dtable.table.find('[data-dtable="order.asc"]').hide();
            this.dtable.table.find('[data-dtable="order.desc"]').hide();

            this.dtable.table.find('th[data-column="'+id+'"] [data-dtable="order.'+option[id]+'"]').show();
        },
        setOrder: function(link, order){
            this.dtable.table.find('[data-dtable="order.asc"]').hide();
            this.dtable.table.find('[data-dtable="order.desc"]').hide();

            link.find('[data-dtable="order.'+order+'"]').show();
            this.columns = {};
            this.columns[link.attr("data-column")] = order;

            this.dtable.update();
        },
        getOrderBy: function() {
            return this.columns;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_PAGINATION, "default", {
        init: function(options, dtable){
            var defaults = {
                show_first_and_last: true,
                pages: 5,
                rows_per_page: 20,
                rows_per_page_select: [20, 50, 100]
            };

            this.page = 1;
            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);

            this.createEvents();
        },
        createEvents: function(dtable){
            var obj = this;
            this.dtable.table.on("click", '[data-dtable="page"]', function(){
                var link = $(this);
                var page = link.attr("data-page");

                obj.setPage(page);

                obj.dtable.update();

                return false;
            });

            this.dtable.table.on("change", '[data-dtable="rows-per-page-select"]', function(){
                var rowsPerPage = $(this).val();

                obj.setRowsPerPage(rowsPerPage);
                obj.setPage(1);

                obj.dtable.update();

                return false;
            });
        },
        // current page
        getPage: function(){
            return this.page;
        },
        setPage: function(page){
            this.page = parseInt(page);
        },
        // pagination first and last page show?
        getShowFirstLast: function(){
            return this.options.show_first_and_last;
        },
        // pagination, shown pages
        getPageNum: function(){
            return this.options.pages;
        },
        // number of results per page
        getRowsPerPage: function(){
            return this.options.rows_per_page;
        },
        setRowsPerPage: function(rows){
            this.options.rows_per_page = rows;
        },
        getMaxPage: function(){
            return Math.ceil(this.dtable.source.getCount() / this.dtable.definition.getPagination().rows_per_page);
        },
        getOffset: function(){
            return (this.page * this.options.rows_per_page) - this.options.rows_per_page;
        },
        getPagesArr: function(){
            var maxPage = this.getMaxPage() || 1;
            var minPage = 1;

            var offset = Math.round((this.dtable.definition.getPagination().pages - 1) / 2);
            var start = this.getPage() - offset;
            var end = this.getPage() + offset;

            start = Math.max(minPage, start);
            end = Math.min(maxPage, end);

            if (end < this.dtable.definition.getPagination().pages)
            {
                end = Math.min(this.dtable.definition.getPagination().pages, maxPage);
            }

            if ((end - start) < this.dtable.definition.getPagination().pages)
            {
                start = end - this.dtable.definition.getPagination().pages + 1;
                if (start < minPage)
                {
                    start = minPage;
                }
            }

            var pages = false;

            if (start !== end){
                pages = [];

                for (var i = start; i <= end; i++)
                {
                    pages.push(i);
                }
            }

            return pages;
        },
        setRowsPerPageSelect: function(s)
        {
            this.options.rows_per_page_select = s;
        },
        getRowsPerPageSelect: function()
        {
            return this.options.rows_per_page_select;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_SEARCH, "default", {
        init: function(options, dtable){

            var defaults = {
                placeholder: "search ...",
                waiting: 600
            };

            this.search = "";

            this.filter = "";

            this.in_progress = false;
            this.update_after = false;

            this.options = $.extend({}, defaults, options);
            this.dtable = dtable;

            this.createEvents();
        },
        createEvents: function(){
            var obj = this;

            this.dtable.table.on("keyup", '[data-dtable="search"]', function(){
                obj.search = $(this).val();
                obj.dtable.pagination.setPage(1);
                obj.update();
            });

            this.dtable.table.on("keyup", '[data-dtable="filter"]', function(){
                var elem = $(this);

                if (obj.filter === "")
                {
                    obj.filter = {};
                }
                obj.filter[elem.attr('data-column')] = elem.val();
                obj.dtable.pagination.setPage(1);
                obj.update();
            });

            this.dtable.table.on("change", 'select[data-dtable="filter"]', function(){
                var elem = $(this);

                if (obj.filter === "")
                {
                    obj.filter = {};
                }
                obj.filter[elem.attr('data-column')] = elem.val();
                obj.dtable.pagination.setPage(1);
                obj.update();

                obj.dtable.table.find("[data-dtable='filter.icon']").hide();
                obj.dtable.table.find('[data-dtable="filter.row"] select').each(function(i,elem){
                    if(0 < $(this).val().length)
                        obj.dtable.table.find("th[data-column='"+$(this).data('column')+"'] [data-dtable='filter.icon']").show();

                });
                $(window).focus();
                mouseover = false;
                clearTimeout(timerOpen);
                timerClose = setTimeout(function(){
                    obj.dtable.table.find('[data-dtable="filter.row"]').hide();
                } , 400);
            });

            var mouseover = false;
            var timerOpen, timerClose;
            this.dtable.table.on('click', 'thead', function(){
                obj.dtable.table.find('[data-dtable="filter.row"]').show();
                mouseover = true;

                return false;
            });
            this.dtable.table.on('mouseover', 'thead', function(){
                clearTimeout(timerClose);
                timerOpen = setTimeout(function(){
                    if (true === mouseover) obj.dtable.table.find('[data-dtable="filter.row"]').show();
                }, 650);

                return false;
            });
            this.dtable.table.on('mouseout', 'thead', function(){
                var h = true;
                clearTimeout(timerOpen);
                obj.dtable.table.find("[data-dtable='filter.icon']").hide();
                obj.dtable.table.find('[data-dtable="filter.row"] input').each(function(i,elem){
                    if($(this).is(":focus")) h = false;
                    if(0 < $(this).val().length)
                        obj.dtable.table.find("th[data-column='"+$(this).data('column')+"'] .filtered").show();
                });
                $('[data-dtable="filter.row"] select').each(function(i,elem){
                    if($(this).is(":focus")) h = false;
                    if(0 < $(this).val().length)
                        obj.dtable.table.find("th[data-column='"+$(this).data('column')+"'] .filtered").show();
                });
                if(h) {
                    timerClose = setTimeout(function(){
                        if (false === mouseover) obj.dtable.table.find('[data-dtable="filter.row"]').hide();
                    } , 300);
				}
                mouseover = false;

                return false;
            });
            this.dtable.table.on('focusout', '[data-dtable="filter.row"] input', function(){
                var h = true;
                obj.dtable.table.find("[data-dtable='filter.icon']").hide();
                obj.dtable.table.find('[data-dtable="filter.row"] input').each(function(i,elem){
                    if($(this).is(":focus")) h = false;
                    if(0 < $(this).val().length)
                        obj.dtable.table.find("th[data-column='"+$(this).data('column')+"'] [data-dtable='filter.icon']").show();

                });
                if(h && !mouseover) $('[data-dtable="filter.row"]').hide();

                return false;
            });
        },
        update: function()
        {
            var waiting = parseInt(this.options.waiting);
            this.update_after = new Date().getTime() + waiting;

            if (!this.in_progress)
            {
                this.in_progress = true;

                var obj = this;

                var wait = function(){
                    if (new Date().getTime() >= obj.update_after)
                    {
                        obj.in_progress = false;
                        obj.dtable.update();
                    }
                    else
                    {
                        setTimeout(wait, waiting / 2);
                    }
                };

                setTimeout(wait, waiting / 2);
            }
        },
        getParams: function(){
            var params = {
                search: this.search,
                filter: this.filter,
                per_page: this.dtable.definition.getPagination().rows_per_page,
                offset: this.dtable.pagination.getOffset(),
                order: this.dtable.order.getOrderBy()
            };

            return params;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_SOURCE, "json_url", {
        init: function(options, dtable){
            var defaults = {
                url: "",
                method: "post",
                params: {}
            };

            this.data = null;
            this.isLoaded = false;
            this.options = $.extend({}, defaults, options);
            this.dtable = dtable;
            this.createEvents();
        },
        createEvents: function(){
            var obj = this;
            this.dtable.table.on('click', '[data-dtable="update"]', function(event) {
                event.preventDefault();
                obj.dtable.update();
                return false;
            });
        },
        loading:  function (callback) {

            var url = this.options.url;
            var obj = this;

            function success(data) {

                if (!('agg' in data ) || !('rows' in data)){
                    obj.dtable.logger.error("Invalid source response");
                }

                obj.data = data;
                obj.isLoaded = true;
                callback.call(obj.dtable);

                if (obj.options.onLoad) obj.options.onLoad();
                if (obj.dtable.aggregators.options.enable) obj.dtable.aggregators.update();
            }

            function error() {
                obj.dtable.logger.error("Can't load source resource from " + url);
            }

            var agg = (0 < Object.keys(this.dtable.aggregators.options.cols).length) ? this.dtable.aggregators.getCols() : '';

            var sendData = $.extend(obj.dtable.search.getParams(), this.options.params, {agg: agg});

            if (this.options.method === "get") {
                $.get(url, sendData, success, "json").error(error);
            } else {
                $.post(url, sendData, success, "json").error(error);
            }
        },
        getRows: function(){
            return this.data.rows;
        },
        getCount: function(){
            return this.data.agg.cnt;
        },
        getAgg: function(){
            return this.data.agg;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_SOURCE, "empty", {
        init: function(options, dtable){
            var defaults = {
            };

            this.data = {rows: [], agg:{cnt:0}};
            this.isLoaded = true;
            this.options = $.extend({}, defaults, options);
            this.dtable = dtable;
            this.createEvents();
        },
        createEvents: function(){
            var obj = this;
            this.dtable.table.on('click', '[data-dtable="update"]', function(event) {
                event.preventDefault();
                obj.dtable.update();
                return false;
            });
        },
        loading:  function (callback) {
            callback.call(this.dtable);

            if (this.options.onLoad) this.options.onLoad();
            if (this.dtable.aggregators.options.enable) this.dtable.aggregators.update();
        },
        getRows: function(){
            return this.data.rows;
        },
        getCount: function(){
            return this.data.agg.cnt;
        },
        getAgg: function(){
            return this.data.agg;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, nunjucks) {

    DTableModule.newModule(DTableModule.MODULE_TEMPLATE, "nunjucks", {
        init:    function (options, dtable) {
            this.isLoaded = false;

            var defaults = {
                view_dir:            "/views",
                table_template:      "table.html",
                rows_template:       "rows.html",
                pagination_template: "pagination.html"
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);

            this.templates = {};

            this.addTemplate('table', this.options.table_template);
            this.addTemplate('rows', this.options.rows_template);
            this.addTemplate('pagination', this.options.pagination_template);

            this.env = new nunjucks.Environment(new nunjucks.WebLoader(this.options.view_dir, {useCache: true}),{
                autoescape: false,
                web: {useCache: true}
            });
        },
        addTemplate: function(templateName, templateFile)
        {
            if (this.templates[templateName] !== undefined)
            {
                throw "template " + templateName + " is exist";
            }
            var d = this.options.view_dir;

            this.templates[templateName] = {
                file: templateFile,
                template: dCach[d+'/'+templateFile] || false
            };
        },
        /**
         * return false if the template is not loaded
         *
         * @param templateName
         */
        getTemplate: function(templateName) {

            if (this.templates[templateName] === undefined)
            {
                throw "template " + templateName + " is'nt exist.";
            }

            return this.templates[templateName].template;
        },
        loading: function (callback) {

            var obj = this;

            var checkLoaded = function(){
                var ok = true;
                $.each(obj.templates, function(templateName, options){
                    if (!options.template)
                    {
                        ok = false;
                    }
                });

                if (ok)
                {
                    obj.isLoaded = true;
                    obj.dtable.logger.info("nunjucks.template.js: all loaded");
                    callback.call(obj.dtable);
                }
            };
            checkLoaded();
            $.each(this.templates, function(templateName, options){
                if (!options.template)
                {
                    obj.env.getTemplate(options.file, function(err, tmpl){
                        if (err)
                        {
                            obj.dtable.logger.error(err);
                        }
                        else
                        {
                            obj.templates[templateName].template = tmpl;
                            var d = obj.options.view_dir;
                            dCach[d+'/'+options.file] = tmpl;
                            obj.dtable.logger.info("nunjucks.template.js: " + templateName + " is loaded");
                            checkLoaded();
                        }
                    });
                }

            });
        },
        getTableHtml: function(params)
        {
            return this.getTemplate("table").render(params);
        },
        getRowsHtml: function(params)
        {
            return this.getTemplate("rows").render(params);
        },
        getPaginationHtml: function(params)
        {
            return this.getTemplate("pagination").render(params);
        }
    });

}(DTableModule, nunjucks));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING, "browser_editing", {
        init: function (options, dtable) {
            this.definition = {};
            this.isLoaded = false;

            var defaults = {
                edit: false,
                def_element: {
                    open: '<span contenteditable="true" data-editing_cell="true">',
                    close: '</span>'
                },
                def_getVal: function(t){ return t.text();},
                beforeMakeEditable: function(td) {},
                afterMakeEditable: function(td) {},
                beforeCancelEditable: function(td) {},
                afterCancelEditable: function(td) {},
                tooltipTempl: '<div data-toggle="tooltip" data-placement="top" title="{{info_text}}">{{info_text}}</div>',
                popoverTempl: '<div data-container="body" data-toggle="popover" data-placement="top" data-content="{{info_text}}">{{info_text}}</div>'
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);

            if(this.options.edit)
                this.createEvents();

        },

        secondEventOff: false, // сделано для того чтоб не срабатывало событие blur после события по нажатию

        createEvents: function(){
            var obj = this;
        // =============================================================
        //     Event handlers
        // =============================================================
            // Make a table cell editable on double click
            this.dtable.table.on('dblclick taphold', 'td[data-dtable="editable"]', function(event) {
                event.preventDefault();
                obj.makeEditable( $(this) );
//                return false;
            });

            // Stop editing on blur
            this.dtable.table.on('blur', '[data-editing_cell="true"]', function(event) {
                if(obj.secondEventOff) return; //false

                event.preventDefault();
                var self = $(this).parent();
                obj.cancelEditable( self, true );
//                return false;
            });


            // Keyboard events:
            // -- Stop editing on "Enter" and "Esc"
            // -- Move to a next or previous cell on "Tab" and "Shift-Tab"
            this.dtable.table.on('keydown', '[data-editing_cell="true"]', function(event) {
                var self = $(this).parent();

                if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed
                    obj.beforeKeyAction(event);
                    event.preventDefault();
                    obj.cancelEditable( self, true );
                }
                else if (event.which === 9   &&   event.shiftKey ) {    // "Shift-Tab" is pressed
                    obj.beforeKeyAction(event);
                    event.preventDefault();
                    obj.cancelEditable( self, true );

                    var prevAllEdiTD = self.prevAll('[data-dtable="editable"]');
                    var prevTD = prevAllEdiTD.eq(0);
                    if ( prevAllEdiTD.length === 0 ) {
                        var prevTR = self.parent('tr').prev('tr');
                        if ( prevTR.length === 0 ) {
                            return;
                        }
                        prevTD = prevTR.children('[data-dtable="editable"]').eq(-1);
                    }

                    setTimeout(obj.makeEditable( prevTD ), 5); // сделано для того чтоб не срабатывало событие blur после события по нажатию
                }
                else if (event.which === 9 ) {    // "Tab" is pressed
                    obj.beforeKeyAction(event);
                    event.preventDefault();
                    obj.cancelEditable( self, true );
                    var nextAllEdiTD = self.nextAll('[data-dtable="editable"]');
                    var nextTD = nextAllEdiTD.eq(0);
                    if ( nextAllEdiTD.length === 0 ) {
                        var nextTR = self.parent('tr').next('tr');
                        if ( nextTR.length === 0 ) {
                            return;
                        }
                        nextTD = nextTR.children('[data-dtable="editable"]').eq(0);
                    }
                    setTimeout(obj.makeEditable( nextTD ), 5); // сделано для того чтоб не срабатывало событие blur после события по нажатию
                }
            });

            // The same as the previous function - for Opera
            this.dtable.table.on('keyup', '[data-editing_cell="true"]', function(event) {
                var self = $(this).parent();
                if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed --- Opera
                    event.preventDefault();
                    obj.cancelEditable( self, true );
                }
            });
        },

        beforeKeyAction: function(e){
            this.secondEventOff = true;
        },


// =============================================================
//     Basic functions
// =============================================================
        // Clear selection that appears when the user double clicks text
        clearSelection: function() {
            if (document.selection   &&   document.selection.empty) {
                document.selection.empty();
            }
            else if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        },

        // Make a table cell editable
        makeEditable: function(target) {
            this.secondEventOff = false; // сделано для того чтоб не срабатывало событие blur после события по нажатию
            var cancel = this.options.beforeMakeEditable(target);
            if(cancel) return;

            var isEditing = this.setEditing(target);
            if(isEditing) return;

            // save previos value
            target.data('before', target.text());

            //eval save befor evant
            if(this.dtable.saving.options.save)
                this.dtable.saving.beforeEdit(target);

            if(this.dtable.editing_filter.beforeEdit(target)){
                var editableHTML = this.options.def_element.open + target.text() + this.options.def_element.close;
                target.html( editableHTML );
            }

            this.clearSelection();
            target.children().eq(0).focus();

            this.options.afterMakeEditable(target);
        },

        // Cancel the editable mode for a table cell
        cancelEditable: function(target, onBlur) {
            if(onBlur) {
                this.options.beforeCancelEditable(target);

                if(this.dtable.editing_filter.afterEdit(target)){
                    target.html( this.options.def_getVal(target) );
                }
            }

            this.clearSelection();
            $(window).focus();
            //eval save after evant
            if(this.dtable.saving.options.save)
                this.dtable.saving.afterEdit(target);

            this.options.afterCancelEditable(target);

            this.cancelEditing(target);

            this.setInfoBar(target);
        },

        setInfoBar: function(td){
            var tr = td.parent();
            var templ = '{{info_text}}';
            templ = ('tooltip' == tr.data("row-cell-info")) ? this.options.tooltipTempl : templ;
            templ = ('popover' == tr.data("row-cell-info")) ? this.options.popoverTempl : templ;
            var res = templ.replace(/\{\{info_text\}\}/g, td.text());
            td.html(res);
        },

        setEditing: function(td){
            if('editing' != td.data('editing')){
                td.data('editing', 'editing');
                return false;
            }
            else {
                return true;
            }
        },

        cancelEditing: function(td){
            if('editing' == td.data('editing')){
                td.data('editing', 'edited');
                return true;
            }
            else {
                return false;
            }
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_SAVING, "default", {
        init: function (options, dtable) {
            this.definition = {};
            this.isLoaded = false;

            var defaults = {
                save: false,
                onEmptyAddRow: true,
                rowLoader: true,
                url: '',                     // Address that is used to save data
                col_id: 'col_id_',     // Prefix before a column ID in a TD class. It's used to find the column ID (such as "name", "status", etc)
                row_id: 'row_id_',     // Prefix before a row ID in a TR id.

                rowIsChangedAttr: 'data-is-changed',       // data- attribute indicating a row in which some data were changed

                newRowIdPrefix: 'new-row-',       // Prefix of a new row ID string:  <tr id = "newRowIdPrefix..."  ...>
                deletedRows: {},                          //  Buffer for info about deleted rows (if a row is deleted we cannot find it in the document any more)

                timer: null,                                   // timer = setTimeout()
                interval: 5000,                             // setTimeout( ..., interval )

                processesCounter: 0,                  // Counter to manage parallel async saving processes

                image: '.saving-in-progress',   // Selector to find the animated image "Saving in Progress"
                add_top_level: '.add_top_level',
                beforSave: function(){},
                afterSave: function(){},
                onAdd: function(){},
                onCopy: function(){},
                onDelete: function(){}
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);

            if(this.options.save)
                this.createEvents();
        },

        randomId: function(){
            return (Date.now()+Math.floor(Math.random()*1000000000000)).toString();
        },

        createEvents: function(){
            var obj = this;
        // ====================
        //   Add a new row
        // ====================
            this.dtable.table.on('click', '[data-dtable="add-new-row"]', function() {
                var parentTR = $(this).parent().parent('tr');
                var insertPoint = parentTR;

                var data = obj.options.onAdd(parentTR,$(this));
                if ("undefined" != typeof(data) && "undefined" != typeof(data.stopInsert)) //выходим если не нужно делать то, что по умолчанию
                    return;
                if ("undefined" != typeof(data) && "undefined" != typeof(data.insertPoint)) //даем возможность изменить место вставки строки
                    insertPoint = data.insertPoint;

                var newRow = (data) ? obj.dtable.renderCustomRows([data]) : obj.dtable.renderEmptyRow();
                obj.dtable.addNewAfterRow(newRow, insertPoint);

                obj.enqueueSaving();
            });
        // ====================
        //   Copy row
        // ====================
            this.dtable.table.on('click', '[data-dtable="copy-row"]', function() {
                var parentTR = $(this).parent().parent('tr');
                var insertPoint = parentTR;

                var data = obj.options.onCopy(parentTR,$(this));
                if ("undefined" != typeof(data) && "undefined" != typeof(data.stopInsert)) //выходим если не нужно делать то, что по умолчанию
                    return;
                if ("undefined" != typeof(data) && "undefined" != typeof(data.insertPoint)) //даем возможность изменить место вставки строки
                    insertPoint = data.insertPoint;

                var newRow = (data) ? obj.dtable.renderCustomRows([data]) : parentTR.clone();
                obj.dtable.addNewAfterRow(newRow, insertPoint);

                obj.enqueueSaving();
            });

        // ====================
        //   Delete a row
        // ====================
            this.dtable.table.on('click', '[data-dtable="delete-row"]', function() {
                var parentTR = $(this).parent().parent('tr');
                var yes = confirm("Строка будет безвозвратно удалена.\nПродолжить?");
                if ( yes ) {
                    if(!obj.options.onDelete(parentTR, $(this))){
                        obj.options.deletedRows[parentTR.data('row')] = parentTR.data('row');
                        parentTR.remove();
                    }
                    obj.enqueueSaving();
                    if(0 === obj.dtable.table.find("tbody td[data-column]").length){ //создаем пустую строку если это была последняя строка
                        var newRow = obj.dtable.renderEmptyRowMess();
                        obj.dtable.addClearRow(newRow);
                    }
                }
            });
        // ===========================================================
        //     If the user is about to quit the page with unsaved data
        // ===========================================================
            $(window).on('beforeunload', function() {
                if ( obj.options.timer )
                    return 'Данные, которые были изменены и/или добавлены, пока не сохранены. Нужно подождать 5 сек. \nХотите продолжить?';
            });
        },
    // ========================================
    //   ediTable_settings methods
    // ========================================
        beforeEdit: function( $td ) {

            // Save the initial text in the cell - to compare with text after editing afterwards
//            $td.data( 'before', $td.text() ); // moved to edit method

            return true;
        },

        afterEdit: function( $td ) {
            //$td.text( 'AFTER' );
            if(String.fromCharCode(160) !== $td.text())
                $td.text($td.text().trim());
            // Is text in the cell changed?
            if ( $td.data('before') !== $td.text() ) {
                var parentTR = $td.parent('tr');
                parentTR.attr( this.options.rowIsChangedAttr, 'true' );
                this.enqueueSaving();
            }
            $td.removeData('before');

            return true;
        },

    // ======================
    //   Enqueue next this.options
    // ======================
        enqueueSaving: function() {
            this.dtable.logger.info("try saving after "+this.options.interval+"ms...");
            var obj = this;
            if ( !this.options.timer ) {
                this.options.timer = setTimeout( function(){obj.fnSaveData();}, this.options.interval );
            }
        //show saving pricess
            this.showLoading();
        },

    // =============================================
    //   Save new / updated / deleted data
    // =============================================
        fnSaveData: function() {
            this.options.timer = null;
            this.dtable.logger.info("saving...");

            var obj = this;

            this.options.beforSave();
       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       //   DELETE: Remove the deleted rows from DB
       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if ( Object.keys(this.options.deletedRows).length > 0 ) {
                this.options.processesCounter++;

                this.dtable.logger.info("deliting...");

                $.ajax( {
                    url: this.options.url,
                    type: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify( this.options.deletedRows ),
                    success:   function( confirmedRows ) {
                            //alert("Удаленные строки удалены из БД на сервере успешно");
                            for (var i in confirmedRows) {
                                delete obj.options.deletedRows[confirmedRows[i]];
                            }
                    },
                    error:   function() {
                            //alert("Удалить строки из БД на сервере не удалось, операция будет повторена позже");
                            obj.enqueueSaving();console.log('error delete.....');
                            alert("Не удалось удалить! Перезагрузите страницу");
                    }
                })
                .always( function() {
                    obj.options.processesCounter--;
                    obj.hideLoading();
                    obj.options.afterSave(obj.options.processesCounter);
                });
            }


       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       //   POST: New rows saving
       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var newRows = obj.dtable.table.find( '[data-row^=' + this.options.newRowIdPrefix + ']' );

            if ( newRows.length > 0 ) {
                this.dtable.logger.info("adding...");
              // Data preparation
                var rowsDataArray = [];
                this.extractRowsData( newRows, rowsDataArray );

              // AJAX
                this.options.processesCounter++;

                $.ajax( {
                    url: this.options.url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( rowsDataArray ),

                    success:   function( savedRows ) {
                            var newRow = null;
                            var saveElse = false;
                            if("object" === typeof savedRows){
                                for (var i in savedRows) {
                                newRow = obj.dtable.table.find( '[data-row=' + savedRows[i].tempID+']' );
                                    if (newRow.length !== 0) {
                                        newRow.attr('id', obj.options.row_id+savedRows[i].dbID);
                                        newRow.data('row', savedRows[i].dbID);
                                        newRow.attr('data-row', savedRows[i].dbID);
                                    }
                                    else {
                                        obj.options.deletedRows[savedRows[i].dbID];
                                        console.log('success post but empty.....');
                                        saveElse = true;
                                    }
                                }
                            } else obj.enqueueSaving();
                            if (saveElse) obj.enqueueSaving();
                            // check it out - if a server returns dbID for a new row but the row has already been deleted  - then enqueue it for deletion
                            // because DELETE operation doesn't delete from a server the rows that are still new
                    },
                    error:   function() {
                            //alert("Добавить новые строки в БД на сервере не удалось, операция будет повторена позже");
                            obj.enqueueSaving();console.log('error post.....');
                            alert("Не удалось создать строки! Перезагрузите страницу");
                    }
                })
                .always( function() {
                    obj.options.processesCounter--;
                    obj.hideLoading();
                    obj.options.afterSave(obj.options.processesCounter);
                });

                rowsDataArray = [];   // To unbind this array and local rowData's
            }

       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       //   PUT: Changed rows saving
       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var changedRows = obj.dtable.table.find( '[' + this.options.rowIsChangedAttr + '="true"]' ).not( '[data-row^=' + this.options.newRowIdPrefix + ']' );

            if ( changedRows.length > 0 ) {
              // Change the rows status
                changedRows.attr( this.options.rowIsChangedAttr, 'on-saving' );
                this.dtable.logger.info("modifying...");

              // Data preparation:
                //    rowsIDs:   Array of rows IDs (it's used in the ajax handlers on the client side)
                //   rowsDataArray:   Array of rows data (ID + data from children's tds) for saving on the server
                var rowsIDs = [];
                changedRows.each( function() {
                    rowsIDs.push($(this).data('row'));
                });
                var rowsDataArray = [];
                this.extractRowsData( changedRows, rowsDataArray );


              // AJAX
                this.options.processesCounter++;

                $.ajax( {
                    url: this.options.url,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify( rowsDataArray ),

                    success:   function(changedRows) {
                            //alert("Строки обновлены в БД на сервере успешно");
                            var modifiedRow = null;
                            for (var i in changedRows) {
                                if("object" === typeof changedRows[i]){
                                    modifiedRow = obj.dtable.table.find( '[data-row=' + changedRows[i].oldID+']' );
                                    if (0 !== modifiedRow.length) {
                                        modifiedRow.attr('id', obj.options.row_id+changedRows[i].newID);
                                        modifiedRow.data('row', changedRows[i].newID);
                                        modifiedRow.attr('data-row', changedRows[i].newID);
                                    }
                                } else {
                                    modifiedRow = obj.dtable.table.find('[data-row='+changedRows[i]+']');
                                    if ( modifiedRow.attr( obj.options.rowIsChangedAttr ) === 'on-saving' ) {
                                        modifiedRow.removeAttr( obj.options.rowIsChangedAttr );
                                    }
                                }
                            }
                    },
                    error:   function() {
                            //alert("Обновить строки в БД на сервере не удалось, операция будет повторена позже");
                            var unmodifiedRow = null;
                            for (var i in rowsIDs) {
                                unmodifiedRow = obj.dtable.table.find('[data-row='+rowsIDs[i]+']');
                                if ( unmodifiedRow.attr( obj.options.rowIsChangedAttr ) === 'on-saving' ) {
                                    unmodifiedRow.attr( obj.options.rowIsChangedAttr, 'true' );
                                }
                            }

                            obj.enqueueSaving();console.log('error put.....');
                            alert("Не удалось обновить строки! Перезагрузите страницу");
                    }
                })
                .always( function() {
                    obj.options.processesCounter--;
                    obj.hideLoading();
                    obj.options.afterSave(obj.options.processesCounter);
                });

                rowsDataArray = [];   // To unbind this array and local rowData's
            }

            obj.hideLoading();
        },

        // Function to extract data for selected rows -- row ID and info about children's columns with a specified marker
        extractRowsData: function( $selectedRows, dataArray ) {
            var obj = this;
            var columns = this.dtable.definition.getColumns();

            $selectedRows.each( function() {
                var $row = $(this);

                var rowData = { id: '', tdArray: {}, type: '', parent: '' };
                var tdData = { id: '', text: '' };

                rowData.id = $row.data('row');
                rowData.type = $row.data('row-type');
                rowData.parent = $row.data('row-parent-id');

                var rowTDs = $row.children();
                for (var i=0, len=rowTDs.length; i < len; i++ ) {

                    tdData.id = rowTDs.eq(i).data('column');
                    tdData.text = rowTDs.eq(i).text();
                    if(typeof columns[tdData.id] !== "undefined" && typeof columns[tdData.id].formatter !== "undefined"){
                        var formatter = columns[tdData.id].formatter;
                        if('object' === typeof formatter && ('number' === formatter.widget || 'currency' === formatter.widget)){
                            tdData.text = numeral().unformat(tdData.text);
                        }
                    }

                    rowData.tdArray[tdData.id] = tdData.text;
                }

                dataArray.push( rowData );
            });
        },

        hideLoading: function() {
            if ( this.options.processesCounter === 0 ){
                this.dtable.table.find( this.options.image ).hide(10);
                this.dtable.table.find( this.options.add_top_level ).show(10);
            }
        },

        showLoading: function() {
            this.dtable.table.find( '[data-row^=' + this.options.newRowIdPrefix + '] '+this.options.image+', [' + this.options.rowIsChangedAttr + '="true"] '+this.options.image+', thead '+this.options.image ).show(10);
            this.dtable.table.find( this.options.add_top_level ).hide(10);
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER, "advanced", {
        init: function (options, dtable) {

            var defaults = {
                widget: "default",
                widget_options: {
                    beforeEdit: function($td){return true;},
                    afterEdit:  function($td){return true;}
                }
            };

            this.dtable = dtable;
            this.options = $.extend(true, {}, defaults, options);

            this.widgets = false;

            this.buildWidgetSchema();
        },
        buildWidgetSchema: function () {
            if (this.widgets === false) {

                this.widgets = {};

                var obj = this;
                var columns = this.dtable.definition.getColumns();

                $.each(columns, function (columnId, options) {

                    var editing_filter_opt = obj.options;

                    if (options.hasOwnProperty("editing_filter") && options.editing_filter) {
                        editing_filter_opt = $.extend(true, {widget_options: {column_id: columnId}}, obj.options, options.editing_filter);
                    }

                    obj.setWidget(columnId, editing_filter_opt);
                });
            }
        },
        setWidget: function (columnId, options) {
            this.widgets[columnId] = DTableModule.getModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, options.widget, options.widget_options, this.dtable);
        },
        getWidget: function (columnId) {
            if (this.widgets[columnId] === undefined) {
                throw "widget does not exist for " + columnId;
            }

            return this.widgets[columnId];
        },
        beforeEdit: function($td){
            var col_name = $td.data('column');
            var widget = this.getWidget(col_name);

            return widget.beforeEdit($td);
        },
        afterEdit: function($td) {
            var col_name = $td.data('column');
            var widget = this.getWidget(col_name);

            return widget.afterEdit($td);
        }

    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, "default", {
        getDefaults: function(){
            return {
                beforeEdit: function($td){return true;},
                afterEdit:  function($td){return true;}
            };
        },
        beforeEdit: function($td){
            return this.options.beforeEdit($td);
        },

        afterEdit: function( $td ) {
            return this.options.afterEdit($td);
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, "formatter_list", {
        init: function (options, dtable) {
            this._super(options, dtable);

            if (this.options.template === undefined || this.options.template === false) {
                throw "'formatter_list' widget requires template option";
            }

            this.templateName = "formatter_list_" + this.options.column_id;
            this.dtable.template.addTemplate(this.templateName, this.options.template);

            this.template = false;
        },
        getDefaults: function(){
            return {
                template: false
            };
        },
        beforeEdit: function($td){
            if (this.template === false)
                this.template = this.dtable.template.getTemplate(this.templateName);

            var col_name = $td.data('column');
            var columns = this.dtable.definition.getColumns();
            var formatter = columns[col_name].formatter;
            if('object' === typeof formatter && 'list' === formatter.widget){
                var list = formatter.widget_options.list;
                var def = $td.parent().find("[data-column="+columns[col_name].col.replace(/;/g, "")+"]").text();
                var n_list = {};
                for(var i in list){
                    n_list[i.substr(0, 60)] = list[i];

                }
                var select = this.template.render({
                    "list": n_list,
                    "default": def,
                    "col": col_name
                });
                $td.html(select);
//                $td.find('select').chosen({width: "100%"});
                return false;
            }
            return true;
        },

        afterEdit: function($td) {
            var val = $td.find('select option:selected').val();
            var name = $td.find('select option:selected').text();
            var col_name = $td.data('column');
            var columns = this.dtable.definition.getColumns();

            $td.parent().find("[data-column="+columns[col_name].col.replace(/;/g, "")+"]").html(val);
            $td.html(name);

            $(window).focus();

            return false;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, "autocomplit", {
        getDefaults: function(){
            return {
                tags: []
            };
        },
        beforeEdit: function($td){
            var col_name = $td.data('column');
            var val = $td.text();
            var autocomplite = '<input class="form-control edit-autocomplit" name="'+col_name+'" data-editing_cell="true"/>';
            $td.html(autocomplite);
            $td.find('input').val(val);
            $td.find('input').autocomplete({source: this.options.tags});

            return false;
        },

        afterEdit: function($td) {
            var val = $td.find('input').val();
            $td.html('');
            $td.text(val);

            $(window).focus();

            return false;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, "autocomplit_dependence", {
        getDefaults: function(){
            return {
                url: false,
                col: false
            };
        },
        beforeEdit: function($td){

            var col_name = $td.data('column');
            var val = $td.text();
            var autocomplite = '<input class="form-control edit-autocomplit" name="'+col_name+'" data-editing_cell="true"/>';
            $td.html(autocomplite);
            $td.find('input').val(val);
            if(this.options.url && this.options.col){
                var data = $td.parent().find("[data-column="+this.options.col+"]").text();
                $.post(
                    this.options.url,
                    {col: this.options.col, col_val: data},
                    function(a){
                        $td.find('input').autocomplete({source: a});
                    },
                    'json'
                );
            }


            return false;
        },

        afterEdit: function($td) {
            var val = $td.find('input').val();
            $td.html('');
            $td.text(val);

            $(window).focus();

            return false;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $) {

    DTableModule.newModule(DTableModule.MODULE_EDITING_FILTER_WIDGET, "formatter_list_ajax", {
        init: function (options, dtable) {
            this._super(options, dtable);

            if (this.options.template === undefined || this.options.template === false) {
                throw "'formatter_list' widget requires template option";
            }

            this.templateName = "formatter_list_" + this.options.column_id;
            this.dtable.template.addTemplate(this.templateName, this.options.template);

            this.template = false;
        },
        getDefaults: function(){
            return {
                template: false,
                url: false,
                only_empty: false,
                only_row_type: false,
                reverse_val: false,
                col_name: false
            };
        },
        beforeEdit: function($td){
            if(this.options.only_empty && ("" != $td.text()))
                return false;
            if(this.options.only_row_type && ($td.data('column') != $td.parent().data('row-type')))
                return false;

            if (this.template === false)
                this.template = this.dtable.template.getTemplate(this.templateName);

            var col_name = $td.data('column');
            var columns = this.dtable.definition.getColumns();

            if(this.options.url){
                var row_data = this.dtable.getRowData($td.parent());
                row_data.id = $td.parent().data('row');
                row_data.type = $td.parent().data('row-type');
                row_data.parent = $td.parent().data('row-parent-id');
                var list = [];

                $.ajax({
                    url:        this.options.url,
                    type:       'POST',
                    data:       row_data,
                    async:      false,
                    success:    function(a){
                        list = a;
                    }
                });
                var col = (this.options.col_name) ? col_name : columns[col_name].col;
                col = this.dtable.removeSpeshSimb(col);
                var def = $td.parent().find("[data-column="+col+"]").text();
                var select = this.template.render({
                    "list": list,
                    "default": def,
                    "col": col_name
                });
                $td.html(select);
//                $td.find('select').chosen({width: "100%"});
                return false;
            }
            return true;
        },

        afterEdit: function($td) {
            var val = $td.find('select option:selected').val();
            var name = $td.find('select option:selected').text();
            var col_name = $td.data('column');
            var columns = this.dtable.definition.getColumns();
            var col = (this.options.col_name) ? this.options.col_name : columns[col_name].col;
            col = this.dtable.removeSpeshSimb(col);
            if(this.options.reverse_val){
                $td.parent().find("[data-column="+col+"]").html(name);
                $td.html(val);
            } else {
                $td.parent().find("[data-column="+col+"]").html(val);
                $td.html(name);
            }

            $(window).focus();

            return false;
        }
    });

}(DTableModule, jQuery));
(function(DTableModule, $){

    DTableModule.newModule(DTableModule.MODULE_AGGREGATORS, "standart", {
        init: function(options, dtable){
            var defaults = {
                enable: false,
                cols: {
//                    cnt: '',
//                    sum: '',
//                    max: '',
//                    min: '',
//                    avg: '',
                },
                text: {
                    sum: '&Sigma;',
                    min: '&LowerRightArrow;',
                    avg: '&ap;',
                    max: '&UpperRightArrow;',
                    cnt: '&Nu;',
                }
            };

            this.dtable = dtable;
            this.options = $.extend({}, defaults, options);
            this.createEvents();
        },
        createEvents: function(dtable){
            var obj = this;

        },
        getAgg: function(){
            var r = {};
            for(var q in this.options.cols){
                r[q] = {text: this.options.text[q]}
            }
            return r;
        },
        getCols: function(){
            var r = {};
            var cols = this.options.cols;
            var colums = this.dtable.definition.getColumns();
            for(var q in cols){
                r[q] = (colums[cols[q]].col) ? colums[cols[q]].col : cols[q];
            }
            return r;
        },
        update: function(){
            var d = this.dtable.source.getAgg();
            var cols = this.options.cols;
            for(var q in cols){
                d[q] = this.dtable.formatter.format(cols[q], d[q], d, cols);
                this.dtable.table.find('[data-dtable="aggregators"] [data-agregator="'+q+'"] span').text(d[q]);
            }
        }
    });

}(DTableModule, jQuery));
