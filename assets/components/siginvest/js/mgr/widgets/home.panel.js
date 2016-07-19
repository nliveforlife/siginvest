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
			html: '<h2>' + _('siginvest') + '</h2>',
			cls: '',
			style: {margin: '15px 0'}
		}, {
			xtype: 'modx-tabs',
			defaults: {border: false, autoHeight: true},
			border: true,
			hideMode: 'offsets',
			items: [{
				title: _('siginvest_projects'),
				layout: 'anchor',
				items: [{
					html: _('siginvest_intro_projects'),
					cls: 'panel-desc',
				}, {
					xtype: 'siginvest-grid-projects',
					cls: 'main-wrapper',
				}]
			},
				{
					title: _('siginvest_investors'),
					layout: 'anchor',
					items: [{
						html: _('siginvest_intro_investors'),
						cls: 'panel-desc',
					}, {
						xtype: 'siginvest-grid-investors',
						cls: 'main-wrapper',
					}]
				},
                {
                    title: _('siginvest_partners'),
                    layout: 'anchor',
                    items: [{
                        html: _('siginvest_intro_partners'),
                        cls: 'panel-desc',
                    }, {
                        xtype: 'siginvest-grid-partners',
                        cls: 'main-wrapper',
                    }]
                },
                {
                    title: _('siginvest_dividends'),
                    layout: 'anchor',
                    items: [{
                        html: _('siginvest_intro_dividends'),
                        cls: 'panel-desc',
                    }, {
                        xtype: 'siginvest-grid-dividends',
                        cls: 'main-wrapper',
                    }]
                },
                
                
			]
		}]
	});
	siginvest.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(siginvest.panel.Home, MODx.Panel);
Ext.reg('siginvest-panel-home', siginvest.panel.Home);
