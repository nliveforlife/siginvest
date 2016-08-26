<?php

/**
 * Create an Item
 */
class siginvestProjectItemCreateProcessor extends modObjectCreateProcessor {
	public $objectType = 'siginvestProject';
	public $classKey = 'siginvestProject';
	public $languageTopics = array('siginvest');
	public $permission = 'new_document';


	/**
	 * @return bool
	 */
	public function beforeSet() {
		$name = trim($this->getProperty('name'));
		if (empty($name)) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_project_err_name'));
		}
		elseif ($this->modx->getCount($this->classKey, array('name' => $name))) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_project_err_ae'));
		}
		//
		$unique = array('name','project_id');
		foreach ($unique as $tmp) {
			if ($this->modx->getCount($this->classKey, array($tmp => $this->getProperty($tmp), 'id:!=' => $this->getProperty('id')))) {
				$this->addFieldError($tmp, $this->modx->lexicon('siginvest_project_err_dup'));
			}
		}
		//

		return parent::beforeSet();
	}

}

return 'siginvestProjectItemCreateProcessor';