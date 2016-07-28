# EditedDtable
Extended Data Table with edit, save and other actions (Grid jQuery plugin). Based on http://dtable.devdrive.org/
Original Readme in EDTable folder

#Example of usege:

&lt;script$gt;
    $().ready(function () {

        $("#__DIV_ID_OR_CALSS__").dtable({
            template: {
                options: {
                    view_dir: '/DTable/views',
                    table_template: 'table.html',
                    rows_template: 'rows.html',
                    pagination_template: 'pagination.html'
                }
            },
            definition: {
                options: {
                    url: "__YOUR_URL_FOR_DEFINITIONS_OF_COLS__",
                    method: "post",
                    data: {def: "1" or YOR OTHER DATA},
                    timestamp: true,
                    search: false
                }
            },
            pagination: {
                name: "default",
                options: {
                    pages: 3,
                    rows_per_page: 20,
                    rows_per_page_select: [10, 13, 15, 20, 50, 100, 1000]
                }
            },
            order: {
                options: {
                    'name': "asc" //OR OTHER NAME OF COLS
                }
            },
            source: {
                options: {
                    url: "__YOUR_URL_FOR_DATA__",
                    method: "post",
//                    onLoad: function(){__some staff__}
                }
            },
//            logger: {
//                options: {
//                    debug: true
//                }
//            },
            formatter: {
                name: "advanced",
                // this is the default config, we can override it in definition config
                options: {
                    widget: 'string',
                    widget_options: {
                        escape: true
                    }
                }
            },
            editing: {
                options: {
                    edit: true,
                    def_element: {
                        open: '<input class="form-control edit-autocomplit" type="text" data-editing_cell="true" value="',
                        close: '" />'
                    },
                    def_getVal: function(t){ return t.find('input').val();}
                }
            },
            saving: {
                options: {
                    save: true,
                    interval: 1000,
                    url: '__URL_FOR_SEND_DATA__',
                    rowLoader: false,
                    onAdd: addRow,
                }
            },
            editing_filter: {
                name: "advanced"
            }
        });
    });.
&lt;/script$gt;

DEFINITIONS: http://prntscr.com/byqvey
$del_loader = '<div class="add_top_level" data-dtable="add-new-row"><i class="glyphicon glyphicon-plus"></i></div><div class="del_loader saving-in-progress"><i class="fa fa-spinner fa-pulse fa-2x"></i></div>';
        return [
            "columns" => [
                "id"          => [                    "title" => "__COL_NAME__",       "width" => '6%',                      "filter" => true, "order" => true],
                "name"        => [                    "title" => "__COL_NAME__", "width" => '13%', "editable" => true, "filter" => true, "order" => true],
                "occupation"  => [                    "title" => "__COL_NAME__",  "width" => '12%', "editable" => true, "filter" => true, "order" => true],
                "place"       => [                    "title" => "__COL_NAME__",    "width" => '13%', "editable" => true, "filter" => true, "order" => true],
                "regeon"      => ["col"=>"regeon_id", "title" => "__COL_NAME__",  "width" => '10%',  "editable" => true, "filter" => ['placeholder' => 'без фильтра', 'type' => 'list'], "order" => true,"formatter" => ["widget" => 'list', "widget_options" => ["list" => [list of data]]],               "editing_filter" => ["widget" => 'formatter_list', "widget_options" => ["template" => "select.html"]]],
                "regeon_id"   => ["hide" => true],
                "tel_num"     => [                    "title" => "__COL_NAME__.",   "width" => '10%', "editable" => true, "filter" => true, "order" => true],
                "sec_tel_num" => [                    "title" => "__COL_NAME__.",   "width" => '10%',  "editable" => true, "filter" => true, "order" => true],
                "www"         => [                    "title" => "__COL_NAME__",     "width" => '10%', "editable" => true, "filter" => true, "order" => true],
                "skype"       => [                    "title" => "__COL_NAME__",    "width" => '10%',  "editable" => true, "filter" => true, "order" => true],
                'action'      => ["col"=>"active",    "title" => $del_loader,"width" => '5%',  "editable" => true,"formatter" => ["widget" => 'list', "widget_options" => ["list" => ["On" => "On.", "Off" => "Off."]]], "editing_filter" => ["widget" => 'formatter_list', "widget_options" => ["template" => "select.html"]]],
                'active'      => ["hide" => true],
            ],
        ];
example of sourse: http://prntscr.com/byqvkf
{ 
 "agg":{"cnt":1221},
 "rows":[
    {
    "id":905,
    "name":"1000",
    "occupation":"fooooo",
    "place":"barrrr",
    "regeon_id":24,
    "tel_num":"380",
    "sec_tel_num":"380",
    "www":"",
    "skype":"",
    "active":"On",
    "created_at":"2016-01-28 15:37:22",
    "updated_at":"2016-01-28 15:38:34",
    "regeon":24,
    "action":"On",
    "tooltip":1
    },
    {
    "id":211,    
    "name":"33",
    ....
    },
....
]}

