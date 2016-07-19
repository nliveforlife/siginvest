siginvest.grid.Projects = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'siginvest-grid-projects';
    }
    Ext.applyIf(config, {
        url: siginvest.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
   //     tbar: this.getTopBar(config),
        tbar: [{
            text: _('siginvest_project_btn_create')
            ,handler: this.createProject
            ,scope: this
        }],
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/projects/getlist'
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
    siginvest.grid.Projects.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(siginvest.grid.Projects, MODx.grid.Grid, {
    windows: {},

    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = siginvest.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuProject(menu);
    },

    createProject: function (btn, e) {
        var w = MODx.load({
            xtype: 'siginvest-project-window-create',
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
    },

    updateProject: function (btn, e, row) {
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
                action: 'mgr/projects/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'siginvest-project-window-update',
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
                ? _('siginvest_projects_remove')
                : _('siginvest_project_remove'),
            text: ids.length > 1
                ? _('siginvest_projects_remove_confirm')
                : _('siginvest_project_remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/projects/remove',
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
                action: 'mgr/projects/disable',
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
                action: 'mgr/projects/enable',
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
        return ['id', 'name', 'description', 'active', 'actions'];
    },

    getColumns: function (config) {
        return [{
            header: _('siginvest_project_id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        }, {
            header: _('siginvest_project_name'),
            dataIndex: 'name',
            sortable: true,
            width: 200,
        }, {
            header: _('siginvest_project_description'),
            dataIndex: 'description',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_project_active'),
            dataIndex: 'active',
            renderer: siginvest.utils.renderBoolean,
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_grid_actions'),
            dataIndex: 'actions',
            renderer: siginvest.utils.renderActions,
            sortable: false,
            width: 100,
            id: 'actions'
        }];
    },

    getTopBar: function (config) {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('siginvest_project_create'),
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
Ext.reg('siginvest-grid-projects', siginvest.grid.Projects);