<?php

/**
 * Class siginvestMainController
 */
abstract class siginvestMainController extends modExtraManagerController {
	/** @var siginvest $siginvest */
	public $siginvest;


	/**
	 * @return void
	 */
	public function initialize() {
		$corePath = $this->modx->getOption('siginvest_core_path', null, $this->modx->getOption('core_path') . 'components/siginvest/');
		require_once $corePath . 'model/siginvest/siginvest.class.php';

		$this->siginvest = new siginvest($this->modx);
		//$this->addCss($this->siginvest->config['cssUrl'] . 'mgr/main.css');
		$this->addJavascript($this->siginvest->config['jsUrl'] . 'mgr/siginvest.js');
		$this->addHtml('
		<script type="text/javascript">
			siginvest.config = ' . $this->modx->toJSON($this->siginvest->config) . ';
			siginvest.config.connector_url = "' . $this->siginvest->config['connectorUrl'] . '";
		</script>
		');

		parent::initialize();
	}


	/**
	 * @return array
	 */
	public function getLanguageTopics() {
		return array('siginvest:default');
	}


	/**
	 * @return bool
	 */
	public function checkPermissions() {
		return true;
	}
}


/**
 * Class IndexManagerController
 */
class IndexManagerController extends siginvestMainController {

	/**
	 * @return string
	 */
	/* какой дальше загружается контроллер:
	/core/components/....../controllers/home.class.php
	  */
	public static function getDefaultController() {
		return 'home';
	}
}