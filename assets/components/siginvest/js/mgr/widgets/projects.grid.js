siginvest.grid.Projects = function(config) {
        config = config || {};
        this.sm = new Ext.grid.CheckboxSelectionModel();

        Ext.applyIf(config,{
            id: 'siginvest-grid-projects'
            ,url: siginvest.config.connector_url
            ,baseParams: {
                action: 'mgr/projects/getlist'
            }
            ,fields: ['id','project_id','name','status','parts_made','parts_sold','need_to_gather'
                ,'project_invrs_count','current_part_price','dev_profit_plan','dev_persent_to_inv',
                'dev_term','dev_buyback','dev_paid_count','dev_paid_vsego','published','actions']
            ,autoHeight: true
            ,paging: true
            ,remoteSort: true
            ,sm: this.sm
            ,columns: [
                {header: _('siginvest_id'), sortable: true, dataIndex: 'id',width: 10, hidden: true}
                ,{header: _('siginvest_project_id'), sortable: true, dataIndex: 'project_id',width: 50}
                ,{header: _('siginvest_project_name'), sortable: true, dataIndex: 'name',width: 50}
                ,{header: _('siginvest_project_status'), sortable: true, dataIndex: 'status',width: 30}
                ,{header: _('siginvest_project_parts_made'), sortable: true, dataIndex: 'parts_made',width: 40}
                ,{header: _('siginvest_project_parts_sold'), sortable: true, dataIndex: 'parts_sold',width: 40}
                ,{header: _('siginvest_project_need_to_gather'), sortable: true, dataIndex: 'need_to_gather',width: 40}
                ,{header: _('siginvest_project_invrs_count'), sortable: true, dataIndex: 'project_invrs_count',width: 30,hidden: true}
                ,{header: _('siginvest_project_current_part_price'), sortable: true, dataIndex: 'current_part_price',width: 30}
                ,{header: _('siginvest_project_dev_profit_plan'), sortable: true, dataIndex: 'dev_profit_plan',width: 30}
                ,{header: _('siginvest_project_dev_persent_to_inv'), sortable: true, dataIndex: 'dev_persent_to_inv',width: 30}
                ,{header: _('siginvest_project_dev_term'), sortable: true, dataIndex: 'dev_term',width: 30,hidden: true}
                ,{header: _('siginvest_project_dev_buyback'), sortable: true, dataIndex: 'dev_buyback',width: 30,hidden: true, renderer: this._renderBoolean}
                ,{header: _('siginvest_project_dev_paid_count'), sortable: true, dataIndex: 'dev_paid_count',width: 30,hidden: true}
                ,{header: _('siginvest_project_dev_paid_vsego'), sortable: true, dataIndex: 'dev_paid_vsego',width: 30,hidden: true}
                ,{header: _('siginvest_project_published'), sortable: true, dataIndex: 'published',width: 20, renderer: this._renderBoolean}
                ,{header: _('siginvest_project_actions'), dataIndex: 'actions',width: 40,renderer: siginvest.utils.renderActions, id: 'actions'}
            ]
            ,tbar: [{
                text: '<i class="' + (MODx.modx23 ? 'icon icon-plus' : 'fa fa-plus') + '"></i> ' + _('siginvest_project_btn_create')
                ,handler: this.createProject
                ,scope: this
            }]
            ,viewConfig: {
                forceFit: true
                ,enableRowBody: true
                ,autoFill: true
                ,showPreview: true
                ,scrollOffset: 0
                ,getRowClass : function(rec, ri, p) {
                    return !rec.data.published
                        ? 'siginvest-grid-row-disabled'
                        : '';
                }
            }
            ,listeners: {
                rowDblClick: function(grid, rowIndex, e) {
                    var row = grid.store.getAt(rowIndex);
                    this.updateProject(grid, e, row);
                }
            }
        });
        siginvest.grid.Projects.superclass.constructor.call(this,config);
    };


    Ext.extend(siginvest.grid.Projects,MODx.grid.Grid,{
        windows: {}

        ,getMenu: function(grid, rowIndex) {
            var row = grid.getStore().getAt(rowIndex);
            var menu = siginvest.utils.getMenu(row.data.actions, this);
         //   console.log('grid: ',grid);
         //   console.log(row.data.actions);
         //   console.log('Тут контекст:',this);
            this.addContextMenuItem(menu);
        }

        ,onClick: function(e) {
            var elem = e.getTarget();
            if (elem.nodeName == 'BUTTON') {
                var row = this.getSelectionModel().getSelected();
                if (typeof(row) != 'undefined') {
                    var type = elem.getAttribute('type');
                    if (type == 'menu') {
                        var ri = this.getStore().find('id', row.id);
                        return this._showMenu(this, ri, e);
                    }
                    else {
                        this.menu.record = row.data;
                        return this[type](this, e);

                    }
                }
            }
            return this.processEvent('click', e);
        }

        ,_renderBoolean: function(val,cell,row) {
            return val == '' || val == 0
                ? '<span style="color:red">' + _('no') + '<span>'
                : '<span style="color:green">' + _('yes') + '<span>';
        }

        ,_renderImage: function(val,cell,row) {
            if (!val) {return '';}
            else if (val.substr(0,1) != '/') {
                val = '/' + val;
            }

            return '<img src="' + val + '" alt="" height="50" />';
        }

        ,_renderTemplate: function(val,cell,row) {
            if (!val) {return '';}
            else if (row.data['templatename']) {
                val = '<sup>(' + val + ')</sup> ' + row.data['templatename'];
            }
            return val;
        }

        ,createProject: function(btn,e) {
            if (!this.windows.createProject) {
                this.windows.createProject = MODx.load({
                    xtype: 'siginvest-window-project-create'
                    ,listeners: {
                        'success': {fn:function() { this.refresh(); },scope:this}
                    }
                });
            }
            this.windows.createProject.fp.getForm().reset();
            this.windows.createProject.show(e.target);
        }

        ,updateProject: function(grid, e, row) {
            if (typeof(row) != 'undefined') {this.menu.record = row.data;}
            var id = this.menu.record.id;
            var parts_sold = this.menu.record.parts_sold;

            if (parts_sold !== 0) {
                console.log(parts_sold);
                MODx.Ajax.request(
                    {
                        url: siginvest.config.connector_url
                        ,params: {
                        action: 'mgr/projects/get'
                        ,id: id
                    }
                        ,listeners: {
                        success: {fn:function(r) {
                            if (this.windows.updateProjectLocked) {
                                this.windows.updateProjectLocked.close();
                                this.windows.updateProjectLocked.destroy();
                            }
                            this.windows.updateProjectLocked = MODx.load({

                                xtype: 'siginvest-window-project-updatelocked'
                                ,record: r
                                ,listeners: {
                                    success: {fn:function() { this.refresh(); },scope:this}
                                }
                            });
                            this.windows.updateProjectLocked.fp.getForm().reset();
                            this.windows.updateProjectLocked.fp.getForm().setValues(r.object);
                            this.windows.updateProjectLocked.show(e.target);
                        },scope:this}
                    }
                    });

            }
            else {
                MODx.Ajax.request(
                    {
                        url: siginvest.config.connector_url
                        ,params: {
                        action: 'mgr/projects/get'
                        ,id: id
                    }
                        ,listeners: {
                        success: {fn:function(r) {
                            if (this.windows.updateProject) {
                                this.windows.updateProject.close();
                                this.windows.updateProject.destroy();
                            }
                            this.windows.updateProject = MODx.load({

                                xtype: 'siginvest-window-project-update'
                                ,record: r
                                ,listeners: {
                                    success: {fn:function() { this.refresh(); },scope:this}
                                }
                            });
                            this.windows.updateProject.fp.getForm().reset();
                            this.windows.updateProject.fp.getForm().setValues(r.object);
                            this.windows.updateProject.show(e.target);
                        },scope:this}
                    }
                    });

            }
                /*
            MODx.Ajax.request(
                {
                url: siginvest.config.connector_url
                ,params: {
                    action: 'mgr/projects/get'
                    ,id: id
                }
                ,listeners: {
                    success: {fn:function(r) {
                        if (this.windows.updateProject) {
                            this.windows.updateProject.close();
                            this.windows.updateProject.destroy();
                        }
                        this.windows.updateProject = MODx.load({

                            xtype: 'siginvest-window-project-update'
                            ,record: r
                            ,listeners: {
                                success: {fn:function() { this.refresh(); },scope:this}
                            }
                        });
                        this.windows.updateProject.fp.getForm().reset();
                        this.windows.updateProject.fp.getForm().setValues(r.object);
                        this.windows.updateProject.show(e.target);
                    },scope:this}
                }
            });
            */
        }

        ,removeProject: function(grid, e) {
            var ids = this._getSelectedIds();
            if (!ids) {return;}
            siginvest.utils.onAjax(this.getEl());

            MODx.msg.confirm({
                title: _('siginvest_projects_remove')
                ,text: _('siginvest_projects_remove_confirm')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/projects/remove'
                    ,ids: ids.join(',')
                }
                ,listeners: {
                    success: {fn:function(r) { this.refresh(); },scope:this}
                }
            });
        }

        ,disableProject: function(grid, e) {
            var ids = this._getSelectedIds();
            if (!ids) {return;}
            siginvest.utils.onAjax(this.getEl());

            MODx.Ajax.request({
                url: this.config.url
                ,params: {
                    action: 'mgr/projects/disable'
                    ,ids: ids.join(',')
                }
                ,listeners: {
                    success: {fn:function(r) { this.refresh(); },scope:this}
                }
            });
        }

        ,enableProject: function(grid, e) {
            var ids = this._getSelectedIds();
            if (!ids) {return;}
            siginvest.utils.onAjax(this.getEl());

            MODx.Ajax.request({
                url: this.config.url
                ,params: {
                    action: 'mgr/projects/enable'
                    ,ids: ids.join(',')
                }
                ,listeners: {
                    success: {fn:function(r) { this.refresh(); },scope:this}
                }
            });
        }

        ,_getSelectedIds: function() {
            var ids = [];
            var selected = this.getSelectionModel().getSelections();

            for (var i in selected) {
                if (!selected.hasOwnProperty(i)) {continue;}
                ids.push(selected[i]['id']);
            }

            return ids;
        }
    });
    Ext.reg('siginvest-grid-projects',siginvest.grid.Projects);


    siginvest.window.CreateProject = function(config) {
        config = config || {};
        this.ident = config.ident || 'mecproject'+Ext.id();
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
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_persent_to_inv'),name: 'dev_persent_to_inv',allowBlank:false, id: 'siginvest-'+this.ident+'-dev_persent_to_inv',anchor: '100%',value: 50,maxValue: 100,minValue: 10}
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
                            ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_published'),          name: 'published',allowBlank:false, id: 'siginvest-'+this.ident+'-published',anchor: '50%'}
                        ]
                    }]
                }
                ,{xtype: 'radiogroup',fieldLabel: _('siginvest_project_status'),name: 'status',id: 'siginvest-'+this.ident+'-status',anchor: '100%',columns: 3,vertical: true
                    , items: [
                        {boxLabel: 'На проверке', name: 'rb', inputValue: 'atcheck', checked: true},
                        {boxLabel: 'Активен', name: 'rb', inputValue: 'active'},
                        {boxLabel: 'Закрыт', name: 'rb', inputValue: 'closed'}
                    ]
                }
            ]
            ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
        });
        siginvest.window.CreateProject.superclass.constructor.call(this,config);
    };
    Ext.extend(siginvest.window.CreateProject,MODx.Window);
    Ext.reg('siginvest-window-project-create',siginvest.window.CreateProject);


    siginvest.window.UpdateProject = function(config) {
        config = config || {};
        this.ident = config.ident || 'meuproject'+Ext.id();
        Ext.applyIf(config,{
            title: _('siginvest_project_update')
            ,id: this.ident
            ,autoHeight: true
            ,width: 650
            ,url: siginvest.config.connector_url
            ,action: 'mgr/projects/update'
            ,fields:
                [
                    {xtype: 'textfield',fieldLabel: _('siginvest_project_name'),name: 'name',allowBlank:false, id: 'siginvest-'+this.ident+'-name',anchor: '100%'}
                    ,{xtype: 'numberfield',fieldLabel: _('siginvest_id'),name: 'id',allowBlank:false, id: 'siginvest-'+this.ident+'-id',anchor: '100%', hidden: true}
                    ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_id'),name: 'project_id',allowBlank:false, id: 'siginvest-'+this.ident+'-project_id',anchor: '100%'}
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
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_persent_to_inv'),name: 'dev_persent_to_inv',allowBlank:false, id: 'siginvest-'+this.ident+'-dev_persent_to_inv',anchor: '100%',value: 50,maxValue: 100,minValue: 10}
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
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_need_to_gather'),    name: 'need_to_gather',allowBlank:false,    id: 'siginvest-'+this.ident+'-need_to_gather',anchor: '100%',    value: 1000,
                                maxValue: 10000000,
                                minValue: 100}
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_current_part_price'),name: 'current_part_price',allowBlank:false,id: 'siginvest-'+this.ident+'-current_part_price',anchor: '100%', value: 10,
                                maxValue: 10000,
                                minValue: 10, step: 10
                            }
                            ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_published'),          name: 'published',hiddenName: 'published',allowBlank:false, id: 'siginvest-'+this.ident+'-published',anchor: '50%'}
                        ]
                    }]
                }
                    ,{xtype: 'radiogroup',fieldLabel: _('siginvest_project_status'),name: 'status',id: 'siginvest-'+this.ident+'-status',anchor: '100%',columns: 3,vertical: true
                    , items: [
                        {boxLabel: 'На проверке', name: 'status', inputValue: 'atcheck', checked: true},
                        {boxLabel: 'Активен', name: 'status', inputValue: 'active'},
                        {boxLabel: 'Закрыт', name: 'status', inputValue: 'closed'}
                    ]
                }

                ]

            ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
        });
        siginvest.window.UpdateProject.superclass.constructor.call(this,config);
    };
    Ext.extend(siginvest.window.UpdateProject,MODx.Window);
    Ext.reg('siginvest-window-project-update',siginvest.window.UpdateProject);


    siginvest.window.UpdateProjectLocked = function(config) {
        config = config || {};
        this.ident = config.ident || 'meuproject'+Ext.id();
        Ext.applyIf(config,{
            title: _('siginvest_project_updatelocked')
            ,id: this.ident
            ,autoHeight: true
            ,width: 650
            ,url: siginvest.config.connector_url
            ,action: 'mgr/projects/update'
            ,fields:
                [
                    {xtype: 'textfield',fieldLabel: _('siginvest_project_name'),name: 'name',disabled: true,readOnly: true,    allowBlank:false, id: 'siginvest-'+this.ident+'-name',anchor: '100%'}
                    ,{xtype: 'numberfield',fieldLabel: _('siginvest_id'),name: 'id',disabled: true,readOnly: true,   allowBlank:false, id: 'siginvest-'+this.ident+'-id',anchor: '100%'}
                    ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_id'),name: 'project_id',disabled: true,readOnly: true,   allowBlank:false, id: 'siginvest-'+this.ident+'-project_id',anchor: '100%',hidden: true}
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
                            {xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_profit_plan'),    name: 'dev_profit_plan',disabled: true,readOnly: true,   allowBlank:false,    id: 'siginvest-'+this.ident+'-dev_profit_plan',anchor: '100%', value: 1000,
                                maxValue: 10000000,
                                minValue: 100}
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_persent_to_inv'),name: 'dev_persent_to_inv',disabled: true,readOnly: true,   allowBlank:false, id: 'siginvest-'+this.ident+'-dev_persent_to_inv',anchor: '100%',value: 50,maxValue: 100,minValue: 10}
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_dev_term'),          name: 'dev_term',disabled: true,readOnly: true,   allowBlank:false,           id: 'siginvest-'+this.ident+'-dev_term',anchor: '100%',value: 3,maxValue: 12,minValue: 1}
                            ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_dev_buyback'),       name: 'dev_buyback',disabled: true,readOnly: true,    hiddenName: 'dev_buyback', allowBlank:false,       id: 'siginvest-'+this.ident+'-dev_buyback',anchor: '50%'}
                        ]
                    },{
                        columnWidth: .5
                        ,layout: 'form'
                        ,defaults: { msgTarget: 'under' }
                        ,border:false
                        ,style: {margin: 0}
                        ,items: [
                            {xtype: 'numberfield',fieldLabel: _('siginvest_project_parts_made'),         name: 'parts_made',allowBlank:false,disabled: true,readOnly: true,         id: 'siginvest-'+this.ident+'-parts_made',anchor: '100%',  value: 1000,
                                maxValue: 1000000,
                                minValue: 100}
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_need_to_gather'),    name: 'need_to_gather',allowBlank:false,disabled: true,readOnly: true,     id: 'siginvest-'+this.ident+'-need_to_gather',anchor: '100%',    value: 1000,
                                maxValue: 10000000,
                                minValue: 100}
                            ,{xtype: 'numberfield',fieldLabel: _('siginvest_project_current_part_price'),name: 'current_part_price',allowBlank:false,disabled: true,readOnly: true,   id: 'siginvest-'+this.ident+'-current_part_price',anchor: '100%', value: 10,
                                maxValue: 10000,
                                minValue: 10, step: 10
                            }
                            ,{xtype: 'combo-boolean',fieldLabel: _('siginvest_project_published'),          name: 'published',hiddenName: 'published',allowBlank:false, id: 'siginvest-'+this.ident+'-published',anchor: '50%'}
                        ]
                    }]
                }
                    ,{xtype: 'radiogroup',fieldLabel: _('siginvest_project_status'),name: 'status',id: 'siginvest-'+this.ident+'-status',anchor: '100%',columns: 3,vertical: true
                    , items: [
                        {boxLabel: 'На проверке', name: 'status', inputValue: 'atcheck', checked: true},
                        {boxLabel: 'Активен', name: 'status', inputValue: 'active'},
                        {boxLabel: 'Закрыт', name: 'status', inputValue: 'closed'}
                    ]
                }

                ]

            ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
        });
        siginvest.window.UpdateProjectLocked.superclass.constructor.call(this,config);
    };
    Ext.extend(siginvest.window.UpdateProjectLocked,MODx.Window);
    Ext.reg('siginvest-window-project-updatelocked',siginvest.window.UpdateProjectLocked);
















