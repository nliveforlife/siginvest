<?php
if (file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php')) {
    /** @noinspection PhpIncludeInspection */
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
}
else {
    require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';
/** @var siginvest $siginvest */
$siginvest = $modx->getService('siginvest', 'siginvest', $modx->getOption('siginvest_core_path', null, $modx->getOption('core_path') . 'components/siginvest/') . 'model/siginvest/');
$modx->lexicon->load('siginvest:default');

// handle request
$corePath = $modx->getOption('siginvest_core_path', null, $modx->getOption('core_path') . 'components/siginvest/');
$path = $modx->getOption('processorsPath', $siginvest->config, $corePath . 'processors/');
$modx->request->handleRequest(array(
	'processors_path' => $path,
	'location' => '',
));
