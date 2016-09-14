siginvest.grid.Dividends = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'siginvest-grid-dividends';
    }
    Ext.applyIf(config, {
        url: siginvest.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        //     tbar: this.getTopBar(config),
        tbar: [{
            text: _('siginvest_dividend_btn_create')
            ,handler: this.createDividend
            ,scope: this
        }],
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/dividends/getlist'
        },
        listeners: {
            rowDblClick: function (grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateProject(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            autoFill: true,
            showPreview: true,
            scrollOffset: 0,
            getRowClass: function (rec, ri, p) {
                return !rec.data.active
                    ? 'siginvest-grid-row-disabled'
                    : '';
            }
        },
        paging: true,
        remoteSort: true,
        autoHeight: true,
    });
    siginvest.grid.Dividends.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(siginvest.grid.Dividends, MODx.grid.Grid, {
    windows: {},

    _renderActions :function(value, props, row) {
    var res = [];
    for (var i in row.data.actions) {
        if (!row.data.actions.hasOwnProperty(i)) {continue;}
        var a = row.data.actions[i];
        if (a['button']) {
            var cls = typeof(a['class']) == 'object' && a['class']['button']
                ? a['class']['button']
                : '';
            cls += ' ' + (MODx.modx23 ? 'icon icon-' : 'fa fa-') + a['icon'];

            res.push(
                '<li>\
                    <button class="btn btn-default '+ cls +'" type="'+a['type']+'" title="'+_('siginvest_project_'+a['type'])+'"></button>\
				</li>'
            );
        }
    }

    return '<ul class="siginvest-row-actions">' + res.join('') + '</ul>';
},


    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = siginvest.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuProject(menu);
    },

    createDividend: function (btn, e) {
        if (!this.windows.createDividend) {
            this.windows.createDividend = MODx.load({
                xtype: 'siginvest-window-dividend-create'
                ,listeners: {
                    'success': {fn:function() { this.refresh(); },scope:this}
                }
            });
        }
        this.windows.createDividend.fp.getForm().reset();
        this.windows.createDividend.show(e.target);


    /*    var w = MODx.load({
            xtype: 'siginvest-window-dividend-create',
            id: Ext.id(),
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        w.reset();
        w.setValues({active: true});
        w.show(e.target);
        */

    },

    updateDividend: function (btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/dividends/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'siginvest-window-dividend-update',
                            id: Ext.id(),
                            record: r,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                }
                            }
                        });
                        w.reset();
                        w.setValues(r.object);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },

    removeProject: function (act, btn, e) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.msg.confirm({
            title: ids.length > 1
                ? _('siginvest_dividends_remove')
                : _('siginvest_dividend_remove'),
            text: ids.length > 1
                ? _('siginvest_dividends_remove_confirm')
                : _('siginvest_dividend_remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/dividends/remove',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function (r) {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        return true;
    },

    disableProject: function (act, btn, e) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/dividends/disable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    enableProject: function (act, btn, e) {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/dividends/enable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    getFields: function (config) {
        return ['id','project_id', 'name', 'dev_paid', 'dev_paid_per_part','dev_paid_number','dev_paid_date','partner_owner_id', 'actions'];
    },

    getColumns: function (config) {
        return [{
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            width: 20
        }, {
            header: _('siginvest_dividend_project_id'),
            dataIndex: 'project_id',
            sortable: true,
            width: 80,
        }, {
            header: _('siginvest_dividend_name'),
            dataIndex: 'name',
            sortable: false,
            width: 100,
        }, {
            header: _('siginvest_dividend_dev_paid'),
            dataIndex: 'dev_paid',
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_dividend_dev_paid_per_part'),
            dataIndex: 'dev_paid_per_part',
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_dividend_dev_paid_number'),
            dataIndex: 'dev_paid_number',
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_dividend_dev_paid_date'),
            dataIndex: 'dev_paid_date',
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_dividend_partner_owner_id'),
            dataIndex: 'partner_owner_id',
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_grid_actions'),
            dataIndex: 'actions',
         //   renderer:  this._renderActions,
            renderer:  siginvest.utils.renderActions,
            sortable: false,
            width: 100,
            id: 'actions'

        }];
    },

    getTopBar: function (config) {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('siginvest_dividend_create'),
            handler: this.createProject,
            scope: this
        }, '->', {
            xtype: 'textfield',
            name: 'query',
            width: 200,
            id: config.id + '-search-field',
            emptyText: _('siginvest_grid_search'),
            listeners: {
                render: {
                    fn: function (tf) {
                        tf.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
                            this._doSearch(tf);
                        }, this);
                    }, scope: this
                }
            }
        }, {
            xtype: 'button',
            id: config.id + '-search-clear',
            text: '<i class="icon icon-times"></i>',
            listeners: {
                click: {fn: this._clearSearch, scope: this}
            }
        }];
    },

    onClick: function (e) {
        var elem = e.getTarget();
        if (elem.nodeName == 'BUTTON') {
            var row = this.getSelectionModel().getSelected();
            if (typeof(row) != 'undefined') {
                var action = elem.getAttribute('action');
                if (action == 'showMenu') {
                    var ri = this.getStore().find('id', row.id);
                    return this._showMenu(this, ri, e);
                }
                else if (typeof this[action] === 'function') {
                    this.menu.record = row.data;
                    return this[action](this, e);
                }
            }
        }
        return this.processEvent('click', e);
    },

    _getSelectedIds: function () {
        var ids = [];
        var selected = this.getSelectionModel().getSelections();

        for (var i in selected) {
            if (!selected.hasOwnProperty(i)) {
                continue;
            }
            ids.push(selected[i]['id']);
        }

        return ids;
    },

    _doSearch: function (tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },

    _clearSearch: function (btn, e) {
        this.getStore().baseParams.query = '';
        Ext.getCmp(this.config.id + '-search-field').setValue('');
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
});
Ext.reg('siginvest-grid-dividends', siginvest.grid.Dividends);



