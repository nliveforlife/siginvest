siginvest.grid.Investors = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'siginvest-grid-investors';
    }
    Ext.applyIf(config, {
        url: siginvest.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
     //   tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/investors/getlist'
        },
        listeners: {
            rowDblClick: function (grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateItem(grid, e, row);
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
    siginvest.grid.Investors.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};

Ext.extend(siginvest.grid.Investors, MODx.grid.Grid, {
    windows: {},
    getFields: function (config) {
        return ['id', 'username', 'E-mail', 'active', 'actions'];
    },

    getColumns: function (config) {
        return [{
            header: _('siginvest_user_id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        }, {
            header: _('siginvest_username'),
            dataIndex: 'username',
            sortable: true,
            width: 200,
        }, {
            header: _('siginvest_user_email'),
            dataIndex: 'E-mail',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_user_active'),
            dataIndex: 'active',
            renderer: siginvest.utils.renderBoolean,
            sortable: true,
            width: 100,
        }, {
            header: _('siginvest_user_actions'),
            dataIndex: 'actions',
            renderer: siginvest.utils.renderActions,
            sortable: false,
            width: 100,
            id: 'actions'
        }];
    }
});
Ext.reg('siginvest-grid-investors', siginvest.grid.Investors);