<?php

/**
 * Get an Item
 */
class siginvestItemGetProcessor extends modObjectGetProcessor {
	public $objectType = 'siginvestItem';
	public $classKey = 'siginvestItem';
	public $languageTopics = array('siginvest:default');
	//public $permission = 'view';


	/**
	 * We doing special check of permission
	 * because of our objects is not an instances of modAccessibleObject
	 *
	 * @return mixed
	 */
	public function process() {
		if (!$this->checkPermissions()) {
			return $this->failure($this->modx->lexicon('access_denied'));
		}

		return parent::process();
	}

}

return 'siginvestItemGetProcessor';