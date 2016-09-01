<?php

/**
 * Create an Item
 */
class siginvestProjectCreateProcessor extends modObjectCreateProcessor {
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
		
		$unique = array('name','project_id');
		foreach ($unique as $tmp) {
			if ($this->modx->getCount($this->classKey, array($tmp => $this->getProperty($tmp), 'id:!=' => $this->getProperty('id')))) {
				$this->addFieldError($tmp, $this->modx->lexicon('siginvest_project_err_dup'));
			}
		}

		/*
			we check if project_id exist^
		*/
		$project_id = $this->getProperty('project_id');
		global $modx;
		if (!$modx->getObject('modResource', $project_id)) {
			$this->addFieldError('project_id', $this->modx->lexicon('siginvest_project_err_pr_not_exist'));
		}
		// End of check

		$published = $this->getProperty('published');
		$this->setProperty('published', !empty($published) && $published != 'false');

		$dev_buyback = $this->getProperty('dev_buyback');
		$this->setProperty('dev_buyback', !empty($dev_buyback) && $dev_buyback != 'false');


		return parent::beforeSet();
	}

	/**
	 * @return boolean
	 */
	public function afterSave() {
		global $modx;
		$newPartner = $modx->newObject("sigPartner", array(
			'user_id' => $this->getProperty('partner_id')
			,'partner_project_id' => $this->getProperty('project_id')
			,
			));
		$newPartner->save();

		// Set price to msProduct
		$part_price = $this->getProperty('current_part_price');
		$project_id = $this->getProperty('project_id');
		global $modx;
		$msProduct =  $modx->getObject('msProduct', $project_id);
	//	$price = $msProduct->get('price');
		$msProduct->set('price', $part_price);
		$msProduct->save();

		// End of  set price

		return true; }



}

return 'siginvestProjectCreateProcessor';