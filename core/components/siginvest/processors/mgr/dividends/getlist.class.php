<?php

/**
 * Get a list of Devidends
 */
class siginvestsigDevidendsGetListProcessor extends modObjectGetListProcessor {
	public $objectType = 'sigDevidends';
	public $classKey = 'sigDevidends';
	public $defaultSortField = 'id';
	public $defaultSortDirection = 'DESC';
	//public $permission = 'list';
	public $renderers = '';

	/**
	 * * We doing special check of permission
	 * because of our objects is not an instances of modAccessibleObject
	 *
	 * @return boolean|string
	 */
	public function beforeQuery() {
		if (!$this->checkPermissions()) {
			return $this->modx->lexicon('access_denied');
		}

		return true;
	}


	/**
	 * @param xPDOQuery $c
	 *
	 * @return xPDOQuery
	 */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		$query = trim($this->getProperty('query'));
		if ($query) {
			$c->where(array(
				'name:LIKE' => "%{$query}%",
				'OR:description:LIKE' => "%{$query}%",
			));
		}

		return $c;
	}


	/**
	 * @param xPDOObject $object
	 *
	 * @return array
	 */
	public function prepareRow(xPDOObject $object) {
		$array = $object->toArray();
		$array['actions'] = array();

		// Edit
		$array['actions'][] = array(
			'cls' => '',
			'icon' => 'icon icon-edit',
		//	'title' => $this->modx->lexicon('siginvest_dividend_update'),
			'title' => 'siginvest_dividend_update',
			//'multiple' => $this->modx->lexicon('siginvest_items_update'),
			// 'action' => 'updateDividend',
			'action' => 'updateDividend',
			'button' => true,
			'menu' => true,
			'type' => 'updateDividend'
		);

/*		if (!$array['active']) {
			$array['actions'][] = array(
				'cls' => '',
				'icon' => 'icon icon-power-off action-green',
				'title' => $this->modx->lexicon('siginvest_item_enable'),
				'multiple' => $this->modx->lexicon('siginvest_items_enable'),
				'action' => 'enableDividend',
				'button' => true,
				'menu' => true,
			);
		}
		else {
			$array['actions'][] = array(
				'cls' => '',
				'icon' => 'icon icon-power-off action-gray',
				'title' => $this->modx->lexicon('siginvest_item_disable'),
				'multiple' => $this->modx->lexicon('siginvest_items_disable'),
				'action' => 'disableDividend',
				'button' => true,
				'menu' => true,
			);
		}
*/
		// Remove
		$array['actions'][] = array(
			'cls' => '',
			'icon' => 'icon icon-trash-o action-red',
			'title' => $this->modx->lexicon('siginvest_dividend_remove'),
			'multiple' => $this->modx->lexicon('siginvest_dividend_remove'),
			'action' => 'removeDividend',
			'button' => true,
			'menu' => true,
		);

		return $array;
	}

}

return 'siginvestsigDevidendsGetListProcessor';