siginvest.window.CreateDividend = function(config) {
    config = config || {};
    this.ident = config.ident || 'mecdividend'+Ext.id();
    Ext.applyIf(config,{
        title: _('siginvest_project_create')
        ,id: this.ident
        ,autoHeight: true
        ,width: 650
        ,url: siginvest.config.connector_url
        ,action: 'mgr/projects/create'
        ,fields:
            [
                {xtype: 'textfield',fieldLabel: _('siginvest_project_name'),name: 'name',allowBlank:false, id: 'siginvest-'+this.ident+'-name',anchor: '100%'}
                ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_id'),name: 'project_id',allowBlank:false, id: 'siginvest-'+this.ident+'-project_id',anchor: '100%'}
                ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_partner_id'),name: 'partner_id',allowBlank:false, id: 'siginvest-'+this.ident+'-project_partner_id',anchor: '100%'}
                ,{
                layout:'column'
                ,border: false
                ,anchor: '100%'
                ,items: [{
                    columnWidth: .5
                    ,layout: 'form'
                    ,defaults: { msgTarget: 'under' }
                    ,border:false
                    ,style: {margin: '0 10px 0 0'}
                    ,items: [
                        {xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_profit_plan'),    name: 'dev_profit_plan',allowBlank:false,    id: 'siginvest-'+this.ident+'-dev_profit_plan',anchor: '100%', value: 1000,
                            maxValue: 10000000,
                            minValue: 100}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_persent_to_inv'),name: 'dev_persent_to_inv',allowBlank:false, id: 'siginvest-'+this.ident+'-dev_persent_to_inv',anchor: '100%',value: 50,maxValue: 100,minValue: 1}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_term'),          name: 'dev_term',allowBlank:false,           id: 'siginvest-'+this.ident+'-dev_term',anchor: '100%',value: 3,maxValue: 12,minValue: 1}
                        ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_dev_buyback'),       name: 'dev_buyback',allowBlank:false,      id: 'siginvest-'+this.ident+'-dev_buyback',anchor: '50%'}
                    ]
                },{
                    columnWidth: .5
                    ,layout: 'form'
                    ,defaults: { msgTarget: 'under' }
                    ,border:false
                    ,style: {margin: 0}
                    ,items: [
                        {xtype: 'numberfield',fieldLabel: _('siginvest_project_parts_made'),         name: 'parts_made',allowBlank:false,        id: 'siginvest-'+this.ident+'-parts_made',anchor: '100%',  value: 1000,
                            maxValue: 1000000,
                            minValue: 100}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_need_to_gather'),    name: 'need_to_gather',allowBlank:false,    id: 'siginvest-'+this.ident+'-need_to_gather',anchor: '100%',    value: 1000,
                            maxValue: 10000000,
                            minValue: 100}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_current_part_price'),name: 'current_part_price',allowBlank:false,id: 'siginvest-'+this.ident+'-current_part_price',anchor: '100%', value: 10,
                            maxValue: 10000,
                            minValue: 10, step: 10
                        }
                        ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_published'),          name: 'published',allowBlank:true, id: 'siginvest-'+this.ident+'-published',anchor: '50%', hidden: true}
                    ]
                }]
            }
                ,{xtype: 'radiogroup',fieldLabel: _('siginvest_project_status'),name: 'status',id: 'siginvest-'+this.ident+'-status',anchor: '100%',columns: 1,vertical: false
                , hidden: true
                , items: [
                    {boxLabel: 'Без статуса', name: 'rb', inputValue: 'nope', checked: true}
                ]
            }
            ]
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    siginvest.window.CreateDividend.superclass.constructor.call(this,config);
};
Ext.extend(siginvest.window.CreateDividend,MODx.Window);
Ext.reg('siginvest-window-dividend-create',siginvest.window.CreateDividend);

