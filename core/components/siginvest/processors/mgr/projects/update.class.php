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
		// check field need_to_get
		$part_price = $this->getProperty('current_part_price');
		$parts_made = $this->getProperty('parts_made');
		$need_to_gather = $this->getProperty('need_to_gather');
		$real_need = $part_price * $parts_made;
		if ($real_need != $need_to_gather) {
			return $this->modx->lexicon('siginvest_project_err_sum');
		}
		// End check

		$published = $this->getProperty('published');
		$this->setProperty('published', !empty($published) && $published != 'false');

		$dev_buyback = $this->getProperty('dev_buyback');
		$this->setProperty('dev_buyback', !empty($dev_buyback) && $dev_buyback != 'false');

		return !$this->hasErrors();
	}

	public function afterSave() {
		// Set price to msProduct
		$part_price = $this->getProperty('current_part_price');
		$project_id = $this->getProperty('project_id');
		global $modx;
		$msProduct =  $modx->getObject('msProduct', $project_id);
		$price = $msProduct->get('price');
		if ($price !== $part_price) {
			$msProduct->set('price', $part_price);
			$msProduct->save();
		}
		// end
		return true;
	}


}

return 'siginvestProjectUpdateProcessor';
