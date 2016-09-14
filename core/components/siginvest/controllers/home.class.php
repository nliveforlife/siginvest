<?php

/**
 * The home manager controller for siginvest.
 *
 */
class siginvestHomeManagerController extends siginvestMainController {
	/* @var siginvest $siginvest */
	public $siginvest;


	/**
	 * @param array $scriptProperties
	 */
	public function process(array $scriptProperties = array()) {
	}


	/**
	 * @return null|string
	 */
	public function getPageTitle() {
		return $this->modx->lexicon('siginvest');
	}


	/**
	 * @return void
	 */
	public function loadCustomCssJs() {
		$this->addCss($this->siginvest->config['cssUrl'] . 'mgr/main.css');
		$this->addCss($this->siginvest->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/misc/utils.js');
	//	$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/items.grid.js');
		
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/projects.grid.js');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/payouts.grid.js');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/partners.grid.js');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/dividends.grid.js');

	//	$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/items.windows.js');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/widgets/home.panel.js');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/sections/home.js');
		$this->addHtml('<script type="text/javascript">
		Ext.onReady(function() {
			MODx.load({ xtype: "siginvest-page-home"});
		});
		</script>');
	}


	/**
	 * @return string
	 */
	public function getTemplateFile() {
		return $this->siginvest->config['templatesPath'] . 'home.tpl';
	}
}