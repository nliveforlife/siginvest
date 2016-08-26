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


	public function initialize() {
		$primaryKey = $this->getProperty($this->primaryKeyField, false);
		if (empty($primaryKey)) return $this->modx->lexicon('siginvest_project_err_ns');
		$this->object = $this->modx->getObject($this->classKey, $primaryKey);

		return parent::initialize();
	}

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
	 */
	public function beforeSet()  {
		$required = array('name', 'project_id');
		foreach ($required as $tmp) {
			if (!$this->getProperty($tmp)) {
				$this->addFieldError($tmp, $this->modx->lexicon('field_required'));
			}
		}

		$unique = array('name','project_id');
		foreach ($unique as $tmp) {
			if ($this->modx->getCount($this->classKey, array($tmp => $this->getProperty($tmp), 'id:!=' => $this->getProperty('id')))) {
				$this->addFieldError($tmp, $this->modx->lexicon('siginvest_project_err_dup'));
			}
		}

		$active = $this->getProperty('active');
		$this->setProperty('active', !empty($active) && $active != 'false');

		return !$this->hasErrors();
	}

}

return 'siginvestProjectUpdateProcessor';
