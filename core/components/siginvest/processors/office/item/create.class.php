<?php

/**
 * Create an Item
 */
class siginvestOfficeItemCreateProcessor extends modObjectCreateProcessor {
	public $objectType = 'siginvestItem';
	public $classKey = 'siginvestItem';
	public $languageTopics = array('siginvest');
	//public $permission = 'create';


	/**
	 * @return bool
	 */
	public function beforeSet() {
		$name = trim($this->getProperty('name'));
		if (empty($name)) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_item_err_name'));
		}
		elseif ($this->modx->getCount($this->classKey, array('name' => $name))) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_item_err_ae'));
		}

		return parent::beforeSet();
	}

}

return 'siginvestOfficeItemCreateProcessor';