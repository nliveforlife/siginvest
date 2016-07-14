Ext.onReady(function() {
	siginvest.config.connector_url = OfficeConfig.actionUrl;

	var grid = new siginvest.panel.Home();
	grid.render('office-siginvest-wrapper');

	var preloader = document.getElementById('office-preloader');
	if (preloader) {
		preloader.parentNode.removeChild(preloader);
	}
});