save action have 3 actions: POST - create, PUT - UPDATE, DELETE - delete (sended only id)
save update example data:
http://prntscr.com/byr25w
http://prntscr.com/byr3wd

Another example
&lt;script$gt;
$().ready(function () {
        $("#order_table").dtable({
            template: {
                options: {
                    view_dir: '/DTable/views',
                    table_template: 'table.html',
                    rows_template: 'rows.html',
                    pagination_template: 'pagination.html'
                }
            },
            definition: {
                options: {
                    url: "__YOUR_URL_FOR_DEFINITIONS_OF_COLS__",
                    method: "post",
                    data: {def: isEditHeader or something else},
                    timestamp: true,
                    search: false
                }
            },
            pagination: {
                name: "default",
                options: {
                    pages: 5,
                    rows_per_page: 1000,
                    rows_per_page_select: [10, 20, 50, 100, 1000]
                }
            },
            order: {
                options: {
                    id: "asc" // cols name
                }
            },
            source: {
                options: {
                    url: "__YOUR_URL_FOR_DATA__",
                    method: "post",
                    onLoad: function(){some works...}
                }
            },
//            logger: {
//                options: {
//                    debug: true
//                }
//            },
            formatter: {
                name: "advanced",
                // this is the default config, we can override it in definition config
                options: {
                    widget: 'string',
                    widget_options: {
                        escape: true
                    }
                }
            },
            editing: {
                options: {
                    edit: true,
                    def_element: {
                        open: '<input class="form-control edit-autocomplit" type="text" data-editing_cell="true" value="',
                        close: '" />'
                    },
                    def_getVal: function(t){ return t.find('input').val();},
                    beforeMakeEditable: function(td){some works...},
                    beforeCancelEditable: function(td){some works...},
                    afterCancelEditable: function(td){some works...}
                }
            },
            saving: {
                options: {
                    save: true,
                    url: '__URL_FOR_SEND_DATA__',
                    interval: 10,
                    onEmptyAddRow: false,
                }
            },
            editing_filter: {
                name: "advanced"
            }
        });
&lt;/script$gt;

Difinitions:
"columns" => [
    "order_id"      => ["hide" => true,                          "title" => "",     "width" => '0'],
    "item"          => [                                         "title" => "",     "width" => '3%',                                                                                   "formatter" => ["widget" => 'ajaxsubrow', "widget_options" => ["url" => "_SOME_URL_", "col" => "order_id", 'open' => '<i class="glyphicon glyphicon-minus tree_icon"></i>', 'close' => '<i class="glyphicon glyphicon-plus tree_icon"></i>']]],
    "code"          => ["col"=>":t.code", "ranking" => "row_num","title" => "LABEL","width" => '9%',                                                                 "order" => true,],
    "name"          => ["col"=>":m.name",                        "title" => "LABEL","width" => '26%', "filter" => true,                                               "order" => true,],
    "dept"          => ["col"=>"m.department_id;",               "title" => "LABEL","width" => '16%', "filter" => ['placeholder' => '__TEXT__', 'type' => 'list'], "order" => true, "formatter" => ["widget" => 'list', "widget_options" => ["list" => [list of data]]],               "editing_filter" => ["widget" => 'formatter_list', "widget_options" => ["template" => "select.html for example"]]],
    "department_id" => ["hide" => true,                                             "width" => '0'],
    "quantity"      => [                                         "title" => "LABEL","width" => '12%',                                                                                  "formatter" => ["widget" => 'number', "widget_options" => ["number_format" => "0,0[.][000]", 'language' => 'ru']]],
    "qt_orig"       => ["hide" => true,                                             "width" => '0'],
    "unit"          => ["col"=>"unit_id;",                       "title" => "LABEL","width" => '7%',                                                                                   "formatter" => ["widget" => 'list', "widget_options" => ["list" => [list of data]]],                     "editing_filter" => ["widget" => 'formatter_list_ajax', "widget_options" => ["template" => "select_without_zerro.html for example", "url" => "__SOME_URL__"]]],
    "unit_id"       => ["hide" => true,                                             "width" => '0'],
    "price"         => [                                         "title" => "LABEL","width" => '13%',                                                                                  "formatter" => ["widget" => 'number', "widget_options" => ["number_format" => "0,0.00", 'language' => 'ru']]],
    "m_unit_id"     => ["hide" => true,                                             "width" => '0',                                                                                    "formatter" => ["widget" => 'number', "widget_options" => ["number_format" => "0,0.00", 'language' => 'ru']]],
    "sum"           => [                                         "title" => "LABEL","width" => '14%',                                                                                  "formatter" => ["widget" => 'number', "widget_options" => ["number_format" => "0,0.00", 'language' => 'ru']]],
    "all_sum"       => ["hide" => true,                                             "width" => '0'],
    "koef"          => ["hide" => true,                                             "width" => '0'],
    "id"            => ["hide" => true,                                             "width" => '0'],
    "m_id"          => ["hide" => true,                                             "width" => '0'],
    "s_id"          => ["hide" => true,                                             "width" => '0'], 
]

example of data:
http://prntscr.com/byr50c
