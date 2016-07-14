<?php

/**
 * Remove an Items
 */
class siginvestOfficeItemRemoveProcessor extends modObjectProcessor {
	public $objectType = 'siginvestItem';
	public $classKey = 'siginvestItem';
	public $languageTopics = array('siginvest');
	//public $permission = 'remove';


	/**
	 * @return array|string
	 */
	public function process() {
		if (!$this->checkPermissions()) {
			return $this->failure($this->modx->lexicon('access_denied'));
		}

		$ids = $this->modx->fromJSON($this->getProperty('ids'));
		if (empty($ids)) {
			return $this->failure($this->modx->lexicon('siginvest_item_err_ns'));
		}

		foreach ($ids as $id) {
			/** @var siginvestItem $object */
			if (!$object = $this->modx->getObject($this->classKey, $id)) {
				return $this->failure($this->modx->lexicon('siginvest_item_err_nf'));
			}

			$object->remove();
		}

		return $this->success();
	}

}

return 'siginvestOfficeItemRemoveProcessor';