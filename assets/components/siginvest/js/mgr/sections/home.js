siginvest.page.Home = function (config) {
	config = config || {};
	Ext.applyIf(config, {
		components: [{
			xtype: 'siginvest-panel-home', renderTo: 'siginvest-panel-home-div'
		}]
	});
	siginvest.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(siginvest.page.Home, MODx.Component);
Ext.reg('siginvest-page-home', siginvest.page.Home);