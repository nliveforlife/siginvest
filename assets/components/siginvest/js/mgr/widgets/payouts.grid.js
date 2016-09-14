siginvest.grid.Payouts = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'siginvest-grid-payouts';
    }
    Ext.applyIf(config, {
        url: siginvest.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
     //   tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/payouts/getlist'
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
    siginvest.grid.Payouts.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    /*
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
    */

};

Ext.extend(siginvest.grid.Payouts, MODx.grid.Grid, {
    windows: {},
    getFields: function (config) {
        return ['id', 'user_id', 'pay_amount', 'sig_commission_value','created_time','paid_time','status', 'actions'];
    },

    getColumns: function (config) {
        return [{
            header: _('id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        }, {
            header: _('siginvest_payout_user_id'),
            dataIndex: 'user_id',
            sortable: true,
            width: 200,
        }, {
            header: _('siginvest_payout_pay_amount'),
            dataIndex: 'pay_amount',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_payout_sig_commission_value'),
            dataIndex: 'sig_commission_value',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_payout_created_time'),
            dataIndex: 'created_time',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_payout_paid_time'),
            dataIndex: 'paid_time',
            sortable: false,
            width: 250,
        }, {
            header: _('siginvest_payout_status'),
            dataIndex: 'status',
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
Ext.reg('siginvest-grid-payouts', siginvest.grid.Payouts);