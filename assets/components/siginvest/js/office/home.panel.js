siginvest.panel.Home = function (config) {
	config = config || {};
	Ext.apply(config, {
		baseCls: 'modx-formpanel',
		layout: 'anchor',
		/*
		 stateful: true,
		 stateId: 'siginvest-panel-home',
		 stateEvents: ['tabchange'],
		 getState:function() {return {activeTab:this.items.indexOf(this.getActiveTab())};},
		 */
		hideMode: 'offsets',
		items: [{
			xtype: 'modx-tabs',
			defaults: {border: false, autoHeight: true},
			border: false,
			hideMode: 'offsets',
			items: [{
				title: _('siginvest_items'),
				layout: 'anchor',
				items: [{
					html: _('siginvest_intro_msg'),
					cls: 'panel-desc',
				}, {
					xtype: 'siginvest-grid-items',
					cls: 'main-wrapper',
				}]
			}]
		}]
	});
	siginvest.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(siginvest.panel.Home, MODx.Panel);
Ext.reg('siginvest-panel-home', siginvest.panel.Home);
