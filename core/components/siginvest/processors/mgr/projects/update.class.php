<?php

/**
 * Update an Project
 */
// class siginvestProjectUpdateProcessor extends modObjectUpdateProcessor {
class siginvestProjectUpdateProcessor extends modObjectUpdateProcessor {
	public $objectType = 'siginvestProject';
	public $classKey = 'siginvestProject';
	public $languageTopics = array('siginvest');
	public $permission = 'edit_document';


	/**
	 * We doing special check of permission
	 * because of our objects is not an instances of modAccessibleObject
	 *
	 * @return bool|string
	 */
	public function beforeSave() {
		if (!$this->checkPermissions()) {
			return $this->modx->lexicon('access_denied');
		}

		return true;
	}


	/**
	 * @return bool
	 *
	public function beforeSet() {
		$id = (int)$this->getProperty('id');
		$name = trim($this->getProperty('name'));
		if (empty($id)) {
			return $this->modx->lexicon('siginvest_item_err_ns');
		}

		if (empty($name)) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_item_err_name'));
		}
		elseif ($this->modx->getCount($this->classKey, array('name' => $name, 'id:!=' => $id))) {
			$this->modx->error->addField('name', $this->modx->lexicon('siginvest_item_err_ae'));
		}

		return parent::beforeSet();
	}
*/


	/**
	 * @return bool
	 */
	public function beforeSet() {
		$required = array('name', 'template');
		foreach ($required as $tmp) {
			if (!$this->getProperty($tmp)) {
				$this->addFieldError($tmp, $this->modx->lexicon('field_required'));
			}
		}
		$unique = array('name');
		foreach ($unique as $tmp) {
			if ($this->modx->getCount($this->classKey, array('name' => $this->getProperty($tmp), 'id:!=' => $this->getProperty('id')))) {
				$this->addFieldError($tmp, $this->modx->lexicon('siginvest_item_err_ae'));
			}
		}
	//	$active = $this->getProperty('active');
	//	$this->setProperty('active', !empty($active) && $active != 'false');

	//	return !$this->hasErrors();

		return parent::beforeSet();
	}



}

return 'siginvestProjectUpdateProcessor';
