var siginvest = function (config) {
	config = config || {};
	siginvest.superclass.constructor.call(this, config);
};
Ext.extend(siginvest, Ext.Component, {
	page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}
});
Ext.reg('siginvest', siginvest);

siginvest = new siginvest();