siginvest.window.UpdateDividend = function(config) {
    config = config || {};
    this.ident = config.ident || 'meuproject'+Ext.id();
    Ext.applyIf(config,{
        title: _('siginvest_project_update')
        ,id: this.ident
        ,autoHeight: true
        ,width: 650
        ,url: siginvest.config.connector_url
        ,action: 'mgr/dividends/update'
        ,fields:
            [
                {xtype: 'textfield',fieldLabel: _('siginvest_project_name'),name: 'name',allowBlank:false, id: 'siginvest-'+this.ident+'-name',anchor: '100%'}
                ,{xtype: 'numberfield',fieldLabel: _('siginvest_id'),name: 'id',allowBlank:false, id: 'siginvest-'+this.ident+'-id',anchor: '100%', hidden: true}
                ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_id'),name: 'project_id',allowBlank:false, id: 'siginvest-'+this.ident+'-project_id',anchor: '100%'}
                ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_partner_id'),name: 'partner_id',disabled: true,readOnly: true,allowBlank:false, id: 'siginvest-'+this.ident+'-project_partner_id',anchor: '100%'}
                ,{
                layout:'column'
                ,border: false
                ,anchor: '100%'
                ,items: [{
                    columnWidth: .5
                    ,layout: 'form'
                    ,defaults: { msgTarget: 'under' }
                    ,border:false
                    ,style: {margin: '0 10px 0 0'}
                    ,items: [
                        {xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_profit_plan'),    name: 'dev_profit_plan',allowBlank:false,    id: 'siginvest-'+this.ident+'-dev_profit_plan',anchor: '100%', value: 1000,
                            maxValue: 10000000,
                            minValue: 100}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_persent_to_inv'),name: 'dev_persent_to_inv',allowBlank:false, id: 'siginvest-'+this.ident+'-dev_persent_to_inv',anchor: '100%',value: 50,maxValue: 100,minValue: 1}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_term'),          name: 'dev_term',allowBlank:false,           id: 'siginvest-'+this.ident+'-dev_term',anchor: '100%',value: 3,maxValue: 12,minValue: 1}
                        ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_dev_buyback'),       name: 'dev_buyback',hiddenName: 'dev_buyback', allowBlank:false,       id: 'siginvest-'+this.ident+'-dev_buyback',anchor: '50%'}
                    ]
                },{
                    columnWidth: .5
                    ,layout: 'form'
                    ,defaults: { msgTarget: 'under' }
                    ,border:false
                    ,style: {margin: 0}
                    ,items: [
                        {xtype: 'numberfield',fieldLabel: _('siginvest_project_parts_made'),         name: 'parts_made',allowBlank:false,        id: 'siginvest-'+this.ident+'-parts_made',anchor: '100%',  value: 1000,
                            maxValue: 1000000,
                            minValue: 100}
                        //hidden field
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_parts_left'),         name: 'parts_left',allowBlank:true,        id: 'siginvest-'+this.ident+'-parts_left',anchor: '100%',  value: 0, hidden: true}
                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_need_to_gather'), name: 'need_to_gather',allowBlank:false,id: 'siginvest-'+this.ident+'-need_to_gather'  ,anchor: '100%',maxValue: 10000000,minValue: 100    }



                        ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_current_part_price'),name: 'current_part_price',allowBlank:false,id: 'siginvest-'+this.ident+'-current_part_price',anchor: '100%', value: 10,
                            maxValue: 10000,
                            minValue: 10, step: 10
                        }
                        ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_published'),          name: 'published',hiddenName: 'published',allowBlank:false, id: 'siginvest-'+this.ident+'-published',anchor: '50%'}

                    ]
                }]
            }
                ,{xtype: 'radiogroup',fieldLabel: _('siginvest_project_status'),name: 'status',id: 'siginvest-'+this.ident+'-status',anchor: '100%',columns: 4,vertical: true
                , items: [
                    {boxLabel: 'На проверке', name: 'status', inputValue: 'atcheck', checked: true},
                    {boxLabel: 'Активен', name: 'status', inputValue: 'active'},
                    {boxLabel: 'Закрыт', name: 'status', inputValue: 'closed'},
                    {boxLabel: 'Нет', name: 'status', inputValue: 'nope'}
                ]
            }

            ]

        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    siginvest.window.UpdateDividend.superclass.constructor.call(this,config);
};
Ext.extend(siginvest.window.UpdateDividend,MODx.Window);
Ext.reg('siginvest-window-dividend-update',siginvest.window.UpdateDividend);
