<?php
/** @var modX $modx */
/** @var Office $office */
if ($Office = $modx->getService('office', 'Office', MODX_CORE_PATH . 'components/office/model/office/')) {

	if (!($Office instanceof Office)) {
		$modx->log(xPDO::LOG_LEVEL_ERROR, '[siginvest] Could not register paths for Office component!');

		return true;
	}
	elseif (!method_exists($Office, 'addExtension')) {
		$modx->log(xPDO::LOG_LEVEL_ERROR, '[siginvest] You need to update Office for support of 3rd party packages!');

		return true;
	}

	/**@var array $options */
	switch ($options[xPDOTransport::PACKAGE_ACTION]) {
		case xPDOTransport::ACTION_INSTALL:
		case xPDOTransport::ACTION_UPGRADE:
			$Office->addExtension('siginvest', '[[++core_path]]components/siginvest/controllers/office/');
			$modx->log(xPDO::LOG_LEVEL_INFO, '[siginvest] Successfully registered siginvest as Office extension!');
			break;

		case xPDOTransport::ACTION_UNINSTALL:
			$Office->removeExtension('siginvest');
			$modx->log(xPDO::LOG_LEVEL_INFO, '[siginvest] Successfully unregistered siginvest as Office extension.');
			break;
	}
}
else {
	$modx->log(xPDO::LOG_LEVEL_ERROR, '[siginvest] Could not register paths for Office component!');
}

